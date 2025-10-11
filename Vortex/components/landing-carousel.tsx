"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type MediaItem = {
  id: number;
  title: string;
  image: string;
};

type CarouselSpacingProps = {
  media: MediaItem[];
};

export function CarouselSpacing({ media }: CarouselSpacingProps) {
  if (!media || media.length === 0) return null;

  return (
    <div className="relative group">
      <Carousel className="w-full">
        <CarouselContent className="flex gap-6 px-2">
          {media.map((item) => (
            <CarouselItem key={item.id} className="flex-none w-48 sm:w-52 md:w-56 lg:w-60">
              <Card className="overflow-hidden rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative w-full h-72">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-3 text-center">
                  <p className="text-sm sm:text-base font-semibold text-white truncate">{item.title}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrow Buttons */}
        <CarouselPrevious
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-opacity"
        />
        <CarouselNext
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-opacity"
        />
      </Carousel>
    </div>
  );
}
