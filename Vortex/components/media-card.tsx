"use client";

import { Button } from "@/components/ui/button";
import { Play, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

  return (
    <div className="group relative w-full aspect-[2/3]">
      {/* Base Static Poster */}
      <div className="w-full h-full overflow-hidden rounded-md transition-opacity duration-300 lg:group-hover:opacity-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* HOVER POPUP */}
      <Link href={`/media/${id}`} className="absolute top-0 left-0 h-full w-full">
        <div
          className={cn(
            "popover",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[130%] aspect-[2/3] z-20 transition-all duration-300",
            "opacity-0 scale-95 pointer-events-none",
            "lg:group-hover:opacity-100 lg:group-hover:scale-100 lg:group-hover:pointer-events-auto",
            "lg:delay-200"
          )}
        >
          <div className="w-full h-full rounded-lg overflow-hidden shadow-xl bg-card">

            {/* TOP POSTER + TITLE */}
            <div className="relative w-full h-[55%]">
              <img
                src={cover || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white font-semibold text-lg leading-snug line-clamp-2">
                  {title}
                </p>
              </div>
            </div>

            {/* BOTTOM INFO */}
            <div className="w-full h-[45%] p-4 flex flex-col gap-2">
              <div className="space-y-2">
                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="gradient"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      window.location.href = `/media/${id}`;
                    }}
                  >
                    <Play className="mr-2 h-4 w-4 fill-black" />
                    Watch Now
                  </Button>

                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-neutral-700/80 hover:bg-neutral-600/80 border-0"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* META INFO: YEAR • DURATION • RATING */}
                <div className="flex items-center gap-3 text-sm text-neutral-400 mt-2">

                  <span>{year}</span>

                  {duration && <span>{duration}</span>}

                  {rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" fill="currentColor" stroke="none"/>
                      <span className="text-white">{rating}/10</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SYNOPSIS */}
              {synopsis && (
                <p className="text-sm text-neutral-300 leading-tight line-clamp-4">
                  {synopsis}
                </p>
              )}

            </div> 
          </div>
        </div>
      </Link>
    </div>
  );
}
