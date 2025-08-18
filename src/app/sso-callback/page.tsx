"use client";

import { AuthenticateWithRedirectCallback, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SSOCallbackPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // セッションが確立されたら確実にダッシュボードへ
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
