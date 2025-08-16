"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image,
  Download,
  Share2,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useImages } from "@/hooks/use-images";
import {
  getImageTypeLabel,
  getImageStatusLabel,
  formatFileSize,
  formatDate,
} from "@/lib/utils";

const ImagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  const { images, loading, error } = useImages(100); // より多くの画像を取得

  // フィルタリングと検索
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.prompt &&
        image.prompt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType =
      !selectedType ||
      selectedType === "all" ||
      image.imageType === selectedType;
    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "all" ||
      image.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredImages.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentImages = filteredImages.slice(startIndex, endIndex);

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

  const handleShare = async (imageId: string) => {
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

      // Web Share APIが利用可能な場合は使用
      if (navigator.share) {
        await navigator.share({
          title: imageData.fileName || "画像",
          text: imageData.prompt || "AIで生成された画像",
          url: imageUrl,
        });
      } else {
        // フォールバック: URLをクリップボードにコピー
        await navigator.clipboard.writeText(imageUrl);
        alert("画像URLをクリップボードにコピーしました");
      }
    } catch (error) {
      console.error("共有エラー:", error);
      alert("画像の共有に失敗しました");
    }
  };

  const handleDelete = async (imageId: string) => {
    if (confirm("この画像を削除しますか？")) {
      try {
        const response = await fetch(`/api/images?id=${imageId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // ページをリロードして画像リストを更新
          window.location.reload();
        } else {
          alert("削除に失敗しました");
        }
      } catch (error) {
        console.error("削除エラー:", error);
        alert("削除に失敗しました");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">画像一覧</h1>
            </div>
          </div>
        </div>

        {/* フィルターと検索 */}
        <div className="mb-6">
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="画像名で検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={selectedType || undefined}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="画像タイプ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="AI_GENERATED">AI生成</SelectItem>
                        <SelectItem value="BACKGROUND_REMOVAL">
                          背景除去
                        </SelectItem>
                        <SelectItem value="IMAGE_COMPRESSION">
                          画像圧縮
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedStatus || undefined}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ステータス" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="COMPLETED">完了</SelectItem>
                        <SelectItem value="PROCESSING">処理中</SelectItem>
                        <SelectItem value="FAILED">失敗</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-fit md:self-end"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType(null);
                    setSelectedStatus(null);
                    setCurrentPage(1);
                  }}
                >
                  <Filter className="h-4 w-4" />
                  リセット
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 画像一覧 */}
        <div>
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>画像一覧</CardTitle>
            </CardHeader>
            <CardContent>
              {currentImages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">画像が見つかりません</p>
                  <p className="text-sm">
                    検索条件を変更するか、新しい画像を作成してください
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="grid grid-cols-[1fr_auto] gap-4 items-center p-4 rounded-lg bg-gray-100/80 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/60"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {image.fileName}
                          </h4>
                          {image.prompt && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {image.prompt}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                            <Badge variant="outline" className="text-xs">
                              {getImageTypeLabel(image.imageType)}
                            </Badge>
                            <span>•</span>
                            <span>{formatDate(image.createdAt)}</span>
                            <span>•</span>
                            <span>{formatFileSize(image.fileSize)}</span>
                            <span>•</span>
                            <span>{image.format}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 justify-self-end ml-auto">
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
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(image.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                前へ
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesPage;
