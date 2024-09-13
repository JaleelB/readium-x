"use server";

import OpenAI from "openai";
import { z } from "zod";
import { authenticatedAction } from "@/lib/safe-action";
import { getUser } from "@/data-access/users";
import { db } from "@/server/db/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";
import { rateLimitByIp } from "@/lib/limiter";

const summarizeArticleSchema = z.object({
  userId: z.number(),
  content: z.string(),
});

export const summarizeArticleAction = authenticatedAction
  .createServerAction()
  .input(summarizeArticleSchema)
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "summarize-article", limit: 2, window: 60000 });

    const authenticatedUser = await getUser(input.userId);
    if (!authenticatedUser) {
      throw new Error("User not found");
    }

    const user = await db
      .select({ openaiApiKey: users.openaiApiKey })
      .from(users)
      .where(eq(users.email, authenticatedUser.email as string))
      .then((rows) => rows[0]);

    if (!user?.openaiApiKey) {
      throw new Error("OpenAI API key not found");
    }

    const decryptedApiKey = decrypt(user.openaiApiKey);

    const openai = new OpenAI({
      apiKey: decryptedApiKey,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional summarizer. Provide a concise summary of the given text.",
        },
        {
          role: "user",
          content: `Summarize the following article:\n\n${input.content}`,
        },
      ],
    });

    const summary = response.choices[0]?.message?.content || "";
    console.log("Summary:", summary);
    return { summary };
  });
