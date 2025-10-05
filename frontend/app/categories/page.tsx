"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MediaCard } from "@/components/media-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const categories = [
  {
    id: "action",
    name: "Action",
    description: "High-octane thrills and adrenaline-pumping adventures",
    color: "bg-red-500/20 border-red-500/30",
    count: 156,
  },
  {
    id: "comedy",
    name: "Comedy",
    description: "Laugh-out-loud moments and feel-good entertainment",
    color: "bg-yellow-500/20 border-yellow-500/30",
    count: 89,
  },
  {
    id: "drama",
    name: "Drama",
    description: "Compelling stories and emotional journeys",
    color: "bg-blue-500/20 border-blue-500/30",
    count: 203,
  },
  {
    id: "horror",
    name: "Horror",
    description: "Spine-chilling scares and supernatural thrills",
    color: "bg-purple-500/20 border-purple-500/30",
    count: 67,
  },
  {
    id: "romance",
    name: "Romance",
    description: "Love stories and heartwarming relationships",
    color: "bg-pink-500/20 border-pink-500/30",
    count: 94,
  },
  {
    id: "sci-fi",
    name: "Sci-Fi",
    description: "Futuristic worlds and technological wonders",
    color: "bg-green-500/20 border-green-500/30",
    count: 78,
  },
  {
    id: "thriller",
    name: "Thriller",
    description: "Edge-of-your-seat suspense and mystery",
    color: "bg-orange-500/20 border-orange-500/30",
    count: 112,
  },
  {
    id: "documentary",
    name: "Documentary",
    description: "Real stories and educational content",
    color: "bg-teal-500/20 border-teal-500/30",
    count: 45,
  },
]

const featuredContent = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Featured ${i + 1}`,
  year: 2024,
  rating: 8.0 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=featured content ${i + 1}`,
  genre: ["Featured"],
}))

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">Discover content by genre and category</p>
          </div>
        </div>

        <div className="p-6">
          {!selectedCategory ? (
            <div className="space-y-8">
              {/* Category Grid */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Genre</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer hover:scale-105 transition-transform duration-200 ${category.color}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                        <Badge variant="secondary">{category.count} titles</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Featured This Week */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Featured This Week</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {featuredContent.map((item) => (
                    <MediaCard key={item.id} {...item} />
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Filters</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-foreground">New Releases</h3>
                      <p className="text-sm text-muted-foreground">Latest additions</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-foreground">Top Rated</h3>
                      <p className="text-sm text-muted-foreground">Highest rated content</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-foreground">Trending</h3>
                      <p className="text-sm text-muted-foreground">Popular right now</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-foreground">Award Winners</h3>
                      <p className="text-sm text-muted-foreground">Critically acclaimed</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            /* Category Detail View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {categories.find((c) => c.id === selectedCategory)?.description}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Back to Categories
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {featuredContent.map((item) => (
                  <MediaCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
