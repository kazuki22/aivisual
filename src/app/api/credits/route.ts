import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 認証されたユーザーを取得
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // DBユーザーを保証（存在しない場合は作成、存在する場合はメールを更新）
    const primaryEmail =
      user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";

    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { email: primaryEmail },
      create: { clerkId: user.id, email: primaryEmail },
      select: {
        credits: true,
        subscriptionStatus: true,
      },
    });

    // クレジット数を返す
    return NextResponse.json({
      credits: dbUser.credits,
      subscriptionStatus: dbUser.subscriptionStatus,
    });
  } catch (error) {
    console.error("クレジット取得エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
