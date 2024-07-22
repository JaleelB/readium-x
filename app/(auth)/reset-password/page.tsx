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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { changePasswordAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { useServerAction } from "zsa-react";
import { Icons } from "@/components/icons";
import Balancer from "react-wrap-balancer";
import { SparkleBg } from "@/components/sparkle-bg";

const registrationSchema = z
  .object({
    password: z.string().min(8),
    token: z.string(),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      password: "",
      token: searchParams.token,
      passwordConfirmation: "",
    },
  });

  const { execute, isPending, isSuccess, error } =
    useServerAction(changePasswordAction);

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute({
      token: values.token,
      password: values.password,
    });
  }

  return (
    <div className="dark relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-6 bg-background">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      {isSuccess && (
        <>
          <Alert
            variant="default"
            className="fixed right-0 top-0 w-full sm:right-8 sm:top-4 sm:w-fit"
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>
              Your password has been successfully updated.
            </AlertDescription>
          </Alert>

          <div className="z-20 w-full max-w-sm space-y-6 rounded-lg border bg-background/95 px-6 py-6 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Link href="/" className="flex w-full items-center justify-center">
              <div
                role="img"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-white"
              >
                <Icons.logo className="text-white dark:text-background" />
              </div>
            </Link>
            <div className="flex flex-col items-center gap-2">
              <Balancer
                as="h3"
                className="text-center text-2xl font-semibold tracking-tight"
              >
                All done!
              </Balancer>
              <Balancer
                as="p"
                className="text-center text-sm text-muted-foreground"
              >
                Your password has been successfully updated
              </Balancer>
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "mx-auto mt-4 w-full max-w-[230px]",
                )}
              >
                Login with new password
              </Link>
            </div>
          </div>
        </>
      )}

      {!isSuccess && (
        <>
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Uhoh, something went wrong</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="z-20 w-full max-w-sm space-y-6 rounded-lg border bg-background/95 px-6 py-6 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <Link
                href="/"
                className="flex w-full items-center justify-center"
              >
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
                  Set a new password
                </Balancer>
                <Balancer
                  as="p"
                  className="text-center text-sm text-muted-foreground"
                >
                  Your new password must be atleast 8 characters long.
                </Balancer>
              </div>
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
                        placeholder="Enter your new password"
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

              <LoaderButton
                isLoading={isPending}
                className="w-full"
                type="submit"
              >
                Reset Password
              </LoaderButton>
            </form>
          </Form>
          <Link
            href="/signin"
            className="flex items-center text-muted-foreground underline"
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}
