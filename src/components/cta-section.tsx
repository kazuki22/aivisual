"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight, Gift, Clock, Users } from 'lucide-react'
import Link from 'next/link'

const ctaFeatures = [
  {
    icon: Gift,
    title: '5クレジット無料',
    description: '無料で最新のAI画像生成を体験'
  },
  {
    icon: Clock,
    title: '30秒で開始',
    description: 'メールアドレスだけで簡単登録'
  },
  {
    icon: Users,
    title: '豊富な利用実績',
    description: '多くのクリエイターが活用中'
  }
]

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Sparkles className="w-4 h-4 mr-2" />
            今なら無料クレジットプレゼント
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            AI画像処理の可能性を今すぐ体験してください
          </h2>
          
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            アカウント登録は30秒で完了。無料クレジットですぐに全機能をお試しいただけます。
          </p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-3 h-auto font-semibold"
            >
              無料で始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {ctaFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="text-center p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm opacity-75">
            クレジットカードは不要 • いつでもキャンセル可能 • 日本語サポート対応
          </p>
        </motion.div>
      </div>
    </section>
  )
}