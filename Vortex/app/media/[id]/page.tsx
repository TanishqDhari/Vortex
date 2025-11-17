"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
Play,
Plus,
ThumbsUp,
ThumbsDown,
Star,
StarHalf,
Clock,
Calendar,
Users,
Award,
Download,
Share2,
Heart,
Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoPlayerOverlay } from "@/components/videoplayer/VideoPlayerOverlay";
import ReviewSection from "@/components/review-section";

interface Watchlist {
  watchlist_id: number;
  title: string;
}

type MediaData = {
id: number;
videoId?: string;
title: string;
year: number;
rating: number;
userRating: number;
duration: string;
genre: string[];
ageRating: string;
synopsis: string;
directors: string[];
studio: string;
cast: { name: string; role: string; image: string }[];
poster: string;
backdrop: string;
trailers: { title: string; url: string; thumbnail: string }[];
viewCount: string;
releaseDate: string;
awards: string[];
isLiked: boolean;
isInWatchlist: boolean;
progress: number;
};

export default function MediaPage({ params }: { params: Promise<{ id: string }> }) {
const resolvedParams = React.use(params);
const mediaId = Number.parseInt(resolvedParams.id);
const [media, setMedia] = useState<MediaData | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [userRating, setUserRating] = useState(0);
const [hoverRating, setHoverRating] = useState<number | null>(null);
const [reaction, setReaction] = useState<"liked" | "disliked" | null>(null);
const [isInWatchlist, setIsInWatchlist] = useState(false);
const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
const [inWatchlists, setInWatchlists] = useState<number[]>([]);
const [WLloaded, setWLLoaded] = useState(false);
const [isWLModalOpen, setWLModalOpen] = useState(false);
const [showOverlay, setShowOverlay] = useState(false);
const [userId, setUserId] = useState<number | null>(null);
const isLiked = reaction === "liked";
const isDisliked = reaction === "disliked";

useEffect(() => {
const storedUserId = localStorage.getItem("userId");
if (!storedUserId) {
  window.location.href = "/login";
  return;
}
setUserId(parseInt(storedUserId, 10));
}, []);

useEffect(() => {
  if (!userId || !mediaId) return;
  async function loadUserReview() {
    try {
      const res = await fetch(`/api/review?media_id=${mediaId}`);
      if (!res.ok) return;
      const reviews = await res.json();
      const my = reviews.find((r: any) => r.user_id === userId);
      if (my) {
        setUserRating(my.rating ?? 0);
        if (my.review_type === "liked") setReaction("liked");
        else if (my.review_type === "disliked") setReaction("disliked");
        else setReaction(null);
      }
    } catch (err) {
      console.error("Failed to load user review:", err);
    }
  }
  loadUserReview();
}, [userId, mediaId]);

async function addToWatchlist(mediaId: number, watchlistId: number) {
  return fetch("/api/watchlist-media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ media_id: mediaId, watchlist_id: watchlistId }),
  });
}

async function removeFromWatchlist(mediaId: number, watchlistId: number) {
  return fetch("/api/watchlist-media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ media_id: mediaId, watchlist_id: watchlistId }),
  });
}

async function fetchWatchlists(): Promise<{ watchlist_id: number; title: string; }[]> {
  const res = await fetch("/api/watchlist");
  if (!res.ok) throw new Error("Failed to load watchlists");
  return res.json();
}

async function fetchWatchlistStatus(mediaId: number): Promise<number[]> {
  const res = await fetch(`/api/watchlist-media?media_id=${mediaId}`);
  if (!res.ok) throw new Error("Failed to load watchlist status");
  return res.json();
}

async function updateWatchlist(mediaId: number, watchlistId: number, add: boolean) {
  const res = await fetch("/api/watchlist-media", {
    method: add ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ media_id: mediaId, watchlist_id: watchlistId }),
  });
  if (!res.ok) throw new Error("Failed to update watchlist");
}


useEffect(() => {
async function fetchMediaData() {
  try {
    setLoading(true);
    const res = await fetch(`/api/media/${mediaId}`);
    if (!res.ok) throw new Error("Media not found");
    const data = await res.json();
    console.log(data);

    if (!data || data.length === 0) throw new Error("Media not found");

    const m = data[0];

    const formatDuration = (time: string | null) => {
      if (!time) return "N/A";
      const [h, m] = time.split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return "N/A";
      return `${h}h ${m}m`;
    };

    const cast = typeof m.cast === "string" ? JSON.parse(m.cast) : m.cast || [];
    const directors = typeof m.directors === "string" ? JSON.parse(m.directors) : m.directors || [];
    const studios = typeof m.studios === "string" ? JSON.parse(m.studios) : m.studios || [];
    const genres = typeof m.genres === "string" ? JSON.parse(m.genres) : m.genres || [];

    const transformedMedia: MediaData = {
      id: m.media_id,
      title: m.title || "Untitled",
      year: m.release_date ? new Date(m.release_date).getFullYear() : 0,
      rating: m.rating !== null && m.rating !== undefined ? parseFloat(Number(m.rating).toFixed(2)) : 0,
      userRating: 0,
      duration: formatDuration(m.duration),
      genre: genres.map((g: any) => g.title),
      ageRating: m.age_rating || "PG-13",
      synopsis: m.synopsis || "No synopsis available",
      directors: directors.map((d: any) => d.name),
      studio: studios,
      cast: cast,
      poster: m.image || "/placeholder.svg",
      backdrop: m.cover || "/placeholder.svg",
      trailers: [],
      viewCount: `${m.views || 0} views`,
      releaseDate: m.release_date ? String(new Date(m.release_date).getFullYear()) : "0",
      awards: [],
      isLiked: false,
      isInWatchlist: false,
      progress: 0,
    };

  setMedia(transformedMedia);
  try {
    const status = await fetchWatchlistStatus(transformedMedia.id);
    setIsInWatchlist(status.length > 0);
    setInWatchlists(status);
  } catch {
    setInWatchlists([]);
    setIsInWatchlist(false);
  }
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}

fetchMediaData();
}, [mediaId]);

if (loading) {
return (
  <div className="min-h-screen bg-background flex">
    <Sidebar />
    <div className="flex-1 ml-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Loading...</h1>
        <p className="text-muted-foreground">Please wait while we load the media details.</p>
      </div>
    </div>
  </div>
);
}

if (error || !media) {
console.log(error);
return (
  <div className="min-h-screen bg-background flex">
    <Sidebar />
    <div className="flex-1 ml-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Media Not Found</h1>
        <p className="text-muted-foreground">{error || "The requested media could not be found."}</p>
      </div>
    </div>
  </div>
);
}

async function toggleLike() {
  if (!userId) return;
  const newType = reaction === "liked" ? null : "liked";
  setReaction(newType);
  await fetch("/api/review", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      media_id: mediaId,
      review_type: newType
    }),
  });
}

async function toggleDislike() {
  if (!userId) return;
  const newType = reaction === "disliked" ? null : "disliked";
  setReaction(newType);
  await fetch("/api/review", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      media_id: mediaId,
      review_type: newType
    }),
  });
}

async function userHasReview() {
  const res = await fetch(`/api/review?media_id=${mediaId}`);
  if (!res.ok) return false;
  const reviews = await res.json();
  return reviews.some((r: any) => r.user_id === userId);
}

async function saveRating(value: number) {
  if (!userId) return;
  const exists = await userHasReview();
  const body = {
    user_id: userId,
    media_id: mediaId,
    rating: value,
    review_desc: null,
    review_type: null,
  };
  const res = await fetch("/api/review", {
    method: exists ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("Rating error:", await res.text());
  }
  setUserRating(value);
  setHoverRating(null);
}

return (
<div className="min-h-screen bg-background">
  <Sidebar />
  <div className="ml-16">
    <div className="relative h-[70vh] overflow-hidden">
      <img src={media.backdrop || "/placeholder.svg"} alt={media.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 via-40% to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={media.poster || "/placeholder.svg"}
              alt={media.title}
              className="w-48 h-72 object-cover rounded-lg shadow-2xl"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{media.title}</h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <span>{media.year}</span>
                  <span>•</span>
                  <span>{media.duration}</span>
                  <span>•</span>
                  <Badge variant="secondary">{media.ageRating}</Badge>
                  <span>•</span>
                  <div className="flex items-center">
                    <Star size={18} className="text-yellow-400" fill="currentColor" stroke="none"/>
                    <span>{media.rating}/10</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {media.genre.map((g) => (
                  <Badge key={g} variant="secondary">
                    {g}
                  </Badge>
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed max-w-2xl">{media.synopsis}</p>
              <div className="flex items-center space-x-4">
                <Button size="lg" variant="gradient" onClick={() => setShowOverlay(true)}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </Button>
                {/* WATCHLIST DROPDOWN BUTTON */}
<DropdownMenu
  onOpenChange={async (open) => {
    if (open) {
      try {
        const lists = await fetchWatchlists();
        setWatchlists(lists);
        const status = await fetchWatchlistStatus(media.id);
        setInWatchlists(status);
      } catch (err) {
        console.error(err);
      }
    }
  }}
>
  <DropdownMenuTrigger asChild>
    <Button
      size="lg"
      variant="watchlist"
      className={`
        px-6
        ${inWatchlists.length > 0
          ? "text-white border-green-600"
          : "border-white/20 text-white hover:bg-white/10"
        }
      `}
    >
      {inWatchlists.length > 0 ? (
        <Check className="mr-2 h-5 w-5" />
      ) : (
        <Plus className="mr-2 h-5 w-5" />
      )}

      {inWatchlists.length > 0 ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="max-h-none !overflow-visible">
    <DropdownMenuLabel>Select Watchlists</DropdownMenuLabel>
    <DropdownMenuSeparator />

    {watchlists.map((wl) => (
      <DropdownMenuCheckboxItem
        key={wl.watchlist_id}
        checked={inWatchlists.includes(wl.watchlist_id)}
        onCheckedChange={async (checked) => {
          try {
            if (checked) {
              await addToWatchlist(media.id, wl.watchlist_id);
              setInWatchlists((prev) => [...prev, wl.watchlist_id]);
            } else {
              await removeFromWatchlist(media.id, wl.watchlist_id);
              setInWatchlists((prev) =>
                prev.filter((id) => id !== wl.watchlist_id)
              );
            }
          } catch (e) {
            console.error("Watchlist update failed:", e);
          }
        }}
        onSelect={(e) => e.preventDefault()}
      >
        {wl.title}
      </DropdownMenuCheckboxItem>
    ))}

    <DropdownMenuSeparator />

    <DropdownMenuItem onSelect={() => setWLModalOpen(true)}>
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
    </div>

    {/* Content Tabs*/}
    <div className="p-8">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Movie Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Release Date</p>
                    <p className="text-muted-foreground">{media.releaseDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  {media.directors.map((a, idx) => (
                    <div key={idx}>
                      <p className="font-medium">Director</p>
                      <p className="text-muted-foreground">{a}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Studio</p>
                    <p className="text-muted-foreground">{media.studio}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Views</p>
                    <p className="text-muted-foreground">{media.viewCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Rating & Interaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="flex items-center space-x-1 select-none"
                  onMouseLeave={() => setHoverRating(null)}
                >
                  {[1, 2, 3, 4, 5].map((i) => {
                    const full = i * 2;
                    const half = full - 1;

                    const active = hoverRating ?? userRating;

                    const isFull = active >= full;
                    const isHalf = active === half;

                    return (
                      <div key={i} className="relative w-7 h-7 cursor-pointer">

                        {/* Left half */}
                        <div
                          className="absolute inset-y-0 left-0 w-1/2 z-20"
                          onMouseEnter={() => setHoverRating(half)}
                          onClick={() => saveRating(half)}
                        />

                        {/* Right half */}
                        <div
                          className="absolute inset-y-0 right-0 w-1/2 z-20"
                          onMouseEnter={() => setHoverRating(full)}
                          onClick={() => saveRating(full)}
                        />

                        {/* BASE gray star */}
                        <Star
                          className="w-7 h-7 stroke-none pointer-events-none"
                          fill="#838385ff"
                        />

                        {/* FULL star overlay */}
                        {isFull && (
                          <Star
                            className="absolute inset-0 w-7 h-7 stroke-none pointer-events-none"
                            fill="#facc15"
                          />
                        )}

                        {/* HALF star overlay */}
                        {isHalf && (
                          <div className="absolute inset-0 w-1/2 overflow-hidden pointer-events-none">
                            <Star
                              className="w-7 h-7 stroke-none"
                              fill="#facc15"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <span className="ml-2 text-sm text-muted-foreground">{userRating}/10</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLike}
                    className={`
                      ${isLiked
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "text-white border-white/20"
                      }
                      ${isLiked
                        ? "hover:bg-green-500/20 hover:text-green-400"
                        : "hover:bg-green-500/20 hover:text-green-400"
                      }
                    `}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDislike}
                    className={`
                      ${isDisliked
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "text-white border-white/20"
                      }
                      ${isDisliked
                        ? "hover:bg-red-500/20 hover:text-red-400"
                        : "hover:bg-red-500/20 hover:text-red-400"
                      }
                    `}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    {isDisliked ? "Disliked" : "Dislike"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Awards & Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {media.awards.map((award, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    <Award className="w-3 h-3 mr-1" />
                    {award}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {media.cast.map((actor, index) => (
                  <div key={index} className="text-center space-y-2">
                    <img
                      src={actor.image || "/placeholder.svg"}
                      alt={actor.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{actor.name}</p>
                      <p className="text-sm text-muted-foreground">{actor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="extras" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trailers & Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {media.trailers.map((trailer, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={trailer.thumbnail || "/placeholder.svg"}
                        alt={trailer.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="lg" className="rounded-full w-16 h-16">
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-medium text-center">{trailer.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Reviews</CardTitle>
            </CardHeader>

            <CardContent>
              <ReviewSection mediaId={media.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>

  {showOverlay && media.id && (
    <VideoPlayerOverlay videoId={String(media.id)} onClose={() => setShowOverlay(false)} />
  )}
</div>
);
}