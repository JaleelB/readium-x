import React from "react";
import Balancer from "react-wrap-balancer";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import TokensForm from "./tokens-form";
import { SuspenseIf } from "@/components/suspense-if";
import { getApiKeyStatusAction } from "./actions";

async function TokensFormWrapper({ userId }: { userId: number }) {
  const [data, err] = await getApiKeyStatusAction({
    path: "/account/settings/tokens",
    userId,
  });

  if (!data?.maskedKey || err) {
    return null;
  }

  return <TokensForm userId={userId} initialMaskedKey={data.maskedKey} />;
}

export default async function TokensPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const [data, _] = await getApiKeyStatusAction({
    path: "/account/settings/tokens",
    userId: user.id,
  });

  return (
    <div className="h-full w-full flex-1 pb-8">
      <main className="flex-1 space-y-12">
        <div className="flex flex-col space-y-2">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Api Keys
          </Balancer>
          <Balancer as="p" className="text-muted-foreground">
            These api keys are used to authenticate your requests to the
            different integrations.
          </Balancer>
        </div>
        {/* <TokensForm userId={user?.id as number} /> */}
        <SuspenseIf
          condition={!!data?.maskedKey}
          fallback={
            <div className="flex h-[450px] flex-col space-y-4 rounded-lg bg-muted p-6" />
          }
        >
          <TokensFormWrapper userId={user?.id as number} />
        </SuspenseIf>
      </main>
    </div>
  );
}
