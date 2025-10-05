"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MediaCard } from "@/components/media-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock watchlist data
const watchlistItems = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  title: `Watchlist Item ${i + 1}`,
  year: 2020 + Math.floor(Math.random() * 5),
  rating: 7.0 + Math.random() * 2,
  image: `/placeholder.svg?height=400&width=300&query=watchlist item ${i + 1}`,
  genre: ["Action", "Drama", "Comedy", "Thriller"][Math.floor(Math.random() * 4)],
  type: Math.random() > 0.5 ? "movie" : "tv",
  addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
}))

const customLists = [
  { id: 1, name: "Weekend Movies", count: 12, isPublic: false },
  { id: 2, name: "Sci-Fi Collection", count: 8, isPublic: true },
  { id: 3, name: "Comedy Specials", count: 15, isPublic: false },
]

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("added")

  const filteredItems = watchlistItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesGenre = selectedGenre === "all" || item.genre === selectedGenre
    return matchesSearch && matchesType && matchesGenre
  })

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-16">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground flex items-center mb-1">
              <Bookmark className="w-8 h-8 mr-3" />
              My Watchlist
            </h1>
            <p className="text-muted-foreground mb-4">{filteredItems.length} items in your watchlist</p>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
             <div className="flex-1 relative h-10">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
  <Input
    placeholder="Search your watchlist..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10 h-full text-sm leading-none"
  />
</div>

              <div className="flex flex-wrap gap-4">
                {/* Type Filter */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Type</span>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="movie">Movies</SelectItem>
                      <SelectItem value="tv">TV Shows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Genre Filter */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Genre</span>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Comedy">Comedy</SelectItem>
                      <SelectItem value="Drama">Drama</SelectItem>
                      <SelectItem value="Thriller">Thriller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Sort by</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Date Added" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="added">Date Added</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Custom Lists Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Lists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customLists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-3 bg-card/50 rounded-lg hover:bg-card/80 transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-medium text-foreground">{list.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {list.count} items • {list.isPublic ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="normal" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Create List
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Watchlist */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id}>
                    <MediaCard {...item} />
                    <div className="mt-2 space-y-1">
                      {/* Removed type badge */}
                      <p className="text-xs text-muted-foreground">Added {item.addedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
