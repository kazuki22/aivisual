import React from "react";

interface ProfileSectionProps {
  email: string;
  subscriptionStatus: string;
  credits: number;
  nextBillingDate?: Date;
}

const ProfileSection = ({
  email,
  subscriptionStatus,
  credits,
  nextBillingDate,
}: ProfileSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">プロフィール</h2>
      <div className="grid gap-4 p-4 border rounded-lg">
        <div className="grid gap-1">
          <p className="text-sm font-medium">メールアドレス</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="grid gap-1">
          <p className="text-sm font-medium">現在のプラン</p>
          <p className="text-sm text-muted-foreground">{subscriptionStatus}</p>
        </div>

        <div className="grid gap-1">
          <p className="text-sm font-medium">次回の更新日</p>
          <p className="text-sm text-muted-foreground">
            {nextBillingDate ? nextBillingDate.toLocaleDateString() : "未設定"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
