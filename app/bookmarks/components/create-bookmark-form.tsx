"use client";

import { useServerAction } from "zsa-react";
import { createBookmarkAction } from "@/app/bookmarks/bookmark";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scrapeArticleContent } from "@/app/article/actions/article";
import {
  getUrlWithoutPaywall,
  validateMediumArticle,
} from "@/app/article/actions/url";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { LoaderButton } from "@/components/loader-button";
import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";

const bookmarkSchema = z.object({
  url: z
    .string()
    .url({ message: "Invalid URL" })
    .min(1, { message: "A bookmark URL is required" }),
});

export function CreateBookmarkForm() {
  const { user } = useAuth();

  const { execute } = useServerAction(createBookmarkAction, {
    onError({ err }) {
      toast.error(err.message);
    },
  });

  const form = useForm<z.infer<typeof bookmarkSchema>>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      url: "",
    },
  });

  if (!user) {
    return (
      <div>
        <Label>Email</Label>
        <textarea
          className="mt-2 flex min-h-[80px] w-full rounded-md border border-none border-input bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          id="content"
          name="content"
          disabled
          placeholder="Paste an article URL here. I'll remember it."
          spellCheck="false"
        />
        <div
          className="mt-3 sm:justify-end"
          aria-disabled={form.formState.disabled}
        >
          <LoaderButton isLoading={form.formState.disabled}>
            Save Bookmark
          </LoaderButton>
        </div>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof bookmarkSchema>) {
    values.url = values.url.trim();

    toast.loading("Creating bookmark...");

    const isValidMedium = await validateMediumArticle(values.url);
    if (!isValidMedium) {
      form.setError("url", {
        type: "manual",
        message: "The URL is not a valid Medium article.",
      });
      toast.error("This URL is not a valid Medium article.");
      return;
    }

    const urlWithoutPaywall = await getUrlWithoutPaywall(values.url);
    if (urlWithoutPaywall instanceof Error) {
      form.setError("url", {
        type: "manual",
        message: "Failed to get article content",
      });
      toast.error("Failed to get article content.");
      return;
    }

    if (!user) {
      form.setError("url", {
        type: "manual",
        message: "You need to sign in to create a bookmark.",
      });
      toast.error("You need to sign in to create a bookmark.");
      return;
    }

    const scrapedArticle = await scrapeArticleContent(urlWithoutPaywall);
    const bookmarkContent = {
      path: "/bookmarks",
      userId: user.id,
      title: scrapedArticle?.title || "No title available",
      content: scrapedArticle?.content || "",
      authorName: scrapedArticle?.authorInformation.authorName || "",
      authorImageURL: scrapedArticle?.authorInformation.authorImageURL || "",
      authorProfileURL:
        scrapedArticle?.authorInformation.authorProfileURL || "",
      publicationName:
        scrapedArticle?.publicationInformation.publicationName || "",
      readTime: scrapedArticle?.publicationInformation.readTime || "",
      publishDate: scrapedArticle?.publicationInformation.publishDate || "",
    };

    execute(bookmarkContent);

    toast.success("Bookmark has been successfully created.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="mt-2 flex min-h-[80px] w-full rounded-md border border-none border-input bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  id="content"
                  name="content"
                  placeholder="Paste an article URL here. I'll remember it."
                  spellCheck="false"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter
          className="mt-3 sm:justify-end"
          aria-disabled={form.formState.disabled}
        >
          <LoaderButton isLoading={form.formState.disabled} type="submit">
            Save Bookmark
          </LoaderButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
