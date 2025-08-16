"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Sparkles,
  Image,
  Scissors,
  Zap,
  TrendingUp,
  Users,
  CreditCard,
  Settings,
  Plus,
  Download,
  Share2,
  Star,
  ImageDown,
} from "lucide-react";
import CreditStatCard from "@/components/dashboard/stat-cards/credit-stat-card";
import GeneratedImagesStatCard from "@/components/dashboard/stat-cards/generated-images-stat-card";
import BackgroundRemovalStatCard from "@/components/dashboard/stat-cards/background-removal-stat-card";
import ImageOptimizeStatCard from "@/components/dashboard/stat-cards/image-optimize-stat-card";
import { useImages } from "@/hooks/use-images";
import {
  getImageTypeLabel,
  getImageStatusLabel,
  formatFileSize,
  formatDate,
} from "@/lib/utils";

const DashboardPage = () => {
  const {
    images: recentImages,
    loading: imagesLoading,
    error: imagesError,
  } = useImages(5);

  const quickActions = [
    {
      title: "画像生成",
      description: "AIで新しい画像を作成",
      icon: Plus,
      color: "from-blue-500 to-purple-600",
      href: "/dashboard/tools/image-generator",
    },
    {
      title: "背景削除",
      description: "画像の背景を自動削除",
      icon: Scissors,
      color: "from-emerald-500 to-teal-600",
      href: "/dashboard/tools/remove-bg",
    },
    {
      title: "画像圧縮",
      description: "任意の画像を圧縮",
      icon: ImageDown,
      color: "from-orange-500 to-red-600",
      href: "/dashboard/tools/image-optimize",
    },
  ];

  const handleDownload = async (imageId: string) => {
    try {
      // 画像情報を取得
      const response = await fetch(`/api/images/${imageId}`);
      if (!response.ok) {
        throw new Error("画像の取得に失敗しました");
      }

      const imageData = await response.json();

      // 画像のURLを取得（処理済み画像があればそれを使用、なければ元画像を使用）
      const imageUrl = imageData.processedUrl || imageData.originalUrl;

      if (!imageUrl) {
        throw new Error("画像URLが見つかりません");
      }

      // 画像をダウンロード
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download =
        imageData.fileName || `image-${imageId}.${imageData.format || "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("ダウンロードエラー:", error);
      alert("画像のダウンロードに失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CreditStatCard index={0} />
          <GeneratedImagesStatCard index={1} />
          <BackgroundRemovalStatCard index={2} />
          <ImageOptimizeStatCard index={3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* クイックアクション */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  クイックアクション
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="block p-4 rounded-lg bg-gray-100/80 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/60 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground group-hover:text-blue-600">
                          {action.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 最近の画像 */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>最近の画像</span>
                  <Link href="/dashboard/images">
                    <Button variant="ghost" size="sm">
                      すべて表示
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : imagesError ? (
                    <div className="text-center py-8 text-red-600">
                      <p>画像の読み込みに失敗しました</p>
                      <p className="text-sm text-muted-foreground">
                        {imagesError}
                      </p>
                    </div>
                  ) : recentImages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>まだ画像がありません</p>
                      <p className="text-sm">最初の画像を作成してみましょう</p>
                    </div>
                  ) : (
                    recentImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gray-100/80 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {image.fileName}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {getImageTypeLabel(image.imageType)}
                              </Badge>
                              <span>•</span>
                              <span>{formatDate(image.createdAt)}</span>
                              <span>•</span>
                              <span>{formatFileSize(image.fileSize)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {image.status === "COMPLETED" ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {getImageStatusLabel(image.status)}
                            </Badge>
                          ) : image.status === "PROCESSING" ? (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {getImageStatusLabel(image.status)}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {getImageStatusLabel(image.status)}
                            </Badge>
                          )}
                          <Button
                            onClick={() => handleDownload(image.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
