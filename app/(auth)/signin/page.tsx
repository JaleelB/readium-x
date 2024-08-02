"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useServerAction } from "zsa-react";
import Link from "next/link";
import { signInAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import Balancer from "react-wrap-balancer";
import { SparkleBg } from "@/components/sparkle-bg";
import { OAuthButton } from "@/components/oauth-button";
import { toast } from "sonner";

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignInPage() {
  const { execute, isPending, error, reset } = useServerAction(signInAction, {
    onError({ err }) {
      toast.error(err.message);
    },
    onSuccess() {
      toast.success("You're in! Enjoy your session");
    },
  });

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute(values);
  }

  return (
    <div className="dark relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-3 bg-background">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="z-20 w-full max-w-sm space-y-6 rounded-lg border bg-background/95 px-6 py-6 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <Link href="/" className="flex w-full items-center justify-center">
            <div
              role="img"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-white"
            >
              <Icons.logo className="text-white dark:text-background" />
            </div>
          </Link>
          <div className="flex flex-col space-y-1.5">
            <Balancer
              as="h3"
              className="text-center text-2xl font-semibold tracking-tight"
            >
              Welcome back to ReadiumX
            </Balancer>
            <Balancer className="text-center text-sm text-muted-foreground">
              Sign in to your account
            </Balancer>
          </div>
          <div className="flex w-full flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex w-full justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      className="text-right text-xs underline"
                      href="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <LoaderButton isLoading={isPending} className="w-full" type="submit">
            Sign In
          </LoaderButton>

          {error && (
            <Alert
              variant="destructive"
              className="fixed right-0 top-0 w-full sm:right-8 sm:top-4 sm:w-fit"
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>Uhoh, we couldn&apos;t log you in</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Separator className="my-4 h-[1px] w-full shrink-0 bg-border" />

          <div className="space-y-4">
            <OAuthButton provider="google">Sign in with Google</OAuthButton>
            <OAuthButton provider="github">Sign in with Github</OAuthButton>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/signup">
              Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
