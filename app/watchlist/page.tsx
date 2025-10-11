"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

type MediaItem = {
  id: number;
  title: string;
  year?: number;
  rating?: number;
  image: string;
  genre: string[];
  type?: "movie" | "tv";
  duration?: number;
};

type Watchlist = {
  id: number;
  name: string;
  desc: string;
  visibility: boolean;
  media: MediaItem[];
};

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("added");

  useEffect(() => {
    async function fetchWatchlists() {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          console.log("No userId found in localStorage. Redirecting to login.");
          window.location.href = "/login";
          return;
        }
        const userId = parseInt(storedUserId, 10);
        if (isNaN(userId) || userId <= 0) {
          console.log("Invalid userId in localStorage. Redirecting to login.");
          window.location.href = "/login";
          return;
        }
        const res = await fetch(`/api/user/${userId}/watchlist`);
        if (!res.ok) throw new Error("Failed to load watchlists");
        const data = await res.json();
        console.log(data);
        setWatchlists(data);
      } catch (err) {
        console.error(err);
        setWatchlists([]);
      }
    }
    fetchWatchlists();
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-16">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold flex items-center mb-1">
              <Bookmark className="w-8 h-8 mr-3" />
              My Watchlists
            </h1>
            <p className="text-muted-foreground mb-4">
              {watchlists.length} total lists
            </p>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative h-10">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
                <Input
                  placeholder="Search lists or titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-full text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Type */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Type</span>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="movie">Movies</SelectItem>
                      <SelectItem value="tv">TV Shows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Genre */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Genre</span>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      <SelectItem value="Action">Action</SelectItem>
                      <SelectItem value="Comedy">Comedy</SelectItem>
                      <SelectItem value="Drama">Drama</SelectItem>
                      <SelectItem value="Thriller">Thriller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Sort by</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Date Added" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="added">Date Added</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlists */}
        <div className="p-6 space-y-8">
          {watchlists.map((list) => {
            const filteredMedia = list.media.filter((item) => {
              const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesType =
                selectedType === "all" || item.type === selectedType;
              const matchesGenre =
                selectedGenre === "all" || item.genre.includes(selectedGenre);
              return matchesSearch && matchesType && matchesGenre;
            });

            if (filteredMedia.length === 0) return null;

            return (
              <Card key={list.id} className="p-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl flex justify-between items-center">
                    <div>
                      {list.name}
                      <p className="text-sm text-muted-foreground">
                        {list.desc || "No description"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {list.visibility ? "Public" : "Private"}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMedia.map((item) => (
                <MediaCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  year={item.year ?? 0} // fallback if year is undefined
                  image={item.image}
                  rating={item.rating}
                  duration={item.duration !== undefined ? String(item.duration) : undefined}         // optional
                  genre={item.genre}
                />
              ))}

                  </div>
                </CardContent>
              </Card>
            );
          })}

          {watchlists.length === 0 && (
            <p className="text-muted-foreground text-center mt-20">
              You have no watchlists yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
