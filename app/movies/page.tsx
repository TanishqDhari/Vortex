"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

type MediaRow = Record<string, any>;
type MovieItem = {
  id: number;
  title: string;
  year: number;
  rating: number;
  image: string;
  genre: string | string[];
  duration?: string;
};

function minutesToDuration(minutes?: number | null): string | undefined {
  if (!minutes && minutes !== 0) return undefined;
  const hrs = Math.floor(Number(minutes) / 60);
  const mins = Math.round(Number(minutes) % 60);
  return `${hrs}h ${mins}m`;
}

function mapRowToMovie(row: MediaRow): MovieItem {
  return {
    id: Number(row.media_id ?? row.id ?? 0),
    title: String(row.title ?? "Untitled"),
    year: Number(row.release_year ?? row.year ?? 0),
    rating: Number(row.rating ?? 0) || 0,
    image: String(row.image ?? row.poster_url ?? "/placeholder.svg"),
    genre: row.genre ?? row.genres ?? "",
    duration: typeof row.duration === "number" ? minutesToDuration(row.duration) : String(row.duration ?? ""),
  };
}

const genres = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"];
const years = ["All", "2024", "2023", "2022", "2021", "2020"];
const ratings = ["All", "9+", "8+", "7+", "6+"];

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [movies, setMovies] = useState<MovieItem[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/media", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load media");
        const rows: MediaRow[] = await res.json();
        if (active) setMovies(rows.map(mapRowToMovie).filter((m) => m.id));
      } catch {
        if (active) setMovies([]);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredMovies = useMemo(
    () =>
      movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre;
        const matchesYear = selectedYear === "All" || movie.year.toString() === selectedYear;
        const matchesRating = selectedRating === "All" || movie.rating >= Number.parseInt(selectedRating);
        return matchesSearch && matchesGenre && matchesYear && matchesRating;
      }),
    [movies, searchQuery, selectedGenre, selectedYear, selectedRating]
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-16 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters with labels outside */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Genre</span>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-32">
                    <SelectValue>{selectedGenre}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="absolute z-50 w-32">
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Year</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue>{selectedYear}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="absolute z-50 w-24">
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Rating</span>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-24">
                    <SelectValue>{selectedRating}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="absolute z-50 w-24">
                    {ratings.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Sort by</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue>{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="absolute z-50 w-36">
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Movies list/grid scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 p-6">
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
                  className="flex items-center space-x-4 p-4 bg-card rounded-lg hover:bg-card/80 transition-colors">
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
  );
}
