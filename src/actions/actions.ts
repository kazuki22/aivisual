"use server";

import { GenerateImageState, RemoveBackgroundState } from "@/types/actions";
import { decrementUserCredits, getUserCredits } from "@/lib/credits";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    const data = await response.json();
    await decrementUserCredits(user.id);
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
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/remove-background`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to remove background");
    }

    const data = await response.json();

    await decrementUserCredits(user.id);
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
