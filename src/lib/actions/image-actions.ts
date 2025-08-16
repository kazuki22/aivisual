"use server";

import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
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

export interface CompressionResult {
  success: boolean;
  data?: {
    compressedImageUrl: string;
    compressedSize: number;
  };
  error?: string;
}

export async function compressImage(
  formData: FormData
): Promise<CompressionResult> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "認証が必要です" };
    }

    const image = formData.get("image") as File;
    const format = formData.get("format") as string;
    const quality = parseInt(formData.get("quality") as string);
    const resize = formData.get("resize") === "true";
    const maxWidth = parseInt(formData.get("maxWidth") as string);
    const maxHeight = parseInt(formData.get("maxHeight") as string);

    if (!image) {
      return { success: false, error: "画像ファイルが見つかりません" };
    }

    // ファイルサイズチェック（10MB制限）
    if (image.size > 10 * 1024 * 1024) {
      return { success: false, error: "ファイルサイズが10MBを超えています" };
    }

    // 画像バッファを取得
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Sharpで画像処理
    let sharpInstance = sharp(imageBuffer);

    // リサイズ処理
    if (resize && maxWidth && maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // フォーマット変換と圧縮
    let processedBuffer: Buffer;
    let mimeType: string;

    switch (format) {
      case "jpeg":
        processedBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        mimeType = "image/jpeg";
        break;
      case "webp":
        processedBuffer = await sharpInstance
          .webp({ quality, effort: 6 })
          .toBuffer();
        mimeType = "image/webp";
        break;
      case "png":
        processedBuffer = await sharpInstance
          .webp({ quality, effort: 5 })
          .toBuffer();
        mimeType = "image/webp";
        break;
      default:
        return {
          success: false,
          error: "サポートされていないフォーマットです",
        };
    }

    // Base64エンコードしてURLを作成
    const base64Image = `data:${mimeType};base64,${processedBuffer.toString("base64")}`;

    // 画像圧縮完了後、データベースに保存（直接Prisma使用）
    try {
      // データベースからユーザー情報を取得
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
      });

      if (dbUser) {
        await saveImageToDatabaseDirectly({
          fileName: `compressed-${image.name}`,
          originalUrl: base64Image,
          imageType: "IMAGE_COMPRESSION",
          fileSize: processedBuffer.length,
          format: format,
          settings: {
            originalFileName: image.name,
            originalSize: image.size,
            compressionSettings: {
              format,
              quality,
              resize,
              maxWidth: resize ? maxWidth : undefined,
              maxHeight: resize ? maxHeight : undefined,
            },
          },
          userId: dbUser.id,
        });
      }
    } catch (saveError) {
      console.error("画像保存に失敗しました:", saveError);
      // 画像保存に失敗しても圧縮は成功とする
    }

    revalidatePath("/dashboard/tools/image-optimization");

    return {
      success: true,
      data: {
        compressedImageUrl: base64Image,
        compressedSize: processedBuffer.length,
      },
    };
  } catch (error) {
    console.error("画像圧縮エラー:", error);
    return {
      success: false,
      error: "画像の処理中にエラーが発生しました",
    };
  }
}
