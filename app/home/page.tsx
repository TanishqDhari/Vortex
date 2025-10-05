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
  duration: string;
  synopsis: string;
  image: string;
  genre: string[];
};

type CardItem = {
  id: number;
  title: string;
  year: number;
  rating: number;
  image: string;
  genre: string[] | string;
  progress?: number;
};

function minutesToDuration(minutes?: number | null): string {
  if (!minutes || Number.isNaN(minutes)) return "";
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
}

function parseGenres(value: unknown): string[] | string {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") return value.includes(",") ? value.split(",").map((g) => g.trim()) : value;
  return [];
}

function mapRowToCard(row: MediaRow): CardItem {
  return {
    id: Number(row.media_id ?? row.id ?? 0),
    title: String(row.title ?? row.name ?? "Untitled"),
    year: Number(row.release_year ?? row.year ?? 0),
    rating: Number(row.rating ?? row.score ?? 0) || 0,
    image: String(row.poster_url ?? row.image ?? "/placeholder.svg"),
    genre: parseGenres(row.genre ?? row.genres ?? []),
  };
}

function mapRowToHero(row: MediaRow): HeroItem {
  const card = mapRowToCard(row);
  const durationMinutes = Number(row.duration_minutes ?? row.duration ?? 0) || undefined;
  return {
    id: card.id,
    title: card.title,
    year: card.year,
    rating: card.rating,
    duration: minutesToDuration(durationMinutes),
    synopsis: String(row.media_desc ?? row.synopsis ?? ""),
    image: card.image,
    genre: Array.isArray(card.genre) ? card.genre : card.genre ? [card.genre] : [],
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
          // Replace `1` with the actual authenticated user id when available
          fetch(`/api/user/1/watch-history`, { cache: "no-store" }).catch(() => null),
        ]);

        if (!mediaRes.ok) throw new Error("Failed to load media");
        const mediaRows: MediaRow[] = await mediaRes.json();

        // Trending/Popular/Recommended all derive from media for now
        const cards = mediaRows.map(mapRowToCard).filter((c) => c.id);

        if (isMounted) {
          setTrendingMovies(cards);
          // Use top 3 as featured
          setFeaturedContent(mediaRows.slice(0, 3).map(mapRowToHero));
        }

        if (watchRes && watchRes.ok) {
          const watchRows: MediaRow[] = await watchRes.json();
          if (isMounted) setContinueWatching(watchRows.map(mapRowToCard));
        } else if (isMounted) {
          setContinueWatching([]);
        }
      } catch (e) {
        // Swallow errors for now; UI will render empty sections
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-16 overflow-hidden">
        {/* Hero Carousel */}
        {featuredContent.length > 0 && <HeroCarousel content={featuredContent} />}

        {/* Content Sections */}
        <div className="px-6 py-8 space-y-12">
          {/* Continue Watching */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Continue Watching</h2>
            <HorizontalCarousel>
              {continueWatching.map((item) => (
                <MediaCard key={item.id} {...item} showProgress />
              ))}
            </HorizontalCarousel>
          </section>

          {/* Trending Now */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Trending Now</h2>
            <HorizontalCarousel>
              {trendingMovies.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          {/* Recommended For You */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Recommended for You</h2>
            <HorizontalCarousel>
              {trendingMovies.slice(0, 8).map((item) => (
                <MediaCard key={`rec-${item.id}`} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          {/* Popular Movies */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Popular Movies</h2>
            <HorizontalCarousel>
              {trendingMovies.slice(2, 10).map((item) => (
                <MediaCard key={`pop-${item.id}`} {...item} />
              ))}
            </HorizontalCarousel>
          </section>
        </div>
      </main>
    </div>
  );
}
