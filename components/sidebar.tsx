"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Home,
  Search,
  Film,
  Tv,
  Bookmark,
  Grid3X3,
  User,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/tv-shows", icon: Tv },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark, badge: 12 },
  { name: "Categories", href: "/categories", icon: Grid3X3 },
]

const bottomNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [hovered, setHovered] = useState<string | null>(null)
  const pathname = usePathname() // Get current route

  return (
    <div className="fixed top-0 left-0 z-40 h-full w-16 border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl flex flex-col justify-between py-6">
      {/* Logo */}
      <div className="flex flex-col items-center space-y-8">
        <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>

        {/* Navigation icons */}
        <nav className="flex flex-col space-y-4 mt-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href // dynamic active check
            return (
              <div
                key={item.name}
                className="relative group flex justify-center"
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center rounded-lg p-3 text-sidebar-foreground hover:bg-sidebar-accent/40 transition-colors",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>

                {/* Floating label */}
                {hovered === item.name && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-sidebar/70 backdrop-blur-md text-sm text-sidebar-foreground shadow-md whitespace-nowrap ml-2 flex items-center gap-2">
                    {item.name}
                    {item.badge && (
                      <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col items-center space-y-4">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <div
              key={item.name}
              className="relative group flex justify-center"
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center rounded-lg p-3 text-sidebar-foreground hover:bg-sidebar-accent/40 transition-colors",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>

              {hovered === item.name && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-sidebar/70 backdrop-blur-md text-sm text-sidebar-foreground shadow-md whitespace-nowrap ml-2">
                  {item.name}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
