"use server";

import { GenerateImageState, RemoveBackgroundState } from "@/types/actions";
import { decrementUserCredits, getUserCredits } from "@/lib/credits";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ImageStatus } from "@prisma/client";

// 画像をデータベースに保存するヘルパー関数（直接Prisma使用）
async function saveImageToDatabaseDirectly(imageData: {
  fileName: string;
  originalUrl: string;
  imageType: "AI_GENERATED" | "BACKGROUND_REMOVAL" | "IMAGE_COMPRESSION";
  fileSize: number;
  width?: number;
  height?: number;
  format: string;
  prompt?: string;
  settings?: any;
  userId: string;
}) {
  try {
    // 実行時のDBカラム型と保存データ長を確認
    try {
      const columns: Array<{
        COLUMN_NAME: string;
        DATA_TYPE: string;
        CHARACTER_MAXIMUM_LENGTH: number | null;
      }> =
        await prisma.$queryRaw`SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Image' AND COLUMN_NAME IN ('originalUrl','processedUrl')`;
      console.log("Image table column types:", columns);
      console.log(
        "originalUrl length (chars):",
        imageData.originalUrl?.length ?? 0
      );
    } catch (metaError) {
      console.warn("情報スキーマ確認に失敗:", metaError);
    }
    const image = await prisma.image.create({
      data: {
        userId: imageData.userId,
        fileName: imageData.fileName,
        originalUrl: imageData.originalUrl,
        imageType: imageData.imageType,
        fileSize: imageData.fileSize,
        width: imageData.width,
        height: imageData.height,
        format: imageData.format,
        prompt: imageData.prompt,
        settings: imageData.settings,
        status: ImageStatus.COMPLETED,
      },
    });

    console.log("画像が正常にデータベースに保存されました:", image.id);
    return true;
  } catch (error) {
    console.error("画像保存中にエラーが発生しました:", error);
    return false;
  }
}

export async function generateImage(
  state: GenerateImageState,
  formData: FormData
): Promise<GenerateImageState> {
  const user = await currentUser();

  if (!user) {
    throw new Error("認証が必要です。");
  }

  const credits = await getUserCredits();
  if (credits === null || credits <= 0) {
    redirect("/dashboard/plan?reason=insufficient_credits");
  }
  try {
    const keyword = formData.get("keyword");

    if (!keyword || typeof keyword !== "string") {
      return {
        status: "error",
        error: "キーワードが入力されていません",
      };
    }

    if (state.status === "loading") {
      return state;
    }

    // サーバーサイドでは絶対URLが必要
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: keyword,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("/api/generate-image error:", response.status, text);
      return {
        status: "error",
        error: `画像生成に失敗しました (${response.status})`,
      };
    }

    const data = await response.json();
    await decrementUserCredits(user.id);

    // 画像生成完了後、データベースに保存（直接Prisma使用）
    try {
      // データベースからユーザー情報を取得
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
      });

      if (dbUser) {
        // base64画像からサイズを推定（概算）
        const base64Data = data.imageUrl.split(",")[1];
        const estimatedSize = Math.ceil((base64Data.length * 3) / 4); // base64からバイト数を推定

        await saveImageToDatabaseDirectly({
          fileName: `${keyword}-generated.webp`,
          originalUrl: data.imageUrl,
          imageType: "AI_GENERATED",
          fileSize: estimatedSize,
          width: 1280,
          height: 720,
          format: "webp",
          prompt: keyword,
          settings: {
            model: "stability-ai",
            size: "1024x1024",
          },
          userId: dbUser.id,
        });
      }
    } catch (saveError) {
      console.error("画像保存に失敗しました:", saveError);
      // 画像保存に失敗しても画像生成は成功とする
    }

    revalidatePath("/dashboard");

    return {
      status: "success",
      imageUrl: data.imageUrl,
      keyword: keyword,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: "予期しないエラーが発生しました",
    };
  }
}

export async function removeBackground(
  state: RemoveBackgroundState,
  formData: FormData
): Promise<RemoveBackgroundState> {
  const user = await currentUser();

  if (!user) {
    throw new Error("認証が必要です。");
  }

  const credits = await getUserCredits();
  if (credits === null || credits <= 0) {
    redirect("/dashboard/plan?reason=insufficient_credits");
  }

  const image = formData.get("image") as File;

  if (!image) {
    console.log("No image file provided");
    return {
      status: "error",
      error: "ファイルが選択されていません",
    };
  }

  if (state.status === "loading") {
    return state;
  }

  try {
    console.log("Making API request to remove background");
    // サーバーサイドでは絶対URLが必要
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/remove-background`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("/api/remove-background error:", response.status, text);
      return {
        status: "error",
        error: `背景の削除に失敗しました (${response.status})`,
      };
    }

    const data = await response.json();

    await decrementUserCredits(user.id);

    // 背景除去完了後、データベースに保存（直接Prisma使用）
    try {
      // データベースからユーザー情報を取得
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
      });

      if (dbUser) {
        await saveImageToDatabaseDirectly({
          fileName: `bg-removed-${image.name}`,
          originalUrl: data.processedImageUrl,
          imageType: "BACKGROUND_REMOVAL",
          fileSize: image.size,
          format: image.type.split("/")[1] || "png",
          settings: {
            originalFileName: image.name,
            originalSize: image.size,
            processingType: "background-removal",
          },
          userId: dbUser.id,
        });
      }
    } catch (saveError) {
      console.error("画像保存に失敗しました:", saveError);
      // 画像保存に失敗しても背景除去は成功とする
    }

    revalidatePath("/dashboard");

    return {
      status: "success",
      processedImageUrl: data.processedImageUrl,
    };
  } catch (error) {
    console.error("Error removing background:", error);
    return {
      status: "error",
      error: "背景の削除に失敗しました",
    };
  }
}
