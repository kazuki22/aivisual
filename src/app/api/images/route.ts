import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ImageType, ImageStatus } from "@prisma/client";

// 共通の認証・ユーザー取得（なければ作成）ヘルパー関数
async function getAuthenticatedUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("認証が必要です");
  }

  const primaryEmail =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    "";

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: { email: primaryEmail },
    create: { clerkId: user.id, email: primaryEmail },
    select: { id: true },
  });

  return { clerkUser: user, dbUser };
}

// 画像一覧を取得（フィルタリング対応）
export async function GET(request: Request) {
  try {
    const { dbUser } = await getAuthenticatedUser();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // フィルタ条件を構築
    const where: any = { userId: dbUser.id };
    if (type) where.imageType = type;
    if (status) where.status = status;

    // 総件数を取得
    const totalCount = await prisma.image.count({ where });

    // 画像一覧を取得
    const images = await prisma.image.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fileName: true,
        imageType: true,
        status: true,
        fileSize: true,
        format: true,
        prompt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      count: totalCount, // 統計カード用
    });
  } catch (error) {
    console.error("画像一覧取得エラー:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 新しい画像を作成
export async function POST(request: Request) {
  try {
    const { dbUser } = await getAuthenticatedUser();

    const body = await request.json();
    const {
      fileName,
      originalUrl,
      imageType,
      fileSize,
      width,
      height,
      format,
      prompt,
      settings,
    } = body;

    // 必須フィールドのバリデーション
    if (!fileName || !originalUrl || !imageType || !fileSize || !format) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 画像レコードを作成
    const image = await prisma.image.create({
      data: {
        userId: dbUser.id,
        fileName,
        originalUrl,
        imageType,
        fileSize,
        width,
        height,
        format,
        prompt,
        settings,
        status: ImageStatus.PROCESSING,
      },
    });

    return NextResponse.json({
      message: "画像が正常に作成されました",
      image: {
        id: image.id,
        fileName: image.fileName,
        imageType: image.imageType,
        status: image.status,
        createdAt: image.createdAt,
      },
    });
  } catch (error) {
    console.error("画像作成エラー:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 画像を削除
export async function DELETE(request: Request) {
  try {
    const { dbUser } = await getAuthenticatedUser();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "画像IDが必要です" }, { status: 400 });
    }

    // 画像が存在し、ユーザーのものかチェック
    const existingImage = await prisma.image.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "画像が見つからないか、アクセス権限がありません" },
        { status: 404 }
      );
    }

    // 画像を削除
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "画像が正常に削除されました",
    });
  } catch (error) {
    console.error("画像削除エラー:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
