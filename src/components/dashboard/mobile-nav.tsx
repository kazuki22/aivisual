import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import DashboardNav from "./nav";

const MobileNav = () => {
  return (
    <Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
    <Menu className="h-6 w-6" />
    <span className="sr-only">Open Menu</span>
    </Button>
    </SheetTrigger>
  <SheetContent side="left" className="pl-1 pr-0">
    <SheetHeader className="py-3 text-left px-10">
      <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
    </SheetHeader>
    <div className="px-7">
        <DashboardNav />
    </div>
  </SheetContent>
</Sheet>
  )
}

export default MobileNav;