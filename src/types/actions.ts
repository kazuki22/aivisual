export type GenerateImageState = {
    imageUrl?: string;
    error?: string;
    status: "idle" | "loading" | "success" | "error";
    keyword?: string;
};

export type RemoveBackgroundState = {
    originalImageUrl?: string;
    processedImageUrl?: string;
    error?: string;
    status: "idle" | "loading" | "success" | "error";
};

export type StripeState = {
    status: "idle" | "loading" | "success" | "error";
    error: string;
    redirectUrl?: string;
};

export type CreateStripeSessionState = {
    status: "idle" | "loading" | "success" | "error";
    error: string;
    redirectUrl?: string;
};