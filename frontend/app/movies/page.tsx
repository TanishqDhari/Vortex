"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MediaCard } from "@/components/media-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List } from "lucide-react"

// Mock data for movies
const movies = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Movie ${i + 1}`,
  year: 2020 + Math.floor(Math.random() * 5),
  rating: 7.0 + Math.random() * 2,
  image: `/placeholder.svg?height=400&width=300&query=movie poster ${i + 1}`,
  genre: ["Action", "Drama", "Thriller"][Math.floor(Math.random() * 3)],
  duration: `${90 + Math.floor(Math.random() * 60)}m`,
  director: `Director ${i + 1}`,
  cast: [`Actor ${i + 1}`, `Actor ${i + 2}`],
}))

const genres = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"]
const years = ["All", "2024", "2023", "2022", "2021", "2020"]
const ratings = ["All", "9+", "8+", "7+", "6+"]

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedRating, setSelectedRating] = useState("All")
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre
    const matchesYear = selectedYear === "All" || movie.year.toString() === selectedYear
    const matchesRating = selectedRating === "All" || movie.rating >= Number.parseInt(selectedRating)

    return matchesSearch && matchesGenre && matchesYear && matchesRating
  })

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">Movies</h1>
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
                  placeholder="Search movies..."
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

                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
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
              {selectedRating !== "All" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedRating("All")}>
                  {selectedRating}+ ×
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 text-muted-foreground">
            Showing {filteredMovies.length} of {movies.length} movies
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filteredMovies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  year={movie.year}
                  rating={movie.rating}
                  image={movie.image}
                  genre={[movie.genre]}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center space-x-4 p-4 bg-card rounded-lg hover:bg-card/80 transition-colors"
                >
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {movie.year} • {movie.duration}
                    </p>
                    <p className="text-sm text-muted-foreground">Director: {movie.director}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{movie.genre}</Badge>
                      <span className="text-sm text-muted-foreground">⭐ {movie.rating.toFixed(1)}</span>
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
