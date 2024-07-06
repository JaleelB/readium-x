"use client";

import { set, z } from "zod";
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
      expires: 1 / 288, // Cookie expires in 5 minutes (1/288 of a day)
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
          className="relative z-10 h-[52px] w-full min-w-0 max-w-xl bg-[#141414] dark:bg-[#191919] rounded-full p-1.5 md:pl-4 mt-2 dark:border dark:border-input"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <>
                <FormItem className="w-full h-full">
                  <div className="h-full rounded-full flex items-center justify-between relative">
                    <Icons.sun className="text-white w-8 h-8 ml-2 sm:ml-0" />
                    <FormControl>
                      <Input
                        type="url"
                        className={cn(
                          "w-full mx-4 h-5 p-0 bg-transparent text-neutral-100 placeholder-neutral-300 border-none focus-visible:ring-0 focus:placeholder-neutral-400"
                        )}
                        placeholder="Paste Medium Article URL"
                        {...field}
                      />
                    </FormControl>
                    <SubmitButton
                      isSubmitting={isSubmitting}
                      // onClick={() => {
                      //   setOpenActionModal(!openActionModal);
                      // }}
                    />
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
