import ImageGenerator from "@/components/dashboard/tools/imageGenerator";
import RemoveBackground from "@/components/dashboard/tools/RemoveBackground";
import ImageOptimize from "@/components/dashboard/tools/ImageOptimize";

export const tools = {
  "image-generator": {
    name: "画像生成",
    description: "テキストから美しい画像を生成します。",
    component: ImageGenerator,
  },
  "remove-bg": {
    name: "背景削除",
    description: "指定した画像の背景を高解像度のまま削除します。",
    component: RemoveBackground,
  },
  "image-optimize": {
    name: "画像最適化",
    description: "最新のAI技術とSharpを使用して、画像を高品質で圧縮し、ファイルサイズを大幅に削減します。",
    component: ImageOptimize,
  },
};

export type ToolType = keyof typeof tools;
