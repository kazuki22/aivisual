"use client";

import React, { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Download, Layers } from 'lucide-react'
import LoadingSpinner from '@/components/dashboard/loading-spinner'
import { toast } from '@/hooks/use-toast'
import { removeBackground } from '@/actions/actions'
import { RemoveBackgroundState } from '@/types/actions'
import Image from 'next/image'
import { useUser, SignInButton } from '@clerk/nextjs'

const initialState:RemoveBackgroundState = {
  originalImageUrl: undefined,
  processedImageUrl: undefined,
  error: undefined,
  status: "idle",
};

const RemoveBackground = () => {
  const {isSignedIn} = useUser();

  const [state, formAction, pending] = useActionState(
    removeBackground,
    initialState
  );
  
  console.log("RemoveBackground component rendered, state:", state);

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
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">ファイルを選択</Label>
            <Input 
            id="image" 
            name="image" 
            type="file"
            accept="image/*"
            className="w-full"
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
              <LoadingSpinner/>
            ) : <>
            <Layers className="mr-2" />
            背景を削除する
            </>}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full">
                <Layers className="mr-2" />
                ログインが必要です。
              </Button>
            </SignInButton>
          )}
        </form>
      </div>

      {/* 画像プレビュー */}
      {state.processedImageUrl && (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="aspect-video">
            <img
            src={state.processedImageUrl} 
            alt="Processed Image" 
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
  )
}

export default RemoveBackground