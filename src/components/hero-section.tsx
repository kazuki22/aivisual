"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Play, Sparkles, Zap, Image, Scissors } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-6 text-sm">
              🚀 新機能リリース：AI画像生成がさらに高精度に
            </Badge>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI画像処理で
            </span>
            <br />
            <span className="text-foreground">
              クリエイティブを革新
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            AI技術を活用した画像生成・背景除去・圧縮機能で、
            デザイナーやクリエイターの制作効率を飛躍的に向上させます。
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 h-auto w-100"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              無料で始める
            </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative max-w-5xl mx-auto mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI画像生成</h3>
                <p className="text-muted-foreground text-sm">
                  テキストから高品質な画像を瞬時に生成
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scissors className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">背景除去</h3>
                <p className="text-muted-foreground text-sm">
                  ワンクリックで精密な背景除去を実現
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">高速圧縮</h3>
                <p className="text-muted-foreground text-sm">
                  品質を保ったまま画像サイズを最適化
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
    </section>
  )
}