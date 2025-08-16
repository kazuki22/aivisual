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

    // データベースからユーザー情報を取得
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        credits: true,
        subscriptionStatus: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

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
