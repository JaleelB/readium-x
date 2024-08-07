"use client";

import { Input } from "@/components/ui/input";
import { env } from "@/env";
import Balancer from "react-wrap-balancer";
import { getUserProfileAction, updateUserAction } from "../actions";
import { useEffect, useState } from "react";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import { User } from "lucia";

type Profile = {
  displayName: string | null;
  id: number;
  userId: number;
  imageId: string | null;
  image: string | null;
  bio: string;
};

const userNameSchema = z.object({
  displayName: z.string().min(1).max(32),
});

export default function UserName({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const form = useForm<z.infer<typeof userNameSchema>>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      displayName: profile?.displayName as string,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userProfile = await getUserProfileAction({
        path: "/account/settings",
        userId: user.id,
      });
      return userProfile;
    };

    fetchProfile().then((result) => {
      if (result[0]) {
        setProfile(result[0]);
        form.setValue("displayName", result[0].displayName as string);
      } else if (result[1]) {
        toast.error(`Failed to fetch user name: ${result[1].message}`);
      }
    });
  }, [form, user.id]);

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
      userId: user.id as number,
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
