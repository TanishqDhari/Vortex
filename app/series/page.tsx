"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type SeriesRow = Record<string, any>;
type SeriesItem = {
  id: number;
  title: string;
  year: number;
  rating: number;
  image: string;
  genre: string[];
  seasons?: number;
  episodes?: number;
  creator?: string;
};

const genres = ["All", "Drama", "Comedy", "Thriller", "Sci-Fi", "Crime", "Fantasy"];
const years = ["All", "2024", "2023", "2022", "2021", "2020"];
const ratings = ["All", "9+", "8+", "7+", "6+"];
const sortOptions = ["popularity", "rating", "year", "title"];

function mapRowToSeries(row: SeriesRow): SeriesItem {
  let genresArray: string[] = [];
  if (row.genre) {
    if (Array.isArray(row.genre)) genresArray = row.genre;
    else if (typeof row.genre === "string") genresArray = row.genre.split(",").map((g) => g.trim());
  }

  return {
    id: Number(row.tv_id ?? row.id ?? 0),
    title: String(row.title ?? "Untitled"),
    year: Number(row.release_date.slice(0, 4) ?? row.year ?? 0),
    rating: Number(row.rating ?? 0),
    image: String(row.image ?? row.poster_url ?? "/placeholder.svg"),
    genre: genresArray,
    seasons: Number(row.seasons ?? 1),
    episodes: Number(row.episodes ?? 1),
    creator: String(row.creator ?? "Unknown"),
  };
}

export default function SeriessPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [Seriess, setSeriess] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch TV shows from API
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/series", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch series");
        const rows: SeriesRow[] = await res.json();
        if (!active) return;
        setSeriess(rows.map(mapRowToSeries).filter((s) => s.id));
      } catch (err) {
        if (active) setSeriess([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Filtered and sorted TV shows
  const filteredShows = useMemo(() => {
    return Seriess.filter((show) => show.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((show) => selectedGenre === "All" || show.genre.includes(selectedGenre))
      .filter((show) => selectedYear === "All" || show.year.toString() === selectedYear)
      .filter((show) => {
        if (selectedRating === "All") return true;
        const minRating = Number.parseInt(selectedRating);
        return show.rating >= minRating;
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
            return 0; // popularity fallback (implement if needed)
        }
      });
  }, [Seriess, searchQuery, selectedGenre, selectedYear, selectedRating, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading TV shows...</div>
    );
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
                placeholder="Search TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

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
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters */}
            <div className="flex items-center space-x-2 mt-2">
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
                  {selectedRating} ×
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 p-6">
          <div className="mb-4 text-muted-foreground">
            Showing {filteredShows.length} of {Seriess.length} TV shows
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredShows.map((show) => (
              <MediaCard
                key={show.id}
                id={show.id}
                title={show.title}
                year={show.year}
                rating={show.rating}
                image={show.image}
                genre={show.genre}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
