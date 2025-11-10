"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { HeroCarousel } from "@/components/hero-carousel";
import { HorizontalCarousel } from "@/components/movie-carousel";
import { MediaCard } from "@/components/media-card";

type MediaRow = Record<string, any>;

type HeroItem = {
  id: number;
  title: string;
  year: number;
  rating: number;
  age_rating: string;
  duration: string;
  synopsis: string;
  image: string;
  genre: string[];
};

type CardItem = {
  id: number;
  age_rating: string;
  title: string;
  year: number;
  rating: number;
  duration: string;
  image: string;
  genre: string[];
  progress?: number;
};

function minutesToDuration(minutes?: number | null): string {
  if (!minutes || Number.isNaN(minutes)) return "";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
}

function mapRowToCard(row: MediaRow): CardItem {
  let genresArray: string[] = [];
  if (row.genres) {
    if (Array.isArray(row.genres)) {
      genresArray = row.genres;
    } else if (typeof row.genres === "string") {
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
    title: String(row.title ?? row.name ?? "Untitled"),
    year: row.release_date ? new Date(row.release_date).getFullYear() : 0,
    age_rating: row.age_rating || "PG-13",
    rating: Number(row.rating ?? row.score ?? 0) || 8.5,
    image: String(row.image ?? "/placeholder.svg"),
    genre: genresArray,
    duration: row.duration,
  };
}

function mapRowToHero(row: MediaRow): HeroItem {
  const card = mapRowToCard(row);
  const durationMinutes = Number(row.duration ?? 0) || undefined;
  return {
    id: card.id,
    title: card.title,
    year: card.year,
    rating: card.rating,
    duration: minutesToDuration(durationMinutes),
    synopsis: String(row.synopsis ?? ""),
    image: card.image,
    age_rating: card.age_rating,
    genre: card.genre,
  };
}

export default function HomePage() {
  const [featuredContent, setFeaturedContent] = useState<HeroItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<CardItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<CardItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [mediaRes, watchRes] = await Promise.all([
          fetch("/api/media", { cache: "no-store" }),
          fetch(`/api/user/1/watch-history`, { cache: "no-store" }).catch(() => null),
        ]);

        if (!mediaRes.ok) throw new Error("Failed to load media");
        const mediaRows: MediaRow[] = await mediaRes.json();
        const cards = mediaRows.map(mapRowToCard).filter((c) => c.id);
        console.log(mediaRows)
        if (isMounted) {
          setTrendingMovies(cards);
          setFeaturedContent(mediaRows.slice(0, 3).map(mapRowToHero));
        }
        if (watchRes && watchRes.ok) {
          const watchRows: MediaRow[] = await watchRes.json();
          if (isMounted) setContinueWatching(watchRows.map(mapRowToCard));
        } else if (isMounted) {
          setContinueWatching([]);
        }
      } catch (e) {
        if (isMounted) {
          setFeaturedContent([]);
          setTrendingMovies([]);
          setContinueWatching([]);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 overflow-y-auto">
        {featuredContent.length > 0 && <HeroCarousel content={featuredContent} />}

        <div className="px-6 py-8 space-y-16">
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Continue Watching</h2>
            <HorizontalCarousel>
              {continueWatching.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Trending Now</h2>
            <HorizontalCarousel>
              {trendingMovies.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Recommended for You</h2>
            <HorizontalCarousel>
              {trendingMovies.slice(0, 8).map((item) => (
                <MediaCard key={`rec-${item.id}`} {...item} />
              ))}
            </HorizontalCarousel>
          </section>
        </div>
      </main>
    </div>
  );
}
