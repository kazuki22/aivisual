// import { prisma } from "./prisma";
// import Stripe from "stripe";
// import { STRIPE_PRICE_IDS } from "@/config/plans";
// import { SubscriptionStatus } from "@prisma/client";

// function getPlanDetails(subscription: Stripe.Subscription) {
//   const priceId = subscription.items.data[0].price.id;
//   let status = "FREE";
//   let credits = 5;

//   switch (priceId) {
//     case STRIPE_PRICE_IDS.STARTER:
//       status = "STARTER";
//       credits = 50;
//       break;
//     case STRIPE_PRICE_IDS.PRO:
//       status = "PRO";
//       credits = 100;
//       break;
//     case STRIPE_PRICE_IDS.ENTERPRISE:
//       status = "ENTERPRISE";
//       credits = 300;
//       break;
//   }
//   return { priceId, status, credits };
// }

// export async function handleSubscriptionCreated(
//   subscription: Stripe.Subscription
// ) {
//   const { priceId, status, credits } = getPlanDetails(subscription);

//   return prisma.user.update({
//     where: { stripeCustomerId: subscription.customer as string },
//     data: {
//       subscriptionStatus: status as SubscriptionStatus,
//       credits: credits,
//       subscriptions: {
//         create: {
//           stripeSubscriptionId: subscription.id,
//           stripePriceID: priceId,
//           stripeCurrentPeriodEnd: new Date(
//             (subscription as any).current_period_end * 1000
//           ),
//         },
//       },
//     },
//   });
// }

// export async function handleSubscriptionUpdated(
//     subscription: Stripe.Subscription
// ) {
//   const { priceId, status, credits } = getPlanDetails(subscription);

//   return prisma.user.update({
//     where: { stripeCustomerId: subscription.customer as string },
//     data: {
//       subscriptionStatus: subscription.cancel_at_period_end ? "FREE" : status as SubscriptionStatus,
//       credits: subscription.cancel_at_period_end ? 5 : credits,
//       subscriptions: {
//         update: {
//           stripeSubscriptionId: subscription.id,
//           stripePriceID: priceId,
//           stripeCurrentPeriodEnd: new Date(
//             (subscription as any).current_period_end * 1000
//           ),
//         },
//       },
//     },
//   });
// }

// export async function handleSubscriptionDeleted(
//     subscription: Stripe.Subscription
// ) {
//   return prisma.user.update({
//     where: { stripeCustomerId: subscription.customer as string },
//     data: {
//       subscriptionStatus: "FREE",
//       credits: 5,
//       subscriptions: {
//         delete: {
//           stripeSubscriptionId: subscription.id,
//         },
//       },
//     },
//   });
// }

//ここからテストコード

import { prisma } from "./prisma";
import { stripe } from "@/config/stripe";
import Stripe from "stripe";
import { STRIPE_PRICE_IDS } from "@/config/plans";
import { SubscriptionStatus } from "@prisma/client";

type SubWithPeriod = Stripe.Subscription & {
  current_period_end?: number;
  current_period_start?: number;
};

function getPlanDetails(subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0].price.id;
  let status = "FREE";
  let credits = 5;

  switch (priceId) {
    case STRIPE_PRICE_IDS.STARTER:
      status = "STARTER";
      credits = 50;
      break;
    case STRIPE_PRICE_IDS.PRO:
      status = "PRO";
      credits = 100;
      break;
    case STRIPE_PRICE_IDS.ENTERPRISE:
      status = "ENTERPRISE";
      credits = 300;
      break;
  }
  return { priceId, status, credits };
}

async function resolvePeriodEnd(sub: Stripe.Subscription): Promise<Date> {
  try {
    const resp = await stripe.subscriptions.retrieve(sub.id);
    const full = resp as unknown as SubWithPeriod;

    const endUnix =
      typeof full.current_period_end === "number"
        ? full.current_period_end
        : undefined;
    if (typeof endUnix === "number" && !isNaN(endUnix)) {
      return new Date(endUnix * 1000);
    }

    const startUnix =
      typeof full.current_period_start === "number"
        ? full.current_period_start
        : undefined;
    if (typeof startUnix === "number" && !isNaN(startUnix)) {
      const d = new Date(startUnix * 1000);
      d.setMonth(d.getMonth() + 1);
      return d;
    }
  } catch (error) {}

  const fallback = new Date();
  fallback.setMonth(fallback.getMonth() + 1);
  return fallback;
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  const { priceId, status, credits } = getPlanDetails(subscription);

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    return;
  }

  const periodEnd = await resolvePeriodEnd(subscription);

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripePriceID: priceId,
      stripeCurrentPeriodEnd: periodEnd,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceID: priceId,
      stripeCurrentPeriodEnd: periodEnd,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: status as SubscriptionStatus,
      credits,
    },
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const { priceId, status, credits } = getPlanDetails(subscription);

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!user) {
    return;
  }

  const periodEnd = await resolvePeriodEnd(subscription);
  const isCancel = subscription.cancel_at_period_end === true;

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripePriceID: priceId,
      stripeCurrentPeriodEnd: periodEnd,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceID: priceId,
      stripeCurrentPeriodEnd: periodEnd,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: (isCancel ? "FREE" : status) as SubscriptionStatus,
      credits: isCancel ? 5 : credits,
    },
  });
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  return prisma.user.update({
    where: { stripeCustomerId: subscription.customer as string },
    data: {
      subscriptionStatus: "FREE",
      credits: 5,
      subscriptions: {
        delete: {
          stripeSubscriptionId: subscription.id,
        },
      },
    },
  });
}
