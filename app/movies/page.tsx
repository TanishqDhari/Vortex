"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type MediaRow = Record<string, any>;
type MovieItem = {
  id: number;
  title: string;
  year: number;
  rating: number;
  image: string;
  genre: string[];
  duration?: string;
  director?: string;
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
    year: Number(row.release_date.slice(0, 4) ?? 0),
    rating: Number(row.rating ?? 0) || 0,
    image: String(row.image ?? row.poster_url ?? "/placeholder.svg"),
    genre: genres,
    duration: typeof row.duration === "number" ? minutesToDuration(row.duration) : String(row.duration ?? ""),
    director: String(row.director ?? ""),
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/media", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load media");
        const rows: MediaRow[] = await res.json();
        if (!active) return;
        setMovies(rows.map(mapRowToMovie).filter((m) => m.id));
      } catch {
        if (active) setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((movie) => selectedGenre === "All" || movie.genre.includes(selectedGenre))
      .filter((movie) => selectedYear === "All" || movie.year.toString() === selectedYear)
      .filter((movie) => {
        if (selectedRating === "All") return true;
        const minRating = Number.parseInt(selectedRating);
        return movie.rating >= minRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "year":
            return b.year - a.year;
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0; // popularity fallback (or implement your own)
        }
      });
  }, [movies, searchQuery, selectedGenre, selectedYear, selectedRating, sortBy]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading movies...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-16 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
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
          </div>
        </div>

        {/* Movies list/grid */}
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
                  genre={movie.genre}
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
                      {movie.genre.map((g) => (
                        <Badge key={g} variant="outline">
                          {g}
                        </Badge>
                      ))}
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
