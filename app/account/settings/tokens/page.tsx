import React from "react";
import Balancer from "react-wrap-balancer";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import TokensForm from "./tokens-form";

export default async function TokensPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

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
        <TokensForm userId={user?.id as number} />
      </main>
    </div>
  );
}
