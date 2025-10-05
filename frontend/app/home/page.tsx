"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HeroCarousel } from "@/components/hero-carousel"
import { ContentSection } from "@/components/content-section"
import { MediaCard } from "@/components/media-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for demonstration
const featuredContent = [
  {
    id: 1,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
    image: "/dark-knight-poster.png",
    genre: ["Action", "Crime", "Drama"],
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    duration: "2h 28m",
    synopsis: "A thief who steals corporate secrets through dream-sharing technology...",
    image: "/inception-movie-poster.png",
    genre: ["Action", "Sci-Fi", "Thriller"],
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    duration: "2h 49m",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival...",
    image: "/interstellar-movie-poster.jpg",
    genre: ["Adventure", "Drama", "Sci-Fi"],
  },
]

const trendingMovies = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Movie ${i + 1}`,
  year: 2024,
  rating: 8.5 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=movie poster ${i + 1}`,
  genre: ["Action", "Drama"],
}))

const continueWatching = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Series ${i + 1}`,
  year: 2024,
  rating: 8.0 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=tv series poster ${i + 1}`,
  genre: ["Drama", "Thriller"],
  progress: Math.floor(Math.random() * 100),
}))

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies, TV shows, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Hero Carousel */}
        <HeroCarousel content={featuredContent} />

        {/* Content Sections */}
        <div className="px-6 py-8 space-y-12">
          {/* Continue Watching */}
          <ContentSection title="Continue Watching" viewAllHref="/watchlist">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {continueWatching.map((item) => (
                <MediaCard key={item.id} {...item} showProgress />
              ))}
            </div>
          </ContentSection>

          {/* Trending Now */}
          <ContentSection title="Trending Now" viewAllHref="/movies">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {trendingMovies.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </div>
          </ContentSection>

          {/* Recommended for You */}
          <ContentSection title="Recommended for You" viewAllHref="/recommendations">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {trendingMovies.slice(0, 8).map((item) => (
                <MediaCard key={`rec-${item.id}`} {...item} />
              ))}
            </div>
          </ContentSection>

          {/* Popular Movies */}
          <ContentSection title="Popular Movies" viewAllHref="/movies/popular">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {trendingMovies.slice(2, 10).map((item) => (
                <MediaCard key={`pop-${item.id}`} {...item} />
              ))}
            </div>
          </ContentSection>
        </div>
      </div>
    </div>
  )
}
