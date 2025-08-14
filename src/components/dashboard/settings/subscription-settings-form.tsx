"use client";

import React from "react";
import { SubscriptionStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscriptionSettingsFormProps {
  subscriptionStatus: SubscriptionStatus;
}

const SubscriptionSettingsForm = ({
  subscriptionStatus,
}: SubscriptionSettingsFormProps) => {
  const router = useRouter();
  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });
      const data = await response.json();
      router.push(data.url);
    } catch (error) {
      console.error("Error managing subscription:", error);
    }
  };

  return (
    <div className="grid gap-4 p-4 border rounded-lg">
      <div className="grid gap-2">
        {subscriptionStatus !== "FREE" ? (
          <>
            <p className="text-sm text-muted-foreground">現在のサブスクリプションを管理します</p>
            <Button onClick={handleManageSubscription}>
              サブスクリプション管理
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">サブスクリプションに登録していません。</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSettingsForm;
