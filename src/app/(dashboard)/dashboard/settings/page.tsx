import PageContainer from "@/components/dashboard/page-container";
import PageHeader from "@/components/dashboard/page-header";
import ProfileSection from "@/components/dashboard/settings/profile-section";
import SubscriptionSettingsForm from "@/components/dashboard/settings/subscription-settings-form";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

const SettingsPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
    include: {
      subscriptions: true,
    },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <PageContainer>
      <PageHeader
        title="設定"
        description="アカウント設定とサブスクリプション設定を管理します。"
      />
      <div className="max-w-2xl">
        <ProfileSection
          email={dbUser.email}
          subscriptionStatus={dbUser.subscriptionStatus}
          credits={dbUser.credits}
          nextBillingDate={dbUser.subscriptions?.stripeCurrentPeriodEnd}
        />
      </div>

      <div className="max-w-2xl">
        <SubscriptionSettingsForm
          subscriptionStatus={dbUser.subscriptionStatus}
        />
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
