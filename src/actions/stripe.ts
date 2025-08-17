"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { StripeState } from "@/types/actions";
import { stripe } from "@/config/stripe";

export async function createStripeSession(
  prevState: StripeState,
  formData: FormData
): Promise<StripeState> {
  const priceId = formData.get("priceId");
  const user = await currentUser();

  if (!user) {
    return { status: "error", error: "ユーザーが見つかりません" };
  }

  if (!priceId) {
    return { status: "error", error: "価格IDが指定されていません" };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    let customerId = dbUser?.stripeCustomerId;

    // 既存の顧客IDがある場合、Stripeで有効性を確認
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch (error) {
        console.log(
          `既存の顧客ID ${customerId} が無効です。新しく作成します。`
        );
        customerId = null; // 無効な顧客IDをクリア
      }
    }

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        metadata: {
          clerkId: user.id,
        },
      });
      customerId = stripeCustomer.id;
      await prisma.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          stripeCustomerId: customerId,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId as string,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.BASE_URL}/dashboard/?success=true`,
      cancel_url: `${process.env.BASE_URL}/dashboard/?canceled=true`,
      metadata: {
        clerkId: user.id,
      },
    });

    if (!session.url) {
      throw new Error("セッションの作成に失敗しました");
    }

    return {
      status: "success",
      error: "",
      redirectUrl: session.url || undefined,
    };
  } catch (err) {
    console.error("Stripe session creation error:", err);
    return { status: "error", error: "セッションの作成に失敗しました" };
  }
}
