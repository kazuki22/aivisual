"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ImageIcon,
  Download,
  Upload,
  Settings,
  FileImage,
  Zap,
  Info,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/actions/image-actions";

interface CompressionSettings {
  format: "jpeg" | "webp" | "png";
  quality: number;
  resize: boolean;
  maxWidth: number;
  maxHeight: number;
}

interface ImageFile {
  file: File;
  preview: string;
  size: number;
  dimensions: { width: number; height: number };
}

export default function ImageOptimize() {
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressionSettings, setCompressionSettings] =
    useState<CompressionSettings>({
      format: "jpeg",
      quality: 80,
      resize: false,
      maxWidth: 1920,
      maxHeight: 1080,
    });
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  } | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルを選択してください。");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const preview = URL.createObjectURL(file);
        setSelectedImage({
          file,
          preview,
          size: file.size,
          dimensions: { width: img.width, height: img.height },
        });
        setCompressedImage(null);
        setCompressionStats(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCompress = () => {
    if (!selectedImage) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("image", selectedImage.file);
        formData.append("format", compressionSettings.format);
        formData.append("quality", compressionSettings.quality.toString());
        formData.append("resize", compressionSettings.resize.toString());
        formData.append("maxWidth", compressionSettings.maxWidth.toString());
        formData.append("maxHeight", compressionSettings.maxHeight.toString());

        const result = await compressImage(formData);

        if (result.success && result.data) {
          setCompressedImage(result.data.compressedImageUrl);
          setCompressionStats({
            originalSize: selectedImage.size,
            compressedSize: result.data.compressedSize,
            compressionRatio:
              ((selectedImage.size - result.data.compressedSize) /
                selectedImage.size) *
              100,
          });

          toast.success("画像の圧縮が完了しました。");
        } else {
          toast.error(result.error || "画像の圧縮に失敗しました。");
        }
      } catch (error) {
        toast.error("画像の圧縮中にエラーが発生しました。");
      }
    });
  };

  const handleDownload = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed-image.${compressionSettings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* 左側: アップロードと設定 */}
            <div className="xl:col-span-1 space-y-6">
              {/* ファイルアップロード */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent dark:from-orange-200 dark:to-amber-200">
                      画像をアップロード
                    </span>
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    圧縮したい画像ファイルを選択してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-4"
                    >
                      <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full">
                        <FileImage className="h-8 w-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-orange-600 dark:text-orange-400 font-semibold text-lg">
                          画像を選択
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          またはドラッグ&ドロップ
                        </div>
                      </div>
                      <div className="text-sm text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-700/80 px-4 py-2 rounded-full">
                        PNG, JPG, WEBP (最大10MB)
                      </div>
                    </label>
                  </div>

                  {selectedImage && (
                    <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-200">
                        <FileImage className="h-5 w-5 text-green-600" />
                        <span className="font-medium">
                          {selectedImage.file.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/80 dark:bg-slate-700/80 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="font-semibold text-green-700 dark:text-green-300 text-xs uppercase tracking-wide">
                            サイズ
                          </div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {formatFileSize(selectedImage.size)}
                          </div>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-700/80 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="font-semibold text-green-700 dark:text-green-300 text-xs uppercase tracking-wide">
                            解像度
                          </div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {selectedImage.dimensions.width} ×{" "}
                            {selectedImage.dimensions.height}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 圧縮設定 */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-lg">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent dark:from-amber-200 dark:to-orange-200">
                      圧縮設定
                    </span>
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    圧縮の品質と出力形式を設定してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 出力形式 */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="format"
                      className="text-slate-700 dark:text-slate-200 font-medium"
                    >
                      出力形式
                    </Label>
                    <Select
                      value={compressionSettings.format}
                      onValueChange={(value: "jpeg" | "webp" | "png") =>
                        setCompressionSettings((prev) => ({
                          ...prev,
                          format: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white/80 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 品質設定 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="quality"
                        className="text-slate-700 dark:text-slate-200 font-medium"
                      >
                        品質: {compressionSettings.quality}%
                      </Label>
                      <Badge
                        variant="secondary"
                        className={`${
                          compressionSettings.quality >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : compressionSettings.quality >= 60
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {compressionSettings.quality >= 80
                          ? "高品質"
                          : compressionSettings.quality >= 60
                            ? "中品質"
                            : "低品質"}
                      </Badge>
                    </div>
                    <Slider
                      id="quality"
                      min={10}
                      max={100}
                      step={5}
                      value={[compressionSettings.quality]}
                      onValueChange={([value]) =>
                        setCompressionSettings((prev) => ({
                          ...prev,
                          quality: value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  <Separator className="bg-slate-200 dark:bg-slate-600" />

                  {/* リサイズ設定 */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="resize"
                        checked={compressionSettings.resize}
                        onChange={(e) =>
                          setCompressionSettings((prev) => ({
                            ...prev,
                            resize: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300 dark:border-slate-600 text-orange-600 focus:ring-orange-500"
                      />
                      <Label
                        htmlFor="resize"
                        className="text-slate-700 dark:text-slate-200 font-medium"
                      >
                        最大サイズを制限
                      </Label>
                    </div>

                    {compressionSettings.resize && (
                      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="space-y-2">
                          <Label
                            htmlFor="maxWidth"
                            className="text-slate-600 dark:text-slate-300 text-sm"
                          >
                            最大幅 (px)
                          </Label>
                          <Input
                            id="maxWidth"
                            type="number"
                            value={compressionSettings.maxWidth}
                            onChange={(e) =>
                              setCompressionSettings((prev) => ({
                                ...prev,
                                maxWidth: parseInt(e.target.value) || 1920,
                              }))
                            }
                            min="100"
                            max="4000"
                            className="bg-white/80 dark:bg-slate-600/80 border-slate-200 dark:border-slate-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="maxHeight"
                            className="text-slate-600 dark:text-slate-300 text-sm"
                          >
                            最大高さ (px)
                          </Label>
                          <Input
                            id="maxHeight"
                            type="number"
                            value={compressionSettings.maxHeight}
                            onChange={(e) =>
                              setCompressionSettings((prev) => ({
                                ...prev,
                                maxHeight: parseInt(e.target.value) || 1080,
                              }))
                            }
                            min="100"
                            max="4000"
                            className="bg-white/80 dark:bg-slate-600/80 border-slate-200 dark:border-slate-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 圧縮実行ボタン */}
                  <Button
                    onClick={handleCompress}
                    disabled={!selectedImage || isPending}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        圧縮中...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-3" />
                        画像を圧縮
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 右側: プレビューと結果 */}
            <div className="xl:col-span-2 space-y-6">
              {/* 比較プレビュー */}
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent dark:from-orange-200 dark:to-amber-200">
                    比較プレビュー
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    元画像と圧縮後の画像を比較できます
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedImage ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 元画像 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="outline"
                            className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20"
                          >
                            元画像
                          </Badge>
                          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {formatFileSize(selectedImage.size)}
                          </span>
                        </div>
                        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
                          <img
                            src={selectedImage.preview}
                            alt="元画像"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                          {selectedImage.dimensions.width} ×{" "}
                          {selectedImage.dimensions.height}
                        </div>
                      </div>

                      {/* 圧縮後画像 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          >
                            圧縮後
                          </Badge>
                          {compressionStats && (
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                              {formatFileSize(compressionStats.compressedSize)}
                            </span>
                          )}
                        </div>
                        <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
                          {compressedImage ? (
                            <img
                              src={compressedImage}
                              alt="圧縮後画像"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
                              <ImageIcon className="h-16 w-16" />
                            </div>
                          )}
                        </div>
                        {compressionStats && (
                          <div className="text-xs text-amber-600 dark:text-amber-400 text-center font-semibold">
                            圧縮率:{" "}
                            {compressionStats.compressionRatio.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                      <div className="p-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-lg font-medium">
                        画像をアップロードして圧縮を開始してください
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 圧縮統計 */}
              {compressionStats && (
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                        <Info className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-orange-800 to-amber-700 bg-clip-text text-transparent dark:from-orange-200 dark:to-amber-200">
                        圧縮結果
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl border border-orange-200 dark:border-orange-700">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {formatFileSize(compressionStats.originalSize)}
                        </div>
                        <div className="text-sm text-orange-700 dark:text-orange-300 font-medium uppercase tracking-wide">
                          元サイズ
                        </div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl border border-amber-200 dark:border-amber-700">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                          {formatFileSize(compressionStats.compressedSize)}
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-300 font-medium uppercase tracking-wide">
                          圧縮後サイズ
                        </div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-xl border border-yellow-200 dark:border-yellow-700">
                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                          {compressionStats.compressionRatio.toFixed(1)}%
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300 font-medium uppercase tracking-wide">
                          削減率
                        </div>
                      </div>
                    </div>

                    {compressedImage && (
                      <Button
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        <Download className="h-5 w-5 mr-3" />
                        圧縮された画像をダウンロード
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
