"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroContent {
  id: number
  title: string
  year: number
  rating: number
  duration: string
  age_rating: string
  synopsis: string
  image: string
  genre: string[]
}

interface HeroCarouselProps {
  content: HeroContent[]
}

export function HeroCarousel({ content }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [watchlistStatus, setWatchlistStatus] = useState(
    content.map(() => false) // track watchlist per slide
  )

  const toggleWatchlist = (index: number) => {
    setWatchlistStatus((prev) => {
      const updated = [...prev]
      updated[index] = !updated[index]
      return updated
    })
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="flex transition-transform duration-[1200ms] ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {content.map((item, index) => (
          <div key={item.id} className="min-w-full h-full relative">
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Slide content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl space-y-6">
                  <div className="flex items-center space-x-2">
                    {item.genre.map((g) => (
                      <Badge key={g} variant="secondary" className="bg-secondary/40 text-sm">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                    {item.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>Rating {item.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{item.age_rating}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-xl">
                    {item.synopsis}
                  </p>

                  <div className="flex items-center space-x-4">
                    {/* Watch Now */}
                    <Button size="lg" variant="gradient" className="text-lg px-8">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Now
                    </Button>

                    {/* Watchlist */}
                    <Button
                      variant="normal"
                      size="lg"
                      className="group relative px-6"
                      onClick={() => toggleWatchlist(index)}
                    >
                      {watchlistStatus[index] ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      {/* Tooltip */}
                      <span
                        className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                   opacity-0 group-hover:opacity-100
                                   bg-black text-white text-xs font-medium py-1 px-3 rounded-lg whitespace-nowrap
                                   pointer-events-none transition-all duration-200"
                      >
                        {watchlistStatus[index] ? "Added to Watchlist" : "Add to Watchlist"}
                      </span>
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="backdrop-blur-lg bg-white/15 border border-white/20 rounded-full px-5 py-2 flex items-center space-x-3 shadow-md">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-500 ease-in-out",
                index === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
