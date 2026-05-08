import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { afterLoginUrl } from "@/app-config";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect(afterLoginUrl);
  }

  return <SignInForm />;
}
