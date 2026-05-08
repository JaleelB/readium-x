import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { afterLoginUrl } from "@/app-config";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect(afterLoginUrl);
  }

  return <SignUpForm />;
}
