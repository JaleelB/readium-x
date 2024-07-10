"use client";

import { z } from "zod";

import { buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useServerAction } from "zsa-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { signInAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { useSparkle } from "@/hooks/use-sparkle";
import Balancer from "react-wrap-balancer";
import { SparkleBg } from "@/components/sparkle-bg";

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignInPage() {
  const { toast } = useToast();

  const { execute, isPending, error, reset } = useServerAction(signInAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      toast({
        title: "Let's Go!",
        description: "Enjoy your session",
      });
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
    <div className="relative w-full h-full flex flex-col flex-1 items-center justify-center space-y-3 bg-background dark">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border shadow-sm w-full max-w-sm text-foreground px-6 py-6 space-y-6 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <Link href="/" className="w-full flex justify-center items-center">
            <div
              role="img"
              className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center"
            >
              <Icons.logo className="text-white dark:text-background" />
            </div>
          </Link>
          <div className="flex flex-col space-y-1.5">
            <Balancer
              as="h3"
              className="font-semibold tracking-tight text-2xl text-center"
            >
              Welcome back to ReadiumX
            </Balancer>
            <Balancer className="text-sm text-muted-foreground text-center">
              Sign in to your account
            </Balancer>
          </div>
          <div className="flex flex-col gap-4 w-full">
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
                  <div className="flex justify-between w-full">
                    <FormLabel>Password</FormLabel>
                    <Link
                      className="text-xs text-right underline"
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
              className="fixed top-0 right-0 sm:top-4 sm:right-8 w-full sm:w-fit"
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>Uhoh, we couldn&apos;t log you in</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Separator className="shrink-0 bg-border h-[1px] w-full my-4" />

          <div className="space-y-4">
            <Link
              href="/api/login/google"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full"
              )}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Sign in with Google
            </Link>
            <Link
              href="/api/login/github"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full"
              )}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Link>
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
