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

    // データベースからユーザー情報を取得（存在しない場合は作成）
    let dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        credits: true,
        subscriptionStatus: true,
      },
    });

    if (!dbUser) {
      const primaryEmail =
        user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "";

      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: primaryEmail,
          // credits / subscriptionStatus は Prisma のデフォルトを使用
        },
      });

      // 作成直後の初期値を返す（以降の処理は不要）
      return NextResponse.json({
        credits: 5,
        subscriptionStatus: "FREE",
      });
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
