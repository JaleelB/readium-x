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
    <div className="relative w-full h-full flex flex-col flex-1 items-center justify-center bg-background dark space-y-6">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      {isSuccess && (
        <>
          <Alert
            variant="default"
            className="fixed top-0 right-0 sm:top-4 sm:right-8 w-full sm:w-fit"
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>
              Your password has been successfully updated.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border shadow-sm w-full max-w-sm text-foreground px-6 py-6 space-y-6 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Link href="/" className="w-full flex justify-center items-center">
              <div
                role="img"
                className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center"
              >
                <Icons.logo className="text-white dark:text-background" />
              </div>
            </Link>
            <div className="flex flex-col gap-2 items-center">
              <Balancer
                as="h3"
                className="font-semibold tracking-tight text-2xl text-center"
              >
                All done!
              </Balancer>
              <Balancer
                as="p"
                className="text-sm text-muted-foreground text-center"
              >
                Your password has been successfully updated
              </Balancer>
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "w-full max-w-[230px] mx-auto mt-4"
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
              className="rounded-lg border shadow-sm w-full max-w-sm text-foreground px-6 py-6 space-y-6 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <Link
                href="/"
                className="w-full flex justify-center items-center"
              >
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
                  Set a new password
                </Balancer>
                <Balancer
                  as="p"
                  className="text-sm text-muted-foreground text-center"
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
            className="text-muted-foreground underline flex items-center"
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}
