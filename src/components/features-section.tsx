"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Scissors, 
  Zap, 
  Palette, 
  Wand2, 
  ImageIcon,
  Clock,
  Shield
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI画像生成',
    description: '最新のAI技術を使用して、テキストプロンプトから高品質な画像を生成。アートワークからプロダクト画像まで、あらゆるニーズに対応します。',
    badge: '人気',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Scissors,
    title: '背景除去',
    description: 'AI技術による精密な背景除去機能。人物、商品、動物など、どんな被写体でも自然な仕上がりを実現します。',
    badge: '高精度',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Zap,
    title: '画像圧縮',
    description: '画質を損なうことなく画像サイズを最適化。ウェブサイトの表示速度向上やストレージの節約に貢献します。',
    badge: '高速',
    color: 'from-indigo-500 to-indigo-600'
  }
]

const benefits = [
  {
    icon: Clock,
    title: '作業時間を90%削減',
    description: '従来手作業で行っていた画像処理を自動化'
  },
  {
    icon: Shield,
    title: 'プライバシー保護',
    description: 'すべての画像処理は安全に暗号化されて実行'
  },
  {
    icon: Zap,
    title: '高速処理',
    description: '平均3秒以内で高品質な結果を提供'
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
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
              強力な機能で
            </span>
            <br />
            クリエイティブワークを加速
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AIを活用した画像処理ツールで、デザイナーやクリエイターの作業効率を劇的に向上させます
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              なぜAIVisualが選ばれるのか
            </h3>
            <p className="text-muted-foreground text-lg">
              業界をリードする技術と使いやすさを兼ね備えたソリューション
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
