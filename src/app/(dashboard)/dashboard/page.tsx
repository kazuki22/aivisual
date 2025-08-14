"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "残りクレジット",
      value: "85",
      total: "100",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
      trend: "+15%",
    },
    {
      title: "生成画像数",
      value: "42",
      total: "",
      icon: Image,
      color: "from-purple-500 to-purple-600",
      trend: "+28%",
    },
    {
      title: "背景除去数",
      value: "18",
      total: "",
      icon: Scissors,
      color: "from-emerald-500 to-emerald-600",
      trend: "+12%",
    },
    {
      title: "今月の使用量",
      value: "67%",
      total: "",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      trend: "+5%",
    },
  ];

  const recentImages = [
    {
      id: 1,
      name: "未来都市の夜景",
      type: "AI生成",
      date: "2024-01-15",
      size: "2.4MB",
      status: "completed",
    },
    {
      id: 2,
      name: "ポートレート写真",
      type: "背景除去",
      date: "2024-01-14",
      size: "1.8MB",
      status: "completed",
    },
    {
      id: 3,
      name: "アート作品",
      type: "AI生成",
      date: "2024-01-13",
      size: "3.1MB",
      status: "processing",
    },
  ];

  const quickActions = [
    {
      title: "画像生成",
      description: "AIで新しい画像を作成",
      icon: Plus,
      color: "from-blue-500 to-purple-600",
      href: "/dashboard/tools/image-generator",
    },
    {
      title: "背景除去",
      description: "画像の背景を自動除去",
      icon: Scissors,
      color: "from-emerald-500 to-teal-600",
      href: "/dashboard/tools/remove-background",
    },
    {
      title: "画像最適化",
      description: "画像を圧縮・リサイズ",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      href: "/dashboard/tools/image-optimizer",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </span>
                        {stat.total && (
                          <span className="text-sm text-muted-foreground">
                            / {stat.total}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* クイックアクション */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  クイックアクション
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* 最近の画像 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>最近の画像</span>
                  <Button variant="ghost" size="sm">
                    すべて表示
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {image.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {image.type}
                            </Badge>
                            <span>•</span>
                            <span>{image.date}</span>
                            <span>•</span>
                            <span>{image.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {image.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            完了
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            処理中
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
