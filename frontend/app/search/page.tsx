"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MediaCard } from "@/components/media-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp } from "lucide-react"

// Mock data
const trendingSearches = [
  "The Dark Knight",
  "Inception",
  "Breaking Bad",
  "Game of Thrones",
  "Marvel",
  "Christopher Nolan",
  "Leonardo DiCaprio",
  "Sci-Fi Movies",
]

const searchResults = {
  movies: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Movie Result ${i + 1}`,
    year: 2020 + Math.floor(Math.random() * 5),
    rating: 7.0 + Math.random() * 2,
    image: `/placeholder.svg?height=400&width=300&query=movie search result ${i + 1}`,
    genre: ["Action", "Drama"],
  })),
  tvShows: Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `TV Show Result ${i + 1}`,
    year: 2020 + Math.floor(Math.random() * 5),
    rating: 7.0 + Math.random() * 2,
    image: `/placeholder.svg?height=400&width=300&query=tv show search result ${i + 1}`,
    genre: ["Drama", "Thriller"],
  })),
  actors: Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Actor ${i + 1}`,
    image: `/placeholder.svg?height=400&width=300&query=actor portrait ${i + 1}`,
    knownFor: ["Movie A", "Movie B", "TV Show C"],
  })),
  directors: Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Director ${i + 1}`,
    image: `/placeholder.svg?height=400&width=300&query=director portrait ${i + 1}`,
    knownFor: ["Film A", "Film B", "Film C"],
  })),
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setHasSearched(true)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground mb-4">Search</h1>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search movies, TV shows, actors, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                className="pl-10 text-lg h-12"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {!hasSearched ? (
            /* Trending Searches */
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Trending Searches</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm py-2 px-4"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>

              {/* Popular Categories */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-foreground mb-6">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Action Movies", "Comedy Series", "Documentaries", "Sci-Fi Films"].map((category) => (
                    <div
                      key={category}
                      className="p-6 bg-card rounded-lg hover:bg-card/80 transition-colors cursor-pointer"
                      onClick={() => handleSearch(category)}
                    >
                      <h3 className="font-medium text-foreground">{category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Explore {category.toLowerCase()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Search results for "{searchQuery}"</h2>
                <Button variant="outline" onClick={() => setHasSearched(false)}>
                  Clear Search
                </Button>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="movies">Movies</TabsTrigger>
                  <TabsTrigger value="tv">TV Shows</TabsTrigger>
                  <TabsTrigger value="actors">Actors</TabsTrigger>
                  <TabsTrigger value="directors">Directors</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8">
                  {/* Movies Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Movies</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {searchResults.movies.slice(0, 6).map((movie) => (
                        <MediaCard key={`movie-${movie.id}`} {...movie} />
                      ))}
                    </div>
                  </div>

                  {/* TV Shows Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">TV Shows</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {searchResults.tvShows.slice(0, 6).map((show) => (
                        <MediaCard key={`tv-${show.id}`} {...show} />
                      ))}
                    </div>
                  </div>

                  {/* People Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">People</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {[...searchResults.actors.slice(0, 3), ...searchResults.directors.slice(0, 3)].map((person) => (
                        <div key={person.id} className="text-center">
                          <img
                            src={person.image || "/placeholder.svg"}
                            alt={person.name}
                            className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                          />
                          <h4 className="font-medium text-foreground text-sm">{person.name}</h4>
                          <p className="text-xs text-muted-foreground">Known for: {person.knownFor[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="movies">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.movies.map((movie) => (
                      <MediaCard key={movie.id} {...movie} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tv">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.tvShows.map((show) => (
                      <MediaCard key={show.id} {...show} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="actors">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.actors.map((actor) => (
                      <div key={actor.id} className="text-center">
                        <img
                          src={actor.image || "/placeholder.svg"}
                          alt={actor.name}
                          className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-medium text-foreground">{actor.name}</h4>
                        <p className="text-sm text-muted-foreground">Known for:</p>
                        <p className="text-xs text-muted-foreground">{actor.knownFor.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="directors">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {searchResults.directors.map((director) => (
                      <div key={director.id} className="text-center">
                        <img
                          src={director.image || "/placeholder.svg"}
                          alt={director.name}
                          className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-medium text-foreground">{director.name}</h4>
                        <p className="text-sm text-muted-foreground">Known for:</p>
                        <p className="text-xs text-muted-foreground">{director.knownFor.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
