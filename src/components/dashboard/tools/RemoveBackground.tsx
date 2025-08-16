"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Download, Layers, Sparkles, ImageIcon, Upload } from "lucide-react";
import LoadingSpinner from "@/components/dashboard/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { removeBackground } from "@/actions/actions";
import { RemoveBackgroundState } from "@/types/actions";
import Image from "next/image";
import { useUser, SignInButton } from "@clerk/nextjs";

const initialState: RemoveBackgroundState = {
  originalImageUrl: undefined,
  processedImageUrl: undefined,
  error: undefined,
  status: "idle",
};

const RemoveBackground = () => {
  const { isSignedIn } = useUser();

  const [state, formAction, pending] = useActionState(
    removeBackground,
    initialState
  );

  const handleDownload = () => {
    if (!state.processedImageUrl) {
      return;
    }

    try {
      const base64Image = state.processedImageUrl.split(",")[1];
      const blob = new Blob([Buffer.from(base64Image, "base64")], {
        type: "image/png",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "processed-image.png";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("背景を削除しました");
    } catch (error) {
      console.error("背景の削除に失敗しました", error);
      toast.error("背景の削除に失敗しました");
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 入力フォーム */}
            <form action={formAction} className="space-y-6">
              <div className="rounded-2xl p-6 py-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="image" className="text-lg font-semibold">
                      画像ファイル
                    </Label>
                    <div className="relative">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="h-12 py-3 text-base border-0 bg-gray-100/80 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 transition-colors file:mr-4 file:py-0 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-green-600 file:text-white hover:file:bg-green-100 dark:file:bg-green-900/50 dark:file:text-green-400"
                        required
                      />
                    </div>
                  </div>

                  {isSignedIn ? (
                    <Button
                      type="submit"
                      disabled={pending}
                      className={cn(
                        "w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg",
                        pending && "opacity-80"
                      )}
                    >
                      {pending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          背景を削除する
                        </>
                      )}
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Layers className="mr-2 h-5 w-5" />
                        ログインが必要です
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </form>

            {/* 画像プレビュー */}
            <div className="space-y-6">
              {state.processedImageUrl ? (
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="aspect-video">
                      <img
                        src={state.processedImageUrl}
                        alt="Processed Image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    画像をダウンロード
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        処理された画像がここに表示されます
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        画像をアップロードして背景を削除してください
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
