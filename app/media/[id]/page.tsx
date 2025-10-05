"use client";

import { useEffect, useState } from "react";
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

// Define your Media type
type Cast = { name: string; role: string; image: string };
type Trailer = { title: string; url: string; thumbnail: string };
type Media = {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
  duration: string;
  genre: string[];
  age_rating: string;
  synopsis: string;
  studio: string[];
  cast: Cast[];
  image: string;
  trailers: Trailer[];
  views: string;
  awards: string[];
  userRating: number;
  isLiked: boolean;
  isInWatchlist: boolean;
  progress: number;
};

export default function MediaPage({ params }: { params: { id: string } }) {
  const mediaId = Number(params.id);

  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        const res = await fetch(`/api/media/${mediaId}`);
        if (!res.ok) throw new Error("Failed to fetch media");
        const data: Media = await res.json();

        setMedia(data);
        setUserRating(data.userRating);
        setIsLiked(data.isLiked);
        setIsInWatchlist(data.isInWatchlist);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [mediaId]);

  const handleRating = (rating: number) => setUserRating(rating);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading media...</div>;
  }

  if (error || !media) {
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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-16">
        {/* Hero Section */}
        <div className="relative w-full">
          <div className="relative px-6 py-12 md:py-16 lg:py-24 flex flex-col md:flex-row gap-6 items-start">
            <img
              src={media.image || "/placeholder.svg"}
              alt={media.title}
              className="w-48 h-auto rounded-lg shadow-2xl flex-shrink-0"
            />

            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{media.title}</h1>
              </div>

              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>{new Date(media.releaseDate).getFullYear()}</span>
                <span>•</span>
                <span>{media.duration}</span>
                <span>•</span>
                <Badge variant="outline">{media.age_rating}</Badge>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{media.rating}/10</span>
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
                <Button size="lg" variant="gradient" className="px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </Button>
                <Button
                  variant="watchlist"
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                  className="group"
                  size="lg">
                  {isInWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  <span
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100
                                  bg-black text-white text-xs font-medium py-1 px-3 rounded-lg whitespace-nowrap
                                  pointer-events-none transition-all duration-200">
                    {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
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
                        <p className="text-muted-foreground">{new Date(media.releaseDate).toDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Director</p>
                        <p className="text-muted-foreground">{"Director"}</p>
                      </div>
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
                        <p className="text-muted-foreground">{media.views}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cast, Extras, Reviews sections same as before */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
