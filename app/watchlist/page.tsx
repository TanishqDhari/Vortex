"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MediaCard } from "@/components/media-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Grid3X3, List, Bookmark, Trash2 } from "lucide-react"

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
  priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const filteredItems = watchlistItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesGenre = selectedGenre === "all" || item.genre === selectedGenre
    return matchesSearch && matchesType && matchesGenre
  })

  const toggleItemSelection = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const removeSelectedItems = () => {
    // Remove selected items from watchlist
    setSelectedItems([])
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Bookmark className="w-8 h-8 mr-3" />
                  My Watchlist
                </h1>
                <p className="text-muted-foreground mt-1">{filteredItems.length} items in your watchlist</p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedItems.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={removeSelectedItems}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove ({selectedItems.length})
                  </Button>
                )}
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="tv">TV Shows</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Comedy">Comedy</SelectItem>
                    <SelectItem value="Drama">Drama</SelectItem>
                    <SelectItem value="Thriller">Thriller</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

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
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Create List
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="relative group">
                      <div
                        className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 cursor-pointer transition-colors ${
                          selectedItems.includes(item.id)
                            ? "bg-primary border-primary"
                            : "bg-background/80 border-border hover:border-primary"
                        }`}
                        onClick={() => toggleItemSelection(item.id)}
                      />
                      <MediaCard {...item} />
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {item.type === "movie" ? "Movie" : "TV Show"}
                          </Badge>
                          <Badge
                            variant={
                              item.priority === "High"
                                ? "destructive"
                                : item.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Added {item.addedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg hover:bg-card/80 transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-colors ${
                          selectedItems.includes(item.id)
                            ? "bg-primary border-primary"
                            : "bg-background border-border hover:border-primary"
                        }`}
                        onClick={() => toggleItemSelection(item.id)}
                      />
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.year}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type === "movie" ? "Movie" : "TV Show"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.genre}
                          </Badge>
                          <span className="text-sm text-muted-foreground">⭐ {item.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            item.priority === "High"
                              ? "destructive"
                              : item.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                          className="mb-2"
                        >
                          {item.priority}
                        </Badge>
                        <p className="text-xs text-muted-foreground">Added {item.addedAt}</p>
                      </div>
                      <Button>Watch Now</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
