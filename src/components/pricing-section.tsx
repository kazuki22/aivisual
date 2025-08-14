"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Building,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pricingPlans = [
  {
    name: "フリープラン",
    price: "0",
    period: "永久無料",
    description: "AIVisualを試してみたい方に最適",
    icon: Sparkles,
    features: [
      "月間5クレジット",
      "AI画像生成（基本モデル）",
      "背景除去",
      "画像圧縮",
      "コミュニティサポート",
      "ウォーターマーク付き",
    ],
    limitations: ["高解像度出力は不可", "商用利用制限あり"],
    buttonText: "今すぐ始める",
    popular: false,
    color: "from-gray-500 to-gray-600",
  },
  {
    name: "スタータープラン",
    price: "1,980",
    period: "月額",
    description: "個人クリエイターや小規模チームに",
    icon: Zap,
    features: [
      "月間100クレジット",
      "AI画像生成（全モデル）",
      "背景除去（高精度）",
      "画像圧縮・リサイズ",
      "アップスケーリング",
      "優先サポート",
      "ウォーターマークなし",
      "商用利用可能",
    ],
    limitations: [],
    buttonText: "無料体験を始める",
    popular: true,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "プロフェッショナル",
    price: "4,980",
    period: "月額",
    description: "本格運用する事業者・代理店に",
    icon: Crown,
    features: [
      "月間500クレジット",
      "AI画像生成（プレミアムモデル）",
      "全機能無制限利用",
      "API アクセス",
      "バッチ処理",
      "カスタムモデル",
      "専用サポート",
      "使用状況分析",
    ],
    limitations: [],
    buttonText: "無料体験を始める",
    popular: false,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "エンタープライズ",
    price: "カスタム",
    period: "お見積もり",
    description: "大企業・大規模運用に最適",
    icon: Building,
    features: [
      "無制限クレジット",
      "カスタムAIモデル",
      "オンプレミス対応",
      "SLA保証",
      "セキュリティ監査対応",
      "専任サポート",
      "研修・導入支援",
      "カスタム統合",
    ],
    limitations: [],
    buttonText: "お問い合わせ",
    popular: false,
    color: "from-emerald-500 to-emerald-600",
  },
];

const faqItems = [
  {
    question: "クレジットとは何ですか？",
    answer:
      "クレジットは画像処理を行うために消費するポイントです。AI画像生成は1回2クレジット、背景除去は1回1クレジット消費します。",
  },
  {
    question: "無料体験期間はありますか？",
    answer:
      "はい。有料プランには14日間の無料体験期間があります。期間中はいつでもキャンセル可能です。",
  },
  {
    question: "商用利用は可能ですか？",
    answer:
      "スタータープラン以上であれば商用利用が可能です。生成された画像の著作権はお客様に帰属します。",
  },
  {
    question: "プランの変更はいつでもできますか？",
    answer:
      "はい。プランのアップグレード・ダウングレードはいつでも可能です。変更は次回請求サイクルから適用されます。",
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              シンプルな料金プラン
            </span>
            <br />
            あらゆる規模に対応
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            無料プランから本格的なエンタープライズ利用まで、お客様のニーズに合わせたプランをご用意
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative ${plan.popular ? "lg:scale-105" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  人気No.1
                </Badge>
              )}
              <Card
                className={`h-full ${plan.popular ? "border-2 border-blue-500" : ""} hover:shadow-lg transition-all duration-300`}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}
                  >
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold">
                      {plan.price === "カスタム" ? "" : "¥"}
                      {plan.price}
                    </span>
                    {plan.price !== "カスタム" && (
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    )}
                    {plan.price === "カスタム" && (
                      <span className="text-lg text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard">
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                  </Link>
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start space-x-2"
                      >
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div
                        key={limitIndex}
                        className="flex items-start space-x-2"
                      >
                        <div className="h-4 w-4 rounded-full bg-red-100 dark:bg-red-900 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* よくある質問 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              よくある質問
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              お客様からよくいただくご質問と回答をご紹介します
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-600"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold py-1 text-lg text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.question}
                        </h4>
                        <motion.div
                          initial={false}
                          animate={{
                            height: openFaq === index ? "auto" : 0,
                            opacity: openFaq === index ? 1 : 0,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted-foreground leading-relaxed pb-2">
                            {item.answer}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
