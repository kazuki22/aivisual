export const STRIPE_PRICE_IDS = {
  STARTER: "price_1Rx1duDvnelBMdJWHH1Qx5Vn",
  PRO: "price_1Rx1g8DvnelBMdJWRGsXrY63",
  ENTERPRISE: "price_1Rx1hGDvnelBMdJWTEUMpRcc",
};

export const plans = [
  {
    name: "Starter",
    icon: "sparkles",
    price: "￥1,980",
    description: "個人利用に最適なプランです。",
    features: [
      "月50クレジット付与",
      "基本的な画像生成",
    ],
    buttonText: "Starterプランを選択",
    priceId: STRIPE_PRICE_IDS.STARTER,
  },
  {
    name: "Pro",
    icon: "rocket",
    price: "￥2,980",
    description: "チーム向けのプランです。",
    features: [
      "月100クレジット付与",
      "高度な画像生成",
    ],
    popular: true,
    buttonText: "Proプランを選択",
    priceId: STRIPE_PRICE_IDS.PRO,
  },
  {
    name: "Enterprise",
    icon: "shield-check",
    price: "￥5,980",
    description: "エンタープライズ向けのプランです。",
    features: [
      "月300クレジット付与",
      "高度な画像生成",
    ],
    buttonText: "Enterpriseプランを選択",
    priceId: STRIPE_PRICE_IDS.ENTERPRISE,
  },
];
