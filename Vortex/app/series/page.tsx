"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type SeriesRow = Record<string, any>;

type SeriesItem = {
  series_id: number;
  title: string;
  year?: number;
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

  if (row.genres) {
    if (Array.isArray(row.genres)) genresArray = row.genres;
    else {
      try {
        genresArray = JSON.parse(row.genres);
      } catch {
        genresArray = row.genres.split(",").map((g: string) => g.trim());
      }
    }
  }

  return {
    series_id: Number(row.series_id),
    title: String(row.title ?? "Untitled"),
    year: row.release_year ? Number(row.release_year) : undefined,
    rating: Number(row.rating ?? 0),
    image: row.image ?? "/placeholder.svg",
    genre: genresArray,
    seasons: Number(row.seasons ?? 1),
    episodes: Number(row.episodes ?? 1),
    creator: "Unknown",
  };
}

export default function SeriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(seriesList)
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/series", { cache: "no-store" });
        const rows = await res.json();

        if (!active) return;

        setSeriesList(rows.map(mapRowToSeries));
      } catch {
        if (active) setSeriesList([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredShows = useMemo(() => {
    return seriesList
      .filter(show => show.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(show => selectedGenre === "All" || show.genre.includes(selectedGenre))
      .filter(show => selectedYear === "All" || show.year?.toString() === selectedYear)
      .filter(show => {
        if (selectedRating === "All") return true;
        const min = parseInt(selectedRating);
        return show.rating >= min;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "rating": return b.rating - a.rating;
          case "year": return (b.year ?? 0) - (a.year ?? 0);
          case "title": return a.title.localeCompare(b.title);
          default: return 0;
        }
      });
  }, [seriesList, searchQuery, selectedGenre, selectedYear, selectedRating, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading TV shows...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex mb-10">
      <Sidebar />
      <main className="flex-1 ml-16 overflow-hidden">
        
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-end w-full lg:w-auto">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Genre</span>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-32">
                    <SelectValue>{selectedGenre}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Year</span>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue>{selectedYear}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Rating</span>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger className="w-24">
                    <SelectValue>{selectedRating}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Sort by</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-36">
                    <SelectValue>
                      {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </SelectValue>
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

        <div className="px-6 py-12">
          <div className="mb-4 text-muted-foreground">
            Showing {filteredShows.length} of {seriesList.length} TV shows
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredShows.map(show => (
              <div
                key={show.series_id}
                className="cursor-pointer"
                onClick={() => (window.location.href = `/series/${show.series_id}`)}
              >
                <div className="pointer-events-none">
                <MediaCard
                  id={show.series_id}
                  title={show.title}
                  year={show.year ?? 0}
                  image={show.image}
                  rating={show.rating}
                  genre={show.genre}
                  duration={`${show.seasons ?? 1} Seasons`}
                  description={`A ${show.genre.join(", ")} series released in ${show.year ?? "Unknown"}.`}
                />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}