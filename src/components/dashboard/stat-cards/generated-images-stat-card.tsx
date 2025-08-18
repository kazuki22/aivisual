"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Loader2 } from "lucide-react";

interface GeneratedImagesStatCardProps {
  index: number;
}

const GeneratedImagesStatCard = ({ index }: GeneratedImagesStatCardProps) => {
  const [generatedImages, setGeneratedImages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/images?type=AI_GENERATED&status=COMPLETED",
          { credentials: "include" }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // countフィールドが存在することを確認
        if (typeof data.count === "number") {
          setGeneratedImages(data.count);
        } else {
          console.warn("Unexpected API response format:", data);
          setGeneratedImages(0);
        }
      } catch (error) {
        console.error("Failed to fetch generated images data:", error);
        setGeneratedImages(0);
      } finally {
        setLoading(false);
      }
    };

    if (userLoaded && isSignedIn) {
      fetchData();
    }
  }, [userLoaded, isSignedIn]);

  if (loading) {
    return (
      <div>
        <Card className="hover:shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
          <CardContent className="p-6 py-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  生成画像数
                </p>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    読み込み中...
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Image className="h-6 w-6 text-white" />
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
                生成画像数
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {generatedImages}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Image className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedImagesStatCard;
