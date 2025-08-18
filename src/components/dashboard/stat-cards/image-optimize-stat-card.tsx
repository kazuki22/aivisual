"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageDown, Loader2 } from "lucide-react";

interface ImageOptimizeStatCardProps {
  index: number;
}

const ImageOptimizeStatCard = ({ index }: ImageOptimizeStatCardProps) => {
  const [imageCleanups, setImageCleanups] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/images?type=IMAGE_COMPRESSION&status=COMPLETED",
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // countフィールドが存在することを確認
        if (typeof data.count === "number") {
          setImageCleanups(data.count);
        } else {
          console.warn("Unexpected API response format:", data);
          setImageCleanups(0);
        }
      } catch (error) {
        console.error("Failed to fetch generated images data:", error);
        setImageCleanups(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Card className="hover:shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
          <CardContent className="p-6 py-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  画像圧縮数
                </p>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    読み込み中...
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <ImageDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="hover:shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                画像圧縮数
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {imageCleanups}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
              <ImageDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageOptimizeStatCard;
