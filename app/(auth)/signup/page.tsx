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
import { cn } from "@/lib/utils";
import { useServerAction } from "zsa-react";
import { signUpAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Icons } from "@/components/icons";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Balancer from "react-wrap-balancer";
import { SparkleBg } from "@/components/sparkle-bg";

const registrationSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export default function RegisterPage() {
  const { toast } = useToast();

  const { execute, isPending, error } = useServerAction(signUpAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute(values);
  }

  return (
    <div className="dark relative flex h-full min-h-screen w-full flex-col items-center justify-center space-y-3 bg-background">
      <SparkleBg sparkleCount={300} sparkleSize={3} />
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
              Welcome to ReadiumX
            </Balancer>
            <Balancer className="text-center text-sm text-muted-foreground">
              Create your account
            </Balancer>
          </div>
          <div className="flex flex-col gap-4">
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter Confirm your Password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <LoaderButton isLoading={isPending} className="w-full" type="submit">
            Register
          </LoaderButton>

          <Separator className="my-4 h-[1px] w-full shrink-0 bg-border" />

          <div className="space-y-4">
            <Link
              href="/api/login/google"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full",
              )}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Sign up with Google
            </Link>
            <Link
              href="/api/login/github"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full",
              )}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              Sign up with GitHub
            </Link>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link className="underline" href="/signin">
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
