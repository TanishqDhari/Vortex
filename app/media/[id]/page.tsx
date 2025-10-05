"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for individual media
const mediaData = {
  1: {
    id: 1,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    userRating: 0,
    duration: "2h 32m",
    genre: ["Action", "Crime", "Drama"],
    ageRating: "PG-13",
    synopsis:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    director: "Christopher Nolan",
    studio: "Warner Bros.",
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne / Batman", image: "/placeholder.svg?height=100&width=100" },
      { name: "Heath Ledger", role: "Joker", image: "/placeholder.svg?height=100&width=100" },
      { name: "Aaron Eckhart", role: "Harvey Dent", image: "/placeholder.svg?height=100&width=100" },
      { name: "Michael Caine", role: "Alfred", image: "/placeholder.svg?height=100&width=100" },
    ],
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    backdrop: "https://images.hdqwalls.com/download/the-dark-knight-batman-4k-2018-movie-poster-4k-3840x2160.jpg",
    trailers: [
      { title: "Official Trailer", url: "#", thumbnail: "/placeholder.svg?height=200&width=300" },
      { title: "Behind the Scenes", url: "#", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    viewCount: "2.5M views",
    releaseDate: "July 18, 2008",
    awards: ["Academy Award Winner", "BAFTA Winner", "Golden Globe Nominee"],
    isLiked: false,
    isInWatchlist: false,
    progress: 0,
  },
}

export default function MediaPage({ params }: { params: { id: string } }) {
  const mediaId = Number.parseInt(params.id)
  const media = mediaData[mediaId as keyof typeof mediaData]

  const [userRating, setUserRating] = useState(media?.userRating || 0)
  const [isLiked, setIsLiked] = useState(media?.isLiked || false)
  const [isInWatchlist, setIsInWatchlist] = useState(media?.isInWatchlist || false)

  if (!media) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Media Not Found</h1>
            <p className="text-muted-foreground">The requested media could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-16">
        {/* Hero Section */}
        <div className="relative w-full">
          {/* Backdrop */}
          <div className="absolute inset-0 -z-10">
            <img
              src={media.backdrop || "/placeholder.svg"}
              alt={media.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

         {/* Hero content */}
          <div className="relative px-6 py-12 md:py-16 lg:py-24 flex flex-col md:flex-row gap-6 items-start">
            {/* Poster */}
            <img
              src={media.poster || "/placeholder.svg"}
              alt={media.title}
              className="w-48 h-auto rounded-lg shadow-2xl flex-shrink-0"
            />

            {/* Text & Buttons */}
            <div className="flex-1 space-y-4">
              {/* Optional SVG for title */}
              <div className="flex items-center space-x-3">
                {/* <img src="/path-to-title.svg" alt={media.title} className="h-12" /> */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{media.title}</h1>
              </div>

              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>{media.year}</span>
                <span>•</span>
                <span>{media.duration}</span>
                <span>•</span>
                <Badge variant="outline">{media.ageRating}</Badge>
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
                  size="lg"
                >
                  {isInWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100
                                  bg-black text-white text-xs font-medium py-1 px-3 rounded-lg whitespace-nowrap
                                  pointer-events-none transition-all duration-200">
                    {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
                  </span>
                </Button>
                <div className="relative group">
                <Button variant="normal" size="lg">
                  <Download className="h-5 w-5" />
                </Button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Download
                </span>
              </div>

              <div className="relative group">
                <Button variant="normal" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Share
                </span>
              </div>
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
                        <p className="text-muted-foreground">{media.releaseDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Director</p>
                        <p className="text-muted-foreground">{media.director}</p>
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
                    <div>
                      <p className="font-medium mb-2">Rate this movie</p>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className={cn(
                              "p-1 rounded transition-colors",
                              star <= userRating ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400",
                            )}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                        {userRating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">{userRating}/5 stars</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className={isLiked ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {isLiked ? "Liked" : "Like"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Dislike
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorite
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
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      <p>No reviews yet. Be the first to review this movie!</p>
                      <Button className="mt-4">Write a Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
