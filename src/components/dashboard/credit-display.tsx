import React, { Suspense } from "react";
import { getUserCredits } from "@/lib/credits";
import { currentUser } from "@clerk/nextjs/server";
import { Lock, Loader2 } from "lucide-react";

async function CreditContent() {
  const user = await currentUser();
  const credits = await getUserCredits();
  if (!user) {
    return (
      <div className="rounded-lg p-4 bg-gray-100/80 dark:bg-gray-800/50">
        <div className="text-sm font-medium text-muted-foreground">
          残りクレジット
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-3" />
          <span>ログインが必要です</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 bg-gray-100/80 dark:bg-gray-800/50">
      <div className="text-sm font-medium text-muted-foreground">
        残りクレジット
      </div>
      <div className="mt-2 font-bold text-2xl">{credits}</div>
    </div>
  );
}

const CreditDisplay = async () => {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg p-4 bg-gray-100/80 dark:bg-gray-800/50">
          <div className="text-sm font-medium text-muted-foreground">
            残りクレジット
          </div>
          <div className="mt-2 flex items-center">
            <Loader2 className="size-4 animate-spin" />
            <span className="ml-2 text-muted-foreground">更新中です...</span>
          </div>
        </div>
      }
    >
      <CreditContent />
    </Suspense>
  );
};

export default CreditDisplay;
