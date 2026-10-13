import { afterEach, describe, expect, it, vi } from "vitest";
import { createWorker } from "./worker";

function harness(
  response = () =>
    new Response("page", { headers: { "content-type": "text/html" } }),
) {
  const fetch = vi.fn(async () => response());
  const load = vi.fn(async () => ({ fetch }));
  const pending: Promise<unknown>[] = [];
  const ctx = {
    waitUntil: (promise: Promise<unknown>) => {
      pending.push(promise);
    },
  };
  const worker = createWorker(load);
  const request = (path: string, init?: RequestInit) =>
    worker.fetch(new Request(`https://example.com${path}`, init), {}, ctx);
  return { worker, fetch, load, pending, ctx, request };
}

afterEach(() => vi.unstubAllGlobals());

describe("Worker fast paths", () => {
  it("redirects anonymous articles without loading OpenNext", async () => {
    const h = harness();
    for (const path of [
      "/article",
      "/article/abc",
      "/article/abc?url=https://medium.com/a",
    ]) {
      const response = await h.request(path);
      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe(
        "https://example.com/signin",
      );
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    }
    expect(h.load).not.toHaveBeenCalled();
  });

  it.each([
    "__session=token",
    "__session_abc=token",
    "__client_uat=1",
    "__client_uat_abc=1",
  ])("forwards article requests with %s unchanged to Clerk", async (cookie) => {
    const h = harness();
    const request = new Request("https://example.com/article/abc", {
      headers: { cookie },
    });
    const response = await h.worker.fetch(request, {}, h.ctx);
    expect(response.status).toBe(200);
    expect(h.fetch).toHaveBeenCalledWith(request, {}, h.ctx);
    expect(h.pending).toHaveLength(0);
  });

  it("preserves bearer auth and Clerk handshakes for server verification", async () => {
    const h = harness();
    await h.request("/article/abc", {
      headers: { authorization: "Bearer token" },
    });
    await h.request("/article/abc?__clerk_handshake=token");
    expect(h.fetch).toHaveBeenCalledTimes(2);
  });

  it("answers scanner requests without loading OpenNext", async () => {
    const h = harness();
    for (const path of [
      "/wp-login.php",
      "/wp-json",
      "/.env",
      "/.git/config",
      "/admin",
      "/xmlrpc",
      "/index.php/login",
    ]) {
      expect((await h.request(path)).status).toBe(404);
    }
    expect(h.load).not.toHaveBeenCalled();
  });
});

describe("public document edge cache", () => {
  function cacheHarness() {
    const entries = new Map<string, Response>();
    const match = vi.fn(async (key: Request) => entries.get(key.url)?.clone());
    const put = vi.fn(async (key: Request, response: Response) => {
      entries.set(key.url, response);
    });
    vi.stubGlobal("caches", { default: { match, put } });
    return { match, put };
  }

  it("caches separate page/host documents and serves hits without OpenNext", async () => {
    const cache = cacheHarness();
    const h = harness();
    for (const path of [
      "/",
      "/signin",
      "/signup",
      "/forgot-password",
      "/reset-password",
    ]) {
      expect((await h.request(path)).headers.get("x-readium-cache")).toBe(
        "miss",
      );
      await Promise.all(h.pending);
      expect((await h.request(path)).headers.get("x-readium-cache")).toBe(
        "hit",
      );
    }
    expect(h.load).toHaveBeenCalledTimes(5);
    expect(cache.put.mock.calls.map(([key]) => key.url)).toEqual([
      "https://example.com/",
      "https://example.com/signin",
      "https://example.com/signup",
      "https://example.com/forgot-password",
      "https://example.com/reset-password",
    ]);
    await h.worker.fetch(
      new Request("https://www.example.com/signin"),
      {},
      h.ctx,
    );
    expect(h.load).toHaveBeenCalledTimes(6);
  });

  it.each<RequestInit>([
    { headers: { cookie: "theme=dark" } },
    { headers: { cookie: "__session=token" } },
    { headers: { authorization: "Bearer token" } },
    { headers: { RSC: "1" } },
    { headers: { "next-router-state-tree": "state" } },
    { headers: { "next-router-prefetch": "1" } },
    { headers: { "next-action": "action" } },
    { headers: { purpose: "prefetch" } },
    { headers: { "sec-purpose": "prefetch;prerender" } },
    { method: "POST" },
  ])("bypasses both cache reads and writes for %j", async (init) => {
    const cache = cacheHarness();
    const h = harness();
    await h.request("/signin", init);
    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });

  it.each([
    "/signin?redirect_url=/article/abc",
    "/reset-password?email=user@example.com",
    "/?__clerk_handshake=token",
    "/signin?_rsc=abc",
    "/sso-callback",
    "/account",
    "/unknown",
  ])("does not cache %s", async (path) => {
    const cache = cacheHarness();
    await harness().request(path);
    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });

  it.each([
    () =>
      new Response("redirect", {
        status: 302,
        headers: { location: "/signin" },
      }),
    () => new Response("error", { status: 500 }),
    () =>
      new Response("cookie", {
        headers: {
          "content-type": "text/html",
          "set-cookie": "__session=token",
        },
      }),
    () =>
      new Response("{}", { headers: { "content-type": "application/json" } }),
  ])(
    "never stores redirects, errors, cookies or non-HTML responses",
    async (response) => {
      const cache = cacheHarness();
      await harness(response).request("/signin");
      expect(cache.put).not.toHaveBeenCalled();
    },
  );
});
