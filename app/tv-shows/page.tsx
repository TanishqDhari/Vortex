"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MediaCard } from "@/components/media-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List } from "lucide-react"

// Mock data for TV shows
const tvShows = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `TV Series ${i + 1}`,
  year: 2020 + Math.floor(Math.random() * 5),
  rating: 7.0 + Math.random() * 2,
  image: `/placeholder.svg?height=400&width=300&query=tv series poster ${i + 1}`,
  genre: ["Drama", "Comedy", "Thriller", "Sci-Fi"][Math.floor(Math.random() * 4)],
  seasons: Math.floor(Math.random() * 5) + 1,
  episodes: Math.floor(Math.random() * 50) + 10,
  status: ["Ongoing", "Completed", "Cancelled"][Math.floor(Math.random() * 3)],
  creator: `Creator ${i + 1}`,
}))

const genres = ["All", "Drama", "Comedy", "Thriller", "Sci-Fi", "Crime", "Fantasy"]
const years = ["All", "2024", "2023", "2022", "2021", "2020"]
const statuses = ["All", "Ongoing", "Completed", "Cancelled"]

export default function TVShowsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredShows = tvShows.filter((show) => {
    const matchesSearch = show.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "All" || show.genre === selectedGenre
    const matchesYear = selectedYear === "All" || show.year.toString() === selectedYear
    const matchesStatus = selectedStatus === "All" || show.status === selectedStatus

    return matchesSearch && matchesGenre && matchesYear && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">TV Shows</h1>
              <div className="flex items-center space-x-2">
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
                  placeholder="Search TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex items-center space-x-2 mt-4">
              {selectedGenre !== "All" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedGenre("All")}>
                  {selectedGenre} ×
                </Badge>
              )}
              {selectedYear !== "All" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedYear("All")}>
                  {selectedYear} ×
                </Badge>
              )}
              {selectedStatus !== "All" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedStatus("All")}>
                  {selectedStatus} ×
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 text-muted-foreground">
            Showing {filteredShows.length} of {tvShows.length} TV shows
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filteredShows.map((show) => (
                <MediaCard
                  key={show.id}
                  id={show.id}
                  title={show.title}
                  year={show.year}
                  rating={show.rating}
                  image={show.image}
                  genre={[show.genre]}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShows.map((show) => (
                <div
                  key={show.id}
                  className="flex items-center space-x-4 p-4 bg-card rounded-lg hover:bg-card/80 transition-colors"
                >
                  <img
                    src={show.image || "/placeholder.svg"}
                    alt={show.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{show.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {show.year} • {show.seasons} Season{show.seasons > 1 ? "s" : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {show.episodes} Episodes • Creator: {show.creator}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{show.genre}</Badge>
                      <Badge
                        variant={
                          show.status === "Ongoing"
                            ? "default"
                            : show.status === "Completed"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {show.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">⭐ {show.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Button>Watch Now</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
