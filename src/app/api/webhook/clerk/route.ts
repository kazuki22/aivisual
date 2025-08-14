import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { createUser, updateUser, deleteUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const { id, email_addresses } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      try {
        const user = await createUser(id, email);
        return NextResponse.json({ user }, { status: 201 });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }

    if (evt.type === "user.updated") {
      const { id, email_addresses } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      try {
        const user = await updateUser(id, email);
        return NextResponse.json({ user }, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        throw new Error("Clerk ID is required");
      }

      try {
        const user = await deleteUser(id);
        return NextResponse.json({ user }, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to delete user" },
          { status: 500 }
        );
      }
    }

    return new Response("Webhook received", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response(
      JSON.stringify({
        error: "Error verifying webhook",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
