"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Buildings,
  Users,
  Robot,
  UsersFour,
  ChartBar,
  List,
  X,
  Briefcase,
  Blueprint,
  Lightbulb,
  ClipboardText,
  Copy,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Overview", icon: ChartBar },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/companies", label: "Companies", icon: Buildings },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/agents", label: "AI Agents", icon: Robot },
  { href: "/admin/agent-templates", label: "Agent Templates", icon: Copy },
  { href: "/admin/blueprints", label: "Blueprints", icon: Blueprint },
  { href: "/admin/insights", label: "Insights", icon: Lightbulb },
  { href: "/admin/audits", label: "Audits", icon: ClipboardText },
  { href: "/admin/team", label: "Team", icon: UsersFour },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon
              className="size-5"
              weight={isActive ? "fill" : "regular"}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 lg:hidden"
          >
            <List className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <Link href="/admin" className="text-lg font-serif font-bold">
                Synked Admin
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-card">
        <div className="border-b px-6 py-5">
          <Link href="/admin" className="text-lg font-serif font-bold">
            Synked Admin
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <NavLinks />
        </div>
      </aside>
    </>
  );
}
