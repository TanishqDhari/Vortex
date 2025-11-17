"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Play, Plus, Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateWatchlistModal } from "./watchlist-modal";

interface Watchlist {
  watchlist_id: number;
  title: string;
}

interface HeroContent {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  age_rating: string;
  synopsis: string;
  image: string;
  cover: string;
  genre: string[];
}

interface HeroCarouselProps {
  content: HeroContent[];
}

/* ---------------- API HELPERS ---------------- */

async function fetchWatchlists(userId: number): Promise<Watchlist[]> {
  const res = await fetch(`/api/watchlist?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch watchlists");
  return res.json();
}

async function fetchMovieWatchlistStatus(movieId: number): Promise<number[]> {
  const res = await fetch(`/api/watchlist-media?media_id=${movieId}`);
  if (!res.ok) throw new Error("Failed to fetch movie watchlists");
  return res.json();
}

async function updateWatchlist(movieId: number, watchlistId: number, add: boolean) {
  const res = await fetch("/api/watchlist-media", {
    method: add ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ media_id: movieId, watchlist_id: watchlistId }),
  });
  if (!res.ok) throw new Error("Failed to update watchlist");
}

/* ---------------- COMPONENT ---------------- */

export function HeroCarousel({ content }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userId, setUserId] = useState<number | null>(null); // NEW
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [movieWatchlistMapping, setMovieWatchlistMapping] = useState<Record<number, number[]>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Load userId from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) setUserId(Number(stored));
  }, []);

  /* Load all watchlists for this user */
  const getWatchlists = useCallback(
    async (uid: number) => {
      try {
        const lists = await fetchWatchlists(uid);
        setWatchlists(lists);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  useEffect(() => {
    if (!userId) return;
    getWatchlists(userId);
  }, [userId, getWatchlists]);

  /* Load each movie's watchlist state */
  useEffect(() => {
    const movieId = content[currentIndex]?.id;
    if (!movieId) return;
    if (movieWatchlistMapping[movieId] !== undefined) return;

    const loadStatus = async () => {
      try {
        const status = await fetchMovieWatchlistStatus(movieId);
        setMovieWatchlistMapping((prev) => ({ ...prev, [movieId]: status }));
      } catch {
        setMovieWatchlistMapping((prev) => ({ ...prev, [movieId]: [] }));
      }
    };

    loadStatus();
  }, [currentIndex, content, movieWatchlistMapping]);

  /* Toggle in/out of watchlist */
  const toggleInWatchlist = async (movieId: number, wid: number, checked: boolean) => {
    const original = movieWatchlistMapping[movieId] || [];

    const updated = checked
      ? [...original, wid]
      : original.filter((x) => x !== wid);

    setMovieWatchlistMapping((prev) => ({ ...prev, [movieId]: updated }));

    try {
      await updateWatchlist(movieId, wid, checked);
    } catch (err) {
      console.error(err);
      setMovieWatchlistMapping((prev) => ({ ...prev, [movieId]: original }));
    }
  };

  const currentMovie = content[currentIndex];
  const movieId = currentMovie?.id;
  const inLists = movieWatchlistMapping[movieId] || [];
  const isInAny = inLists.length > 0;

  return (
    <>
      <CreateWatchlistModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => userId && getWatchlists(userId)}
      />

      <div className="relative h-screen overflow-hidden">
        <div
          className="flex transition-transform duration-[1200ms] ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {content.map((item) => (
            <div key={item.id} className="min-w-full h-full relative">
              {/* BACKGROUND */}
              <div className="absolute inset-0">
                <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl space-y-6">

                    {/* GENRES */}
                    <div className="flex items-center space-x-2">
                      {item.genre.map((g) => (
                        <Badge key={g} className="bg-secondary/40 text-sm">{g}</Badge>
                      ))}
                    </div>

                    {/* TITLE */}
                    <h1 className="text-5xl md:text-6xl font-bold">{item.title}</h1>

                    {/* META */}
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <span>{item.year}</span> <span>•</span>
                      <span>Rating {item.rating.toFixed(1)}</span> <span>•</span>
                      <span>{item.age_rating}</span> <span>•</span>
                      <span>{item.duration}</span>
                    </div>

                    {/* SYNOPSIS */}
                    <p className="text-lg text-muted-foreground max-w-xl">{item.synopsis}</p>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center space-x-4">
                      <Button
                        size="lg"
                        variant="gradient"
                        onClick={() => (window.location.href = `/media/${item.id}`)}
                        className="text-lg px-8"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Watch Now
                      </Button>

                      {/* WATCHLIST MENU */}
                      <DropdownMenu onOpenChange={(open) => userId && open && getWatchlists(userId)}>
                        <DropdownMenuTrigger asChild>
                          <Button size="lg" variant="normal" className="px-6">
                            {isInAny ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            Watchlist
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="max-h-none !overflow-visible">
                          <DropdownMenuLabel>Add to Watchlist</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {watchlists.map((w) => (
                            <DropdownMenuCheckboxItem
                              key={w.watchlist_id}
                              checked={inLists.includes(w.watchlist_id)}
                              onCheckedChange={(checked) =>
                                toggleInWatchlist(item.id, w.watchlist_id, Boolean(checked))
                              }
                              onSelect={(e) => e.preventDefault()}
                            >
                              {w.title}
                            </DropdownMenuCheckboxItem>
                          ))}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Watchlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* SLIDE INDICATORS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="backdrop-blur-lg bg-white/15 border border-white/20 rounded-full px-5 py-2 flex space-x-3 shadow-md">
            {content.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-500",
                  i === currentIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
