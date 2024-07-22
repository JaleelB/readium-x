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
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useServerAction } from "zsa-react";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { resetPasswordAction } from "./actions";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { SparkleBg } from "@/components/sparkle-bg";

const registrationSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();

  const { execute, isPending, isSuccess } = useServerAction(
    resetPasswordAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        });
      },
    },
  );

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    execute(values);
  }

  return (
    <div className="dark relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-6 bg-background">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      {isSuccess && (
        <Alert
          variant="default"
          className="fixed right-0 top-0 w-full sm:right-8 sm:top-4 sm:w-fit"
        >
          <Terminal className="h-4 w-4" />
          <AlertTitle>Reset link sent</AlertTitle>
          <AlertDescription>
            We have sent you an email with a link to reset your password.
          </AlertDescription>
        </Alert>
      )}

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
              Forgot your password?
            </Balancer>
            <Balancer
              as="p"
              className="text-center text-sm text-muted-foreground"
            >
              No worries, we will rend you a link to reset your password.
            </Balancer>
          </div>
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

          <LoaderButton isLoading={isPending} className="w-full" type="submit">
            Send Reset Email
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
    </div>
  );
}
