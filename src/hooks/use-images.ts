import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface ImageData {
  id: string;
  fileName: string;
  imageType: string;
  status: string;
  fileSize: number;
  format: string;
  prompt?: string;
  createdAt: string;
}

export interface ImagesResponse {
  images: ImageData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  count: number;
}

export function useImages(limit: number = 5) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/images?limit=${limit}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("画像の取得に失敗しました");
        }

        const data: ImagesResponse = await response.json();
        setImages(data.images);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
        console.error("画像取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userLoaded && isSignedIn) {
      fetchImages();
    }
  }, [limit, userLoaded, isSignedIn]);

  return { images, loading, error };
}
