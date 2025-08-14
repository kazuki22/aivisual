"use client"

import { motion } from 'framer-motion'
import { Sparkles, Twitter, Github, Mail, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const footerLinks = {
  product: [
    { name: '機能一覧', href: '#features' },
    { name: '料金プラン', href: '#pricing' },
    { name: 'API ドキュメント', href: '#' },
    { name: 'ステータス', href: '#' },
  ],
  company: [
    { name: '会社概要', href: '#' },
    { name: 'チーム', href: '#' },
    { name: 'キャリア', href: '#' },
    { name: 'ニュース', href: '#' },
  ],
  support: [
    { name: 'ヘルプセンター', href: '#' },
    { name: 'お問い合わせ', href: '#contact' },
    { name: 'チュートリアル', href: '#' },
    { name: 'コミュニティ', href: '#' },
  ],
  legal: [
    { name: '利用規約', href: '#' },
    { name: 'プライバシーポリシー', href: '#' },
    { name: 'セキュリティ', href: '#' },
    { name: 'Cookie ポリシー', href: '#' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#contact', label: 'お問い合わせ' },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer id="contact" className="bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AIVisual
                </span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                AI技術を活用した画像処理サービスで、クリエイターの可能性を無限に広げます。
                世界中のデザイナー・マーケター・クリエイターに愛用されています。
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.button
                    key={index}
                    onClick={() => scrollToSection(social.href)}
                    className="w-10 h-10 bg-muted hover:bg-accent rounded-full flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4 text-foreground">プロダクト</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4 text-foreground">会社情報</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4 text-foreground">サポート</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4 text-foreground">法的事項</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="border-t py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2025 AIVisual. All rights reserved.</span>
              <span>•</span>
              <span>MIKEL.inc</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
