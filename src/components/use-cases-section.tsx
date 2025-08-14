"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  TrendingUp, 
  Instagram, 
  Building, 
  Camera, 
  ShoppingBag,
  Users,
  Briefcase 
} from 'lucide-react'

const useCases = [
  {
    icon: Palette,
    category: 'デザイナー・クリエイター',
    title: 'デザイン制作の効率化',
    description: 'ロゴ作成、イラスト生成、写真加工など、クリエイティブワークを大幅に短縮。プロジェクトの納期短縮とクオリティ向上を同時に実現。',
    cases: ['ブランドロゴの作成', 'プレゼン資料用画像', 'Webサイト素材']
  },
  {
    icon: TrendingUp,
    category: 'マーケティング担当者',
    title: 'マーケティング素材の制作',
    description: 'キャンペーン画像、バナー広告、SNS投稿用画像を効率的に作成。A/Bテスト用の複数パターンも簡単に生成できます。',
    cases: ['広告バナー制作', 'キャンペーン素材', 'LP用画像']
  },
  {
    icon: Instagram,
    category: 'SNS運用者',
    title: 'ソーシャルメディア運用',
    description: 'インスタグラム、Twitter、TikTokなど、各プラットフォームに最適化された画像を瞬時に生成。投稿の一貫性も保てます。',
    cases: ['投稿用画像作成', 'ストーリーズ素材', 'プロフィール画像']
  },
  {
    icon: Building,
    category: '小規模事業者',
    title: 'コスト効率の良い素材制作',
    description: 'デザイナーを雇うコストを削減しながら、プロレベルの画像素材を制作。ブランディングの統一も簡単に実現できます。',
    cases: ['商品画像加工', '店舗ポスター', 'メニュー表作成']
  }
]

const industries = [
  {
    icon: Camera,
    title: 'フォトグラファー',
    description: '撮影後の編集作業を自動化'
  },
  {
    icon: ShoppingBag,
    title: 'EC事業者',
    description: '商品画像の一括処理と最適化'
  },
  {
    icon: Users,
    title: 'HR・採用',
    description: '採用資料や社内資料の作成'
  },
  {
    icon: Briefcase,
    title: 'コンサルティング',
    description: 'プレゼン資料の視覚的向上'
  }
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-6 bg-gradient-to-b from-background to-muted/20">
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
              あらゆる業界で
            </span>
            <br />
            活用される実績
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            様々な職種・業界のプロフェッショナルがAIVisualを活用し、生産性の向上を実現しています
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <useCase.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">
                        {useCase.category}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-3">
                        {useCase.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      活用シーン
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {useCase.cases.map((case_, caseIndex) => (
                        <Badge key={caseIndex} variant="outline" className="text-xs">
                          {case_}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            他にもこんな業界で活用されています
          </h3>
          <p className="text-muted-foreground text-lg">
            幅広い業界・職種で成果を上げているAI画像処理ソリューション
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-lg bg-card hover:bg-accent transition-colors duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <industry.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">{industry.title}</h4>
              <p className="text-sm text-muted-foreground">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
