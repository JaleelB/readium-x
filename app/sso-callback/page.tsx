import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { afterLoginUrl } from "@/app-config";

export default function SsoCallbackPage() {
  return (
    <>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl={afterLoginUrl}
        signUpFallbackRedirectUrl={afterLoginUrl}
        signInUrl="/signin"
        signUpUrl="/signup"
      />
      <div id="clerk-captcha" />
    </>
  );
}
