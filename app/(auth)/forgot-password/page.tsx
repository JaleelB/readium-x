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
    }
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
    <div className="relative w-full h-full flex flex-col flex-1 items-center justify-center bg-background dark space-y-6">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      {isSuccess && (
        <Alert
          variant="default"
          className="fixed top-0 right-0 sm:top-4 sm:right-8 w-full sm:w-fit"
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
              Forgot your password?
            </Balancer>
            <Balancer
              as="p"
              className="text-sm text-muted-foreground text-center"
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
        className="text-muted-foreground underline flex items-center"
      >
        <Icons.arrowLeft className="mr-2 h-4 w-4" />
        Back to sign in
      </Link>
    </div>
  );
}
