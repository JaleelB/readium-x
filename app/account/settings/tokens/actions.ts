"use server";

import OpenAI from "openai";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { rateLimitByIp } from "@/lib/limiter";
import { db } from "@/server/db/db";
import { decrypt, encrypt } from "@/lib/encryption";
import { getUser } from "@/data-access/users";
import { VoiceOptions } from "../text-to-speech/page";
import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type APIVoiceOptions = Lowercase<VoiceOptions>;

export async function verifyOpenAIApiKey(apiKey: string): Promise<boolean> {
  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a test assistant." },
        { role: "user", content: "Testing. Just say hi and nothing else." },
      ],
      max_tokens: 5,
    });

    if (!response.choices[0]?.message?.content) {
      console.warn("OpenAI response did not contain expected content");
      return false;
    }

    return response.choices[0]?.message?.content?.toLowerCase().includes("hi");
  } catch (error) {
    console.error("Error verifying OpenAI API key:", error);
    return false;
  }
}

export const saveApiKeyAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      apiKey: z.string().min(1, "API key is required"),
      path: z.string(),
      userId: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "save-api-key", limit: 5, window: 60000 });

    if (!input.apiKey) {
      throw new Error("API key is missing");
    }

    const authenticatedUser = await getUser(input.userId);
    if (!authenticatedUser) {
      throw new Error("User not found");
    }

    // Verify the API key
    const isValidKey = await verifyOpenAIApiKey(input.apiKey);
    if (!isValidKey) {
      throw new Error("Invalid OpenAI API key");
    }

    const encryptedKey = encrypt(input.apiKey);

    await db
      .update(users)
      .set({ openaiApiKey: encryptedKey })
      .where(eq(users.email, authenticatedUser.email as string));

    revalidatePath(input.path);
  });