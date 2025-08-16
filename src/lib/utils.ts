import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 画像の種類を日本語に変換
export function getImageTypeLabel(imageType: string): string {
  const typeMap: Record<string, string> = {
    AI_GENERATED: "AI生成",
    BACKGROUND_REMOVAL: "背景除去",
    IMAGE_COMPRESSION: "画像圧縮",
  };
  return typeMap[imageType] || imageType;
}

// 画像のステータスを日本語に変換
export function getImageStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PROCESSING: "処理中",
    COMPLETED: "完了",
    FAILED: "失敗",
  };
  return statusMap[status] || status;
}

// ファイルサイズを読みやすい形式に変換
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// 日付を読みやすい形式に変換
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
