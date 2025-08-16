import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function SSOCallbackPage() {
  const user = await currentUser();

  // サインイン済みでない場合はトップへ
  if (!user) {
    redirect("/sign-in");
  }

  // DB上のユーザーを保証
  const primaryEmail =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    "";

  await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: primaryEmail,
    },
    create: {
      clerkId: user.id,
      email: primaryEmail,
      // credits / subscriptionStatus は schema のデフォルトを使用
    },
  });

  redirect("/dashboard");
}
