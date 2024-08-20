"use client";

import { Input } from "@/components/ui/input";
import { env } from "@/env";
import Balancer from "react-wrap-balancer";
import { updateUserAction } from "../actions";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";

const userNameSchema = z.object({
  displayName: z.string().min(1).max(32),
});

export default function UserName({ id, name }: { id: number; name: string }) {
  const form = useForm<z.infer<typeof userNameSchema>>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      displayName: name,
    },
  });

  const { execute: updateProfile, isPending: isUpdatePending } =
    useServerAction(updateUserAction, {
      onError({ err }) {
        toast.error(err.message);
      },
      onSuccess() {
        toast.success("User name updated");
      },
    });

  function onSubmit(values: z.infer<typeof userNameSchema>) {
    updateProfile({
      ...values,
      userId: id,
      path: "/account/settings",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-lg border bg-background text-card-foreground">
          <div className="flex flex-col space-y-1.5 p-6">
            <Balancer
              as="h3"
              className="mb-2 text-lg font-medium leading-none tracking-tight"
            >
              User&apos;s Name
            </Balancer>
            <Balancer as="p" className="text-sm text-muted-foreground">
              This is your user visible name within {env.NEXT_PUBLIC_APP_NAME}.
            </Balancer>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="flex h-9 w-full max-w-[600px] border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        maxLength={32}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-between border-t p-6 text-xs text-muted-foreground">
            <Balancer>Please use 32 characters at maximum.</Balancer>
            <LoaderButton
              className="inline-flex h-9 items-center justify-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              type="submit"
              isLoading={isUpdatePending}
            >
              Save
            </LoaderButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
