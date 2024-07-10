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
import { useToast } from "@/components/ui/use-toast";
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
import { ExisitingUser } from "./bookmark-wrapper";
import { useState } from "react";

const bookmarkSchema = z.object({
  url: z
    .string()
    .url({ message: "Invalid URL" })
    .min(1, { message: "A bookmark URL is required" }),
});

export function CreateBookmarkForm({ user }: { user: ExisitingUser }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { execute } = useServerAction(createBookmarkAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof bookmarkSchema>>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bookmarkSchema>) {
    values.url = values.url.trim();

    toast({
      title: `Creating reating bookmark...`,
    });

    const isValidMedium = await validateMediumArticle(values.url);
    if (!isValidMedium) {
      form.setError("url", {
        type: "manual",
        message: "The URL is not a valid Medium article.",
      });
      toast({
        description: "This URL is not a valid Medium article.",
        variant: "destructive",
      });
      return;
    }

    const urlWithoutPaywall = await getUrlWithoutPaywall(values.url);
    if (urlWithoutPaywall instanceof Error) {
      form.setError("url", {
        type: "manual",
        message: "Failed to get article content",
      });
      toast({
        description: "Failed to get article content.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        description: "You need to sign in to create a bookmark.",
        variant: "destructive",
      });
      form.setError("url", {
        type: "manual",
        message: "You need to sign in to create a bookmark.",
      });
      return;
    }

    const scrapedArticle = await scrapeArticleContent(urlWithoutPaywall);
    const bookmarkContent = {
      path: "/bookmarks",
      userId: user.id,
      title: scrapedArticle?.title || "No title available",
      content: scrapedArticle?.content || "",
      articleImageSrc: scrapedArticle?.articleImageSrc || "",
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

    toast({
      description: "Bookmark has been successfully created.",
    });
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
                  className="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50  focus-visible:ring-0 border-none focus-visible:ring-offset-0 mt-2 bg-input"
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
          className="sm:justify-end mt-3"
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
