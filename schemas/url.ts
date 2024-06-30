import { z } from "zod";

export const urlSchema = z
  .string()
  .min(1, { message: "URL field cannot be empty" })
  .url({ message: "Please enter a valid URL" });
