"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type MediaRow = Record<string, any>;

type MovieItem = {
  id: number;
  title: string;
  year: number;
  rating: number;
  image: string;
  cover: string;
  synopsis: string;
  genre: string[];
  duration: string;
  age_rating: string;
};

const genres = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"];
const years = ["All", "2024", "2023", "2022", "2021", "2020"];
const ratings = ["All", "9+", "8+", "7+", "6+"];
const sortOptions = ["popularity", "rating", "year", "title"];

function mapRowToMovie(row: MediaRow): MovieItem {
  let genresArray: string[] = [];
  
  if (row.genres) {
    if (Array.isArray(row.genres)) genresArray = row.genres;
    else if (typeof row.genres === "string") {
      try {
        const parsed = JSON.parse(row.genres);
        genresArray = Array.isArray(parsed) ? parsed : [];
      } catch {
        genresArray = row.genres.split(",").map((g: string) => g.trim());
      }
    }
  }
  
  return {
    id: Number(row.media_id ?? row.id ?? 0),
    title: String(row.title ?? "Untitled"),
    year: row.release_date ? new Date(row.release_date).getFullYear() : 0,
    rating: Number(row.rating ?? row.score ?? 0),
    image: String(row.image ?? "/placeholder.svg"),
    cover: String(row.cover ?? "/placeholder.svg"),
    genre: genresArray,
    synopsis: String(row.synopsis ?? ""),
    duration: row.duration,
    age_rating: row.age_rating ?? "PG-13",
  };
}

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/media", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch media");

        const rows: MediaRow[] = await res.json();
        if (!active) return;

        setMovies(rows.map(mapRowToMovie).filter(m => m.id));
      } catch {
        if (active) setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false };
  }, []);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(m => selectedGenre === "All" || m.genre.includes(selectedGenre))
      .filter(m => selectedYear === "All" || m.year.toString() === selectedYear)
      .filter(m => {
        if (selectedRating === "All") return true;
        const minRating = parseInt(selectedRating);
        return m.rating >= minRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating": return b.rating - a.rating;
          case "year": return b.year - a.year;
          case "title": return a.title.localeCompare(b.title);
          default: return 0;
        }
      });
  }, [movies, searchQuery, selectedGenre, selectedYear, selectedRating, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading movies...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex pb-8">
      <Sidebar />

      <main className="flex-1 ml-16 overflow-hidden">
        {/* SEARCH & FILTER BAR */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-end">
              {/* Genre */}
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Genre</span>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-32">
                    <SelectValue>{selectedGenre}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Year</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24"><SelectValue>{selectedYear}</SelectValue></SelectTrigger>
                  <SelectContent>
                    {years.map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Rating</span>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-24"><SelectValue>{selectedRating}</SelectValue></SelectTrigger>
                  <SelectContent>
                    {ratings.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Sort By</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue>{sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(o => (
                      <SelectItem key={o} value={o}>
                        {o.charAt(0).toUpperCase() + o.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* MOVIES GRID */}
        <div className="p-6">
          <div className="mb-4 text-muted-foreground">
            Showing {filteredMovies.length} of {movies.length} movies
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredMovies.map(movie => (
              <MediaCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                age_rating={movie.age_rating}
                image={movie.image}
                cover={movie.cover}
                duration={movie.duration}
                synopsis={movie.synopsis}
                genre={movie.genre}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
