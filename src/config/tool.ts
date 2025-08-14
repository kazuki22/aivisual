import ImageGenerator from "@/components/dashboard/tools/imageGenerator";
import RemoveBackground from "@/components/dashboard/tools/RemoveBackground";
import ImageOptimizer from "@/components/dashboard/tools/ImageOptimizer";

export const tools = {
    "image-generator": {
        name: "Image Generator",
        description: "Generate images using AI",
        component: ImageGenerator,
    },
    "remove-bg": {
        name: "Remove Background",
        description: "Remove background from images",
        component: RemoveBackground,
    },
    "optimize": {
        name: "Image Optimizer",
        description: "Optimize images for web",
        component: ImageOptimizer,
    },
}

export type ToolType = keyof typeof tools;