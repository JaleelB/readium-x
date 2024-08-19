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

export const convertTextToSpeechAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      text: z.string(),
      model: z.string(),
      voice: z.string(),
      speed: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "text-to-speech", limit: 10, window: 60000 });

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

    const mp3 = await openai.audio.speech.create({
      model: input.model,
      voice: input.voice.toLowerCase() as APIVoiceOptions,
      input: input.text,
      speed: input.speed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBuffer = buffer.toString("base64");

    return { audioBuffer };
  });

export const getApiKeyStatusAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "get-api-key", limit: 10, window: 60000 });

    const authenticatedUser = await getUser(input.userId);
    if (!authenticatedUser) {
      throw new Error("User not found");
    }

    const user = await db
      .select({ openaiApiKey: users.openaiApiKey })
      .from(users)
      .where(eq(users.email, authenticatedUser.email as string))
      .then((rows) => rows[0]);

    let maskedKey = null;
    if (user?.openaiApiKey) {
      const decryptedKey = decrypt(user.openaiApiKey);
      maskedKey = `sk-${"*".repeat(decryptedKey.length - 6)}${decryptedKey.slice(-4)}`;
    }

    revalidatePath(input.path);
    return { maskedKey };
  });
