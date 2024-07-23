import { cookies, headers } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { createGithubUserUseCase } from "@/use-cases/users";
import { getAccountByGithubIdUseCase } from "@/use-cases/accounts";
import { github } from "@/server/auth";
import { setSession } from "@/lib/session";
import { afterLoginUrl } from "@/app-config";

export async function GET(request: Request): Promise<Response> {
  const headersList = headers();
  const origin = headersList.get("origin");

  // Define allowed origins
  const allowedOrigins = ["https://www.readiumx.com", "https://readiumx.com"];

  // Set CORS headers
  const responseHeaders = new Headers();
  responseHeaders.set("Access-Control-Allow-Credentials", "true");
  responseHeaders.set(
    "Access-Control-Allow-Origin",
    allowedOrigins.includes(origin!) ? origin! : allowedOrigins[0],
  );
  responseHeaders.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  responseHeaders.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle preflight request
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: responseHeaders });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingAccount = await getAccountByGithubIdUseCase(githubUser.id);

    if (existingAccount) {
      await setSession(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location: afterLoginUrl,
        },
      });
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );
      const githubUserEmails = await githubUserEmailResponse.json();

      githubUser.email = getPrimaryEmail(githubUserEmails);
    }

    const userId = await createGithubUserUseCase(githubUser);
    await setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: afterLoginUrl,
      },
    });
  } catch (e) {
    console.error(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
