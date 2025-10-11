'use client';

import {
  Home,
  Search,
  Film,
  Tv,
  Bookmark,
  Grid3X3,
  User,
  Settings,
  Flame, // Using Flame as a logo icon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/series", icon: Tv },
  { name: "Watchlist", href: "/watchlist", icon: Bookmark },
  { name: "Categories", href: "/categories", icon: Grid3X3 },
];

const bottomNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "group fixed top-0 left-0 z-40 h-full border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl",
        "flex flex-col justify-between transition-all duration-300 ease-in-out",
        "w-16 hover:w-56 p-3"
      )}
    >
      {/* Top section with logo and navigation */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-4 h-10 mb-8 pl-1">
          <Flame className="h-6 w-6 text-sidebar-primary flex-shrink-0" />
          <span className="text-lg font-bold text-sidebar-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Vortex
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "transition-colors duration-200 relative"
                )}
              >
                {/* Active indicator bar */}
                <div
                  className={cn(
                    "absolute left-[-0.75rem] h-6 w-1 bg-sidebar-primary rounded-r-full transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section with user/settings */}
      <div className="flex flex-col gap-2">
        {bottomNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "transition-colors duration-200 relative"
              )}
            >
              <div
                className={cn(
                  "absolute left-[-0.75rem] h-6 w-1 bg-sidebar-primary rounded-r-full transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}