import { describe, expect, it } from "vitest";
import { bookmarks, readingHistory } from "@/server/db/schema";

describe("article persistence boundaries", () => {
  it("keeps full article content on bookmarks only", () => {
    expect(bookmarks.htmlContent).toBeDefined();
    expect(bookmarks.textContent).toBeDefined();
    expect(readingHistory).not.toHaveProperty("htmlContent");
    expect(readingHistory).not.toHaveProperty("textContent");
  });
});
