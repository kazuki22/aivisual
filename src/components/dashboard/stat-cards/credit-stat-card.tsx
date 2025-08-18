"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";

interface CreditStatCardProps {
  index: number;
}

interface CreditsData {
  credits: number;
  subscriptionStatus: string;
}

const CreditStatCard = ({ index }: CreditStatCardProps) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/credits", {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("認証が必要です");
          } else if (response.status === 404) {
            throw new Error("ユーザーが見つかりません");
          } else {
            throw new Error(`APIエラー: ${response.status}`);
          }
        }

        const data: CreditsData = await response.json();
        setCredits(data.credits);
        setSubscriptionStatus(data.subscriptionStatus);
      } catch (error) {
        console.error("Failed to fetch credits:", error);
        setError(
          error instanceof Error
            ? error.message
            : "クレジット取得に失敗しました"
        );
        setCredits(null);
      } finally {
        setLoading(false);
      }
    };

    if (userLoaded && isSignedIn) {
      fetchCredits();
    }
  }, [userLoaded, isSignedIn]);

  // プラン別のクレジット制限を設定
  const getPlanCredits = () => {
    switch (subscriptionStatus) {
      case "STARTER":
        return 50; // Starterプラン
      case "PRO":
        return 100; // Proプラン
      case "ENTERPRISE":
        return 300; // Enterpriseプラン
      default:
        return 5; // 無料プラン
    }
  };

  const currentPlanCredits = getPlanCredits();

  if (loading) {
    return (
      <div>
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  残りクレジット
                </p>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    読み込み中...
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  残りクレジット
                </p>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    エラー: {error}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (credits === null) {
    return (
      <div>
        <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  残りクレジット
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-foreground">--</span>
                  <span className="text-sm text-muted-foreground">/ --</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                残りクレジット
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {credits}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {currentPlanCredits}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditStatCard;
