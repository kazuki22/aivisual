import { NextRequest } from "next/server";
import { stripe } from "@/config/stripe";
import { NextResponse } from "next/server";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/lib/subscriptions";
import Stripe from "stripe";

// webhookの処理を確実に行うための設定
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let event;
    const body = await request.text();
    const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    //Stripeの署名認証処理
    if (endPointSecret) {
      const signature = request.headers.get("stripe-signature") as string;
      try {
        event = stripe.webhooks.constructEvent(body, signature, endPointSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new NextResponse("Webhook signature verification failed", {
          status: 400,
        });
      }
    }

    if (!event) {
      return new NextResponse("Webhook processing failed", { status: 500 });
    }

    const subscription = event.data.object as Stripe.Subscription;

    //Webhookの種類に応じて処理を分岐
    switch (event.type) {
      case "customer.subscription.created": {
        await handleSubscriptionCreated(subscription);
        return NextResponse.json({ success: true }, { status: 200 });
        break;
      }

      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(subscription);
        return NextResponse.json({ success: true }, { status: 200 });
        break;
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(subscription);
        return NextResponse.json({ success: true }, { status: 200 });
        break;
      }

      default:
        return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
