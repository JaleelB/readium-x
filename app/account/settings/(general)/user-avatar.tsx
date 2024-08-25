import { Input } from "@/components/ui/input";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import { Profile } from "@/server/db/schema";

export default function UserAvatar({
  id,
  profile,
}: {
  id: number;
  profile: Profile;
}) {
  return (
    <div className="rounded-lg border bg-background text-card-foreground">
      <div className="flex items-center justify-between pr-6">
        <div className="flex flex-col space-y-1.5 p-6">
          <Balancer
            as="h3"
            className="mb-2 text-lg font-medium leading-none tracking-tight"
          >
            User Avatar
          </Balancer>
          <Balancer as="p" className="text-sm text-muted-foreground">
            This is your user avatar. Click on the avatar to upload a custom one
            from your files.
          </Balancer>
        </div>
        <span className="relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-accent">
          {profile?.image ? (
            <Image
              src={profile.image}
              priority
              alt="User Avatar"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-[#ffb92e] text-white">
              <Balancer className="text-lg">
                {profile?.displayName?.[0] || "U"}
              </Balancer>
            </span>
          )}
          <Input type="file" style={{ display: "none" }} />
        </span>
      </div>
      <div className="flex items-center border-t p-6 text-xs text-muted-foreground">
        An avatar is optional but strongly recommended.
      </div>
    </div>
  );
}
