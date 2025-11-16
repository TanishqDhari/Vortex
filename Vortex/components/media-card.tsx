"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuCheckboxItem,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Plus, Check, Star, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CreateWatchlistModal } from "./watchlist-modal";

interface Watchlist {
watchlist_id: number;
title: string;
}

interface MediaCardProps {
id: number;
title: string;
year: number;
image: string;
cover: string;
rating?: number;
duration?: string;
synopsis?: string;
}

// API Helpers
async function fetchWatchlists(): Promise<Watchlist[]> {
const res = await fetch("/api/watchlist");
if (!res.ok) throw new Error("Failed to fetch watchlists");
return res.json();
}

async function fetchMovieWatchlistStatus(movieId: number): Promise<number[]> {
const res = await fetch(`/api/media/${movieId}/watchlists`);
if (!res.ok) throw new Error("Failed to fetch movie watchlist status");
return res.json();
}

async function updateWatchlist(movieId: number, watchlistId: number, add: boolean) {
const res = await fetch("/api/watchlist-media", {
  method: add ? "POST" : "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ media_id: movieId, watchlist_id: watchlistId }),
});
if (!res.ok) throw new Error("Watchlist update failed");
}

export function MediaCard({
id,
title,
year,
image,
cover,
rating,
duration,
synopsis,
}: MediaCardProps) {

const [hovered, setHovered] = useState(false);
const [loaded, setLoaded] = useState(false);
const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
const [inWatchlists, setInWatchlists] = useState<number[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const isInAny = inWatchlists.length > 0;

useEffect(() => {
(async () => {
  try {
    const status = await fetchMovieWatchlistStatus(id);
    setInWatchlists(status);
  } catch (err) {
    console.error("Failed to prefetch watchlist status:", err);
  }
})();
}, [id]);

const loadDropdown = async () => {
  if (loaded) return;
  try {
    const [lists, status] = await Promise.all([
      fetchWatchlists(),
      fetchMovieWatchlistStatus(id),
    ]);
    setWatchlists(lists);
    setInWatchlists(status);
    setLoaded(true);
  } catch (err) {
    console.error(err);
  }
};

const toggleWatchlist = async (wid: number, checked: boolean) => {
  const old = [...inWatchlists];
  const updated = checked
    ? [...old, wid]
    : old.filter((id) => id !== wid);

  setInWatchlists(updated);

  try {
    await updateWatchlist(id, wid, checked);
  } catch (err) {
    console.error(err);
    setInWatchlists(old);
  }
};

const refreshLists = async () => {
  const data = await fetchWatchlists();
  setWatchlists(data);
};

return (
  <>
    <CreateWatchlistModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onCreated={refreshLists}
    />
    <div
      className="relative w-full aspect-[2/3]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* Static Poster */}
      <div className={cn(
        "w-full h-full overflow-hidden rounded-md transition-opacity duration-300",
        hovered ? "opacity-0" : "opacity-100"
      )}>
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Popover */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[130%] aspect-[2/3] z-30 transition-all duration-300",
          hovered
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="w-full h-full rounded-lg overflow-hidden shadow-xl bg-card">

          {/* Top Cover */}
          <div className="relative w-full h-[55%] overflow-hidden">
            <img src={cover || image} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-white font-semibold text-lg line-clamp-2">
                {title}
              </p>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="w-full h-[45%] p-4 flex flex-col gap-3">

            {/* Buttons */}
            <div className="flex items-center gap-2">

              {/* WATCH NOW */}
              <Button
                size="sm"
                variant="gradient"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/media/${id}`;
                }}
              >
                <Play className="mr-2 h-4 w-4" /> Watch Now
              </Button>

              {/* WATCHLIST DROPDOWN */}
              <DropdownMenu onOpenChange={(o) => o && loadDropdown()}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-neutral-700/80 hover:bg-neutral-600/80 border-0"
                  >
                    {isInAny ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="max-h-none !overflow-visible"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuLabel>Add to Watchlist</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {watchlists.map((wl) => (
                    <DropdownMenuCheckboxItem
                      key={wl.watchlist_id}
                      checked={inWatchlists.includes(wl.watchlist_id)}
                      onCheckedChange={(checked) =>
                        toggleWatchlist(wl.watchlist_id, Boolean(checked))
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {wl.title}
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

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <span>{year}</span>
              {duration && <span>{duration}</span>}
              {rating !== undefined && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="text-white">{rating}/10</span>
                </span>
              )}
            </div>

            {/* Synopsis */}
            {synopsis && (
              <p className="text-sm text-neutral-300 line-clamp-4">
                {synopsis}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Clickable Poster */}
    </div>
  </>
);
}
