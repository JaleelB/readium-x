import React from "react";
import Link from "next/link";

import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { OptionsMenu } from "./menu";
import { siteConfig } from "@/app-config";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import Nav from "./nav";
import { User } from "@/server/db/schema";

export type UserInfo =
  | { id: number; email: string | null; emailVerified: Date | null }
  | null
  | undefined;

async function SiteHeader() {
  let userSession = await getCurrentUser();
  let user: User | undefined = undefined;

  if (!userSession) {
    user = undefined;
  }

  if (userSession) {
    user = await getUser(userSession.id);
  }

  return <Nav user={user} />;
}

export default SiteHeader;
