import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

    try {
      const dbUser = await prisma.user.upsert({
        where: { clerkId: user.id },
        update: { email: primaryEmail },
        create: {
          clerkId: user.id,
          email: primaryEmail,
          credits: 5,
          subscriptionStatus: "FREE",
        },
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
    } catch (e) {
      // メールのユニーク制約衝突などに対処
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const existingByEmail = await prisma.user.findUnique({
          where: { email: primaryEmail },
          select: { id: true, credits: true, subscriptionStatus: true },
        });
        if (existingByEmail) {
          const updated = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: { clerkId: user.id },
            select: { credits: true, subscriptionStatus: true },
          });
          return NextResponse.json({
            credits: updated.credits,
            subscriptionStatus: updated.subscriptionStatus,
          });
        }
      }
      throw e;
    }
  } catch (error) {
    console.error("クレジット取得エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
