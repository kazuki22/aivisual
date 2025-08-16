import {
  Image,
  ImageDown,
  Layers,
  LayoutDashboard,
  Settings,
  Scissors,
  Images,
} from "lucide-react";
import { NavItem } from "@/types/nav";

export const navItems: NavItem[] = [
  {
    title: "ダッシュボード",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "画像一覧",
    href: "/dashboard/images",
    icon: Images,
  },
  {
    title: "画像生成",
    href: "/dashboard/tools/image-generator",
    icon: Image,
  },
  {
    title: "背景削除",
    href: "/dashboard/tools/remove-bg",
    icon: Scissors,
  },
  {
    title: "画像圧縮",
    href: "/dashboard/tools/image-optimize",
    icon: ImageDown,
  },
  {
    title: "設定",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
