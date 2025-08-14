"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { generateImage } from "@/actions/actions";
import { GenerateImageState } from "@/types/actions";
import { Download, ImageIcon } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">キーワード</Label>
            <Input
              id="keyword"
              name="keyword"
              placeholder="作成したい画像のキーワードを入力（例：海、山など）"
              required
            />
          </div>

          {isSignedIn ? (
            <Button
              type="submit"
              disabled={pending}
              className={cn("w-full duration-200", pending && "bg-primary/80")}
            >
              {pending ? (
                <LoadingSpinner />
              ) : (
                <>
                  <ImageIcon className="mr-2" />
                  画像を生成する
                </>
              )}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full">
                <ImageIcon className="mr-2" />
                ログインが必要です。
              </Button>
            </SignInButton>
          )}
        </form>
      </div>

      {/* 画像プレビュー */}
      {state.imageUrl && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="aspect-video">
              <img
                src={state.imageUrl}
                alt="Generated Image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={handleDownload}
          >
            <Download className="mr-2" />
            画像をダウンロード
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
