import ImageGenerator from "@/components/dashboard/tools/imageGenerator";
import RemoveBackground from "@/components/dashboard/tools/RemoveBackground";
import ImageOptimizer from "@/components/dashboard/tools/ImageOptimizer";

export const tools = {
    "image-generator": {
        name: "画像生成",
        description: "テキストから美しい画像を美しい画像を生成します。",
        component: ImageGenerator,
    },
    "remove-bg": {
        name: "背景削除",
        description: "指定した画像の背景を高解像度のまま削除します。",
        component: RemoveBackground,
    },
    "optimize": {
        name: "画像最適化",
        description: "指定した画像を高解像度で最適化します。",
        component: ImageOptimizer,
    },
}

export type ToolType = keyof typeof tools;