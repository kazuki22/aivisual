import Link from "next/link";
import DashboardNav from "@/components/dashboard/nav";
import MobileNav from "@/components/dashboard/mobile-nav";
import { Toaster } from "sonner";
import AuthButton from "@/components/auth/auth-button";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background">
        <div className="flex items-center h-16 px-6">
          <MobileNav />

          <div className="flex items-center w-full">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AIVisual
              </span>
            </Link>
            <div className="ml-auto hidden md:block">
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Layout */}
      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-0">
        {/* Sidebar */}
        <aside className="fixed md:sticky top-16 z-30 hidden md:block h-[calc(100vh-4.1rem)]">
          <div className="py-6 px-2 lg:py-8">
            <DashboardNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
