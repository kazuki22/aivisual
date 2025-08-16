import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// 共通の認証・ユーザー取得ヘルパー関数
async function getAuthenticatedUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("認証が必要です");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    throw new Error("ユーザーが見つかりません");
  }

  return { clerkUser: user, dbUser };
}

// 個別の画像情報を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { dbUser } = await getAuthenticatedUser();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "画像IDが必要です" }, { status: 400 });
    }

    // 画像が存在し、ユーザーのものかチェック
    const image = await prisma.image.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      select: {
        id: true,
        fileName: true,
        originalUrl: true,
        processedUrl: true,
        imageType: true,
        status: true,
        fileSize: true,
        width: true,
        height: true,
        format: true,
        prompt: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: "画像が見つからないか、アクセス権限がありません" },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("画像取得エラー:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
