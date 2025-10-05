'use client'

import { Sidebar } from "@/components/sidebar"
import { HeroCarousel } from "@/components/hero-carousel"
import { HorizontalCarousel } from "@/components/movie-carousel"
import { MediaCard } from "@/components/media-card"

// Mock data (your existing arrays)
const featuredContent = [
  {
    id: 1,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
    image: "/dark-knight-poster.png",
    genre: ["Action", "Crime", "Drama"],
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    duration: "2h 28m",
    synopsis: "A thief who steals corporate secrets through dream-sharing technology...",
    image: "/inception-movie-poster.png",
    genre: ["Action", "Sci-Fi", "Thriller"],
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    duration: "2h 49m",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival...",
    image: "/interstellar-movie-poster.jpg",
    genre: ["Adventure", "Drama", "Sci-Fi"],
  },
]

const trendingMovies = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Movie ${i + 1}`,
  year: 2024,
  rating: 8.5 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=movie poster ${i + 1}`,
  genre: ["Action", "Drama"],
}))

const continueWatching = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Series ${i + 1}`,
  year: 2024,
  rating: 8.0 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&query=tv series poster ${i + 1}`,
  genre: ["Drama", "Thriller"],
  progress: Math.floor(Math.random() * 100),
}))

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-16 overflow-hidden">
        {/* Hero Carousel */}
        <HeroCarousel content={featuredContent} />

        {/* Content Sections */}
        <div className="px-6 py-8 space-y-12">
          {/* Continue Watching */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Continue Watching</h2>
            <HorizontalCarousel>
              {continueWatching.map((item) => (
                <MediaCard key={item.id} {...item} showProgress />
              ))}
            </HorizontalCarousel>
          </section>

          {/* Trending Now */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Trending Now</h2>
            <HorizontalCarousel>
              {trendingMovies.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          {/* Recommended For You */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Recommended for You</h2>
            <HorizontalCarousel>
              {trendingMovies.slice(0, 8).map((item) => (
                <MediaCard key={`rec-${item.id}`} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          {/* Popular Movies */}
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Popular Movies</h2>
            <HorizontalCarousel>
              {trendingMovies.slice(2, 10).map((item) => (
                <MediaCard key={`pop-${item.id}`} {...item} />
              ))}
            </HorizontalCarousel>
          </section>
        </div>
      </main>
    </div>
  )
}
