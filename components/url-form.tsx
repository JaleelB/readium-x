"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { urlSchema } from "@/schemas/url";
import Cookies from "js-cookie";
import { validateMediumArticle } from "@/app/article/actions/url";
import { SubmitButton } from "./form-submit-button";
import { useState } from "react";
import SignInAction from "./sign-in-action";

const FormSchema = z.object({
  url: urlSchema,
});

export default function UrlForm({
  inputValue,
  isUser,
}: {
  inputValue?: string | null;
  isUser?: boolean;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: inputValue || "",
    },
  });
  const router = useRouter();
  const [openActionModal, setOpenActionModal] = useState(false);
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!isUser) {
      setOpenActionModal(true);
      return;
    }

    // Validate if the URL is a Medium article by fetching content and checking meta tags
    const isValidMedium = await validateMediumArticle(data.url);
    if (!isValidMedium) {
      form.setError("url", {
        type: "manual",
        message: "The URL is not a valid Medium article.",
      });
      return;
    }

    const id = uuidv4();
    Cookies.set(id, data.url, {
      expires: 1, // Cookie expires in 1 day
      secure: true,
      path: "/",
      sameSite: "strict", // Cookie is sent only when the request is coming from the same origin
    });

    router.push(`/article/${id}`);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative z-10 mt-2 h-[52px] w-full min-w-0 max-w-xl rounded-full bg-[#141414] p-1.5 dark:border dark:border-input dark:bg-[#191919] md:pl-4"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <>
                <FormItem className="h-full w-full">
                  <div className="relative flex h-full items-center justify-between rounded-full">
                    <Icons.sun className="ml-2 h-8 w-8 text-white sm:ml-0" />
                    <FormControl>
                      <Input
                        type="url"
                        className={cn(
                          "mx-4 h-5 w-full border-none bg-transparent p-0 text-neutral-100 placeholder-neutral-300 focus:placeholder-neutral-400 focus-visible:ring-0",
                        )}
                        placeholder="Paste Medium Article URL"
                        {...field}
                      />
                    </FormControl>
                    <SubmitButton isSubmitting={isSubmitting} />
                  </div>
                </FormItem>
                <FormMessage className="mt-4 text-center" />
              </>
            )}
          />
        </form>
      </Form>
      <SignInAction
        open={openActionModal}
        onOpenChange={(open: boolean) => {
          setOpenActionModal(open);
        }}
      />
    </>
  );
}
