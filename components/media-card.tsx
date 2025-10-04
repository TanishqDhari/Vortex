"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Plus, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MediaCardProps {
  id: number
  title: string
  year: number
  rating: number
  image: string
  genre: string[] | string
  progress?: number
  showProgress?: boolean
}

export function MediaCard({ id, title, year, rating, image, genre, progress, showProgress }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const genreArray = genre ? (Array.isArray(genre) ? genre : [genre]) : []

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />

          {/* Progress bar for continue watching */}
          {showProgress && progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <Progress value={progress} className="h-1" />
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/60 flex flex-col justify-between p-4 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-1">
                {genreArray.slice(0, 2).map((g) => (
                  <Badge key={g} variant="secondary" className="text-xs bg-secondary/80">
                    {g}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">⭐ {rating.toFixed(1)}</div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold text-sm line-clamp-2">{title}</h3>
                <p className="text-white/80 text-xs">{year}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" className="h-8 px-3 text-xs">
                  <Play className="mr-1 h-3 w-3" />
                  Play
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent border-white/50">
                  <Plus className="h-3 w-3" />
                </Button>
                <Link href={`/media/${id}`}>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent border-white/50">
                    <Info className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
