"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroContent {
  id: number
  title: string
  year: number
  rating: number
  duration: string
  synopsis: string
  image: string
  genre: string[]
}

interface HeroCarouselProps {
  content: HeroContent[]
}

export function HeroCarousel({ content }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [content.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + content.length) % content.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length)
  }

  const currentContent = content[currentIndex]

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentContent.image || "/placeholder.svg"}
          alt={currentContent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center space-x-2">
              {currentContent.genre.map((g) => (
                <Badge key={g} variant="secondary" className="bg-secondary/80">
                  {g}
                </Badge>
              ))}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">{currentContent.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>{currentContent.year}</span>
              <span>•</span>
              <span>⭐ {currentContent.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{currentContent.duration}</span>
            </div>
            <p className="text-lg text-muted-foreground text-pretty max-w-xl">{currentContent.synopsis}</p>
            <div className="flex items-center space-x-4">
              <Button size="lg" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                Watch Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <Plus className="mr-2 h-5 w-5" />
                My List
              </Button>
              <Button size="lg" variant="ghost" className="text-lg px-8">
                <Info className="mr-2 h-5 w-5" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {content.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-primary w-8" : "bg-white/50",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
