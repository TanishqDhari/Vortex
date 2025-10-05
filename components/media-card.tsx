  'use client';

  import { Button } from "@/components/ui/button";
  import { Info, Play, Plus } from "lucide-react";
  import { cn } from "@/lib/utils";
import Link from "next/link";

  interface MediaCardProps {
    id: number;
    title: string;
    year: number;
    image: string;
    certification?: string;
    duration?: string;
    description?: string;
  }

  export function MediaCard({
    id,
    title,
    year,
    image,
    certification = "U/A 16+",
    duration = "7 Seasons",
    description = "The city's most highly skilled medical team saves lives while navigating their unique interpersonal relationships.",
  }: MediaCardProps) {
    return (
      <>
        {/* The Static Base Card */}
        <div className="w-full aspect-[2/3] overflow-hidden rounded-md transition-opacity duration-300 lg:group-hover:opacity-0">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* The Popover Preview Card */}
        <Link href={`/media/${id}`}>
        <div
          className={cn(
            "popover",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[130%] z-20 transition-all duration-300",
            "opacity-0 scale-95 pointer-events-none",
            "lg:group-hover:opacity-100 lg:group-hover:scale-100 lg:group-hover:pointer-events-auto",
            "lg:transition-delay-200"
          )}
        >
          <div className="w-full h-full rounded-lg overflow-hidden shadow-xl bg-card">
            <div className="w-full h-[55%]">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover"/>
            </div>
            <div className="w-full h-[45%] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-8 flex-1 bg-white text-black hover:bg-white/90" 
                    onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    }}>
                    <Play className="mr-2 h-4 w-4 fill-black" />
                    Watch Now
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-neutral-700/80 hover:bg-neutral-600/80 border-0"
                   onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                  <span>{year}</span>
                  <span>{duration}</span>
                  <span>English</span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>
        </Link>
      </>
    );
  }