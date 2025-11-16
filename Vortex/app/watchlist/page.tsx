"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { HorizontalCarousel } from "@/components/movie-carousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Bookmark, Plus } from "lucide-react";

type MediaItem = {
  id: number;
  title: string;
  image: string;
  year?: number;
  rating?: number;
  genre?: string[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWatchlist, setNewWatchlist] = useState({
    title: "",
    desc: "",
    visibility: "public",
  });

  useEffect(() => {
    async function fetchWatchlists() {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          window.location.href = "/login";
          return;
        }
        const userId = parseInt(storedUserId, 10);
        console.log(userId);
        const res = await fetch(`/api/user/${userId}/watchlist`);
        if (!res.ok) throw new Error("Failed to load watchlists");
        const data = await res.json();
        setWatchlists(data);
      } catch (err) {
        console.error("Error loading watchlists:", err);
        setWatchlists([]);
      }
    }
    fetchWatchlists();
  }, []);

  const handleCreateWatchlist = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;
      const userId = parseInt(storedUserId, 10);

      const res = await fetch(`/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          created_by: userId,
          title: newWatchlist.title,
          watchlist_desc: newWatchlist.desc,
          visibility: newWatchlist.visibility === "public" ? 1 : 0,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Backend error:", errText);
        throw new Error("Failed to create watchlist");
      }

      const created = await res.json();

      const newList: Watchlist = {
        id: created.insertId || Date.now(),
        name: newWatchlist.title,
        desc: newWatchlist.desc,
        visibility: newWatchlist.visibility === "public",
        media: [],
      };

      setWatchlists((prev) => [...prev, newList]);
      setIsModalOpen(false);
      setNewWatchlist({ title: "", desc: "", visibility: "public" });
    } catch (err) {
      console.error("Create watchlist error:", err);
    }
  };

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

            {/* Search */}
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
            </div>
          </div>
        </div>

        {/* Create Watchlist Button */}
        <div className="flex justify-start px-6 mt-6">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="flex items-center bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Create List
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Watchlist</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="flex flex-col">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newWatchlist.title}
                    onChange={(e) =>
                      setNewWatchlist((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    id="desc"
                    value={newWatchlist.desc}
                    onChange={(e) =>
                      setNewWatchlist((prev) => ({
                        ...prev,
                        desc: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={newWatchlist.visibility}
                    onValueChange={(value) =>
                      setNewWatchlist((prev) => ({
                        ...prev,
                        visibility: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateWatchlist}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Watchlists */}
        <div className="p-6 space-y-10">
          {watchlists.map((list) => (
            <Card key={list.id} className="p-4 bg-black/20">
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

              <HorizontalCarousel>
                {(list.media.length > 0
                  ? list.media
                  : [
                      {
                        id: 1,
                        title: "Sample Movie",
                        image: "/placeholder.svg",
                        year: 2025,
                      },
                    ]
                ).map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    year={item.year ?? 0}
                    duration={item.duration ? String(item.duration) : "2h"}
                    genre={item.genre}
                  />
                ))}
              </HorizontalCarousel>
            </Card>
          ))}

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
