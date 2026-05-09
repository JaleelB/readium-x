"use server";

import OpenAI from "openai";
import { z } from "zod";
import { authenticatedAction } from "@/lib/safe-action";
import { db } from "@/server/db/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";
import { rateLimitByIp } from "@/lib/limiter";

const translateArticleSchema = z.object({
  userId: z.string(),
  content: z.string(),
  targetLanguage: z.string(),
});

export const translateArticleAction = authenticatedAction
  .createServerAction()
  .input(translateArticleSchema)
  .handler(async ({ input, ctx }) => {
    await rateLimitByIp({ key: "translate-article", limit: 2, window: 60000 });

    const user = await db
      .select({ openaiApiKey: users.openaiApiKey })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .then((rows) => rows[0]);

    if (!user?.openaiApiKey) {
      throw new Error("OpenAI API key not found");
    }

    const decryptedApiKey = decrypt(user.openaiApiKey);

    const openai = new OpenAI({
      apiKey: decryptedApiKey,
    });

    const chunkSize = 4000;
    const chunks = [];

    for (let i = 0; i < input.content.length; i += chunkSize) {
      chunks.push(input.content.slice(i, i + chunkSize));
    }

    const translatedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional translator. Translate the given text accurately while preserving its original meaning. Do not add or remove any content.",
            },
            {
              role: "user",
              content: `Translate the following text to ${input.targetLanguage}:\n\n${chunk}`,
            },
          ],
        });

        return response.choices[0]?.message?.content || "";
      }),
    );

    const translatedContent = translatedChunks.join("");

    return { translatedContent };
  });
