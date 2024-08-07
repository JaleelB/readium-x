import Balancer from "react-wrap-balancer";
import { UserName, UserAvatar, DeleteAccount } from "./general";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="z-20 w-full pb-8">
      <main className="space-y-12">
        <div className="flex flex-col space-y-2">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Settings
          </Balancer>
          <Balancer as="p" className="text-muted-foreground">
            Manage your account settings and preferences here.
          </Balancer>
        </div>
        <UserName.default user={user} />
        <UserAvatar.default user={user} />
        <DeleteAccount.default user={user} />
      </main>
    </div>
  );
}
