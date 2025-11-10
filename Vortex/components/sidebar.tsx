'use client';

import {
  Home,
  Search,
  Film,
  Tv,
  Bookmark,
  Grid3X3,
  User,
  Flame,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  { name: "Logout", href: "/logout", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      setLoading(true);

      await fetch("/api/user/logout", { method: "POST" });

      localStorage.removeItem("userId");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");

      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Something went wrong during logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={cn(
        "group fixed top-0 left-0 z-40 h-full border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl",
        "flex flex-col justify-between transition-all duration-300 ease-in-out",
        "w-16 hover:w-56 p-3"
      )}
    >
      {/* Top section */}
      <div>
        <div className="flex items-center gap-4 h-10 mb-8 pl-1">
          <Flame className="h-6 w-6 text-sidebar-primary flex-shrink-0" />
          <span className="text-lg font-bold text-sidebar-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Vortex
          </span>
        </div>

        {/* Navigation links */}
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

      {/* Bottom section (Profile + Logout) */}
      <div className="flex flex-col gap-2">
        {bottomNavigation.map((item) => {
          if (item.name === "Logout") {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                disabled={loading}
                className={cn(
                  "flex items-center gap-4 p-2 rounded-lg text-sidebar-foreground hover:bg-red-600/20 hover:text-red-500 transition-colors duration-200 relative"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {loading ? "Logging out..." : item.name}
                </span>
              </button>
            );
          }

          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 relative"
              )}
            >
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
