"use client";

import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import { z } from "zod";
import Balancer from "react-wrap-balancer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { saveApiKeyAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";

const FormSchema = z
  .object({
    apiKey: z.string().min(2, {
      message: "API key is required",
    }),
  })
  .refine((data) => data.apiKey.length > 0, {
    path: ["apiKey"],
    message: "API key is required",
  });

export default function TokensForm({ userId }: { userId: number }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  const { execute, isPending, error, reset } = useServerAction(
    saveApiKeyAction,
    {
      onError({ err }) {
        toast.error(err.message);
        toast.dismiss();
        form.reset();
      },
      onSuccess() {
        toast.success("API key saved");
        toast.dismiss();
        form.reset();
      },
    },
  );

  function onSubmit(values: z.infer<typeof FormSchema>) {
    toast.loading("Saving API key...");
    const { apiKey } = values;

    execute({
      apiKey,
      path: "/account/settings/tokens",
      userId: userId,
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
              OpenAI API Key
            </Balancer>
            <Balancer as="p" className="text-sm text-muted-foreground">
              This api key is used to authenticate your requests to the OpenAI
              API.
            </Balancer>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="flex h-9 w-full max-w-[600px] border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        id="openai-api-key"
                        type="text"
                        placeholder="Enter your OpenAI API key"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-between border-t p-6 text-xs text-muted-foreground">
            <Balancer className="font-medium">
              Note: You can obtain your OpenAI API key from{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                className="underline"
              >
                your OpenAI account.
              </a>
            </Balancer>
            <LoaderButton
              className="inline-flex h-9 items-center justify-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              type="submit"
              isLoading={isPending}
            >
              Save API Key
            </LoaderButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
