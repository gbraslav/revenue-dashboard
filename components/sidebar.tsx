"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Activities", href: "/activities", icon: "📋" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            ◆
          </div>
          <div>
            <h2 className="text-sm font-semibold">Main Menu</h2>
            <p className="text-xs text-muted-foreground">MANAGEMENT</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "w-full justify-start gap-3 px-3 py-2.5 h-auto",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator className="mx-3 bg-sidebar-border" />

      <div className="space-y-1 px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <span>❓</span> Help
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <span>🚪</span> Logout
        </Button>
      </div>
    </aside>
  );
}
