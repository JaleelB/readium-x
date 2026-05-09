import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createProfile, getProfile } from "@/data-access/profiles";
import { deleteUser, upsertUser } from "@/data-access/users";
import { generateRandomName } from "@/lib/names";

function getPrimaryEmail(data: any) {
  const primaryEmail = data.email_addresses?.find(
    (email: any) => email.id === data.primary_email_address_id,
  );

  return (
    primaryEmail?.email_address ??
    data.email_addresses?.[0]?.email_address ??
    null
  );
}

function getDisplayName(data: any) {
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ");
  return fullName || data.username || generateRandomName();
}

export async function POST(req: NextRequest) {
  let evt;

  try {
    evt = await verifyWebhook(req as any);
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Verification failed", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, image_url } = evt.data;
    const email = getPrimaryEmail(evt.data);

    await upsertUser({ id, email });

    const profile = await getProfile(id);
    if (!profile) {
      await createProfile(id, getDisplayName(evt.data), image_url ?? undefined);
    }
  }

  if (evt.type === "user.deleted" && evt.data.id) {
    await deleteUser(evt.data.id);
  }

  return new Response("OK", { status: 200 });
}
