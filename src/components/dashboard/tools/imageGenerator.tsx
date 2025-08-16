"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { generateImage } from "@/actions/actions";
import { GenerateImageState } from "@/types/actions";
import { Download, ImageIcon, Sparkles, Wand2 } from "lucide-react";
import LoadingSpinner from "@/components/dashboard/loading-spinner";
import { toast } from "@/hooks/use-toast";
import { useUser, SignInButton } from "@clerk/nextjs";

const initialState: GenerateImageState = {
  error: undefined,
  status: "idle",
};

const ImageGenerator = () => {
  const { isSignedIn } = useUser();

  const [state, formAction, pending] = useActionState(
    generateImage,
    initialState
  );

  const handleDownload = () => {
    if (!state.imageUrl) return;
    try {
      const base64Image = state.imageUrl.split(",")[1];
      const blob = new Blob([Buffer.from(base64Image, "base64")], {
        type: "image/png",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.keyword}.png`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("画像をダウンロードしました");
    } catch (error) {
      console.error("画像のダウンロードに失敗しました", error);
      toast.error("画像のダウンロードに失敗しました");
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 入力フォーム */}
            <div className="space-y-6">
              <div className="rounded-2xl p-6 py-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
                <form action={formAction} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="keyword" className="text-lg font-semibold">
                      キーワード
                    </Label>
                    <Input
                      id="keyword"
                      name="keyword"
                      placeholder="作成したい画像のキーワードを入力（例：海、山など）"
                      required
                      className="h-12 text-base border-0 bg-gray-100/80 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                    />
                  </div>

                  {isSignedIn ? (
                    <Button
                      type="submit"
                      disabled={pending}
                      className={cn(
                        "w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg",
                        pending && "opacity-80"
                      )}
                    >
                      {pending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          画像を生成する
                        </>
                      )}
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <ImageIcon className="mr-2 h-5 w-5" />
                        ログインが必要です
                      </Button>
                    </SignInButton>
                  )}
                </form>
              </div>
            </div>

            {/* 画像プレビュー */}
            <div className="space-y-6">
              {state.imageUrl ? (
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="aspect-video">
                      <img
                        src={state.imageUrl}
                        alt="Generated Image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
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
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        生成された画像がここに表示されます
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        キーワードを入力して画像を生成してください
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

export default ImageGenerator;
