'use client';

import { Sidebar } from "@/components/sidebar";
import { HeroCarousel } from "@/components/hero-carousel"; // Or HeroSection if you are using it
import { HorizontalCarousel } from "@/components/movie-carousel";
import { MediaCard } from "@/components/media-card";

// Define a consistent type for all our media content
interface Media {
  id: number;
  title: string;
  year: number;
  image: string;
  certification?: string;
  duration?: string;
  description?: string;
  genre?: string[];
  progress?: number;
  rating?: number;
  synopsis?: string;
}

type FeaturedMedia = Media & {
  rating: number;
  synopsis: string;
  duration: string;
  genre: string[];
};

// --- Mock Data ---
const featuredContent: FeaturedMedia[] = [
  {
    id: 1,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    image: "/dark-knight-poster.png",
    genre: ["Action", "Crime", "Drama"],
    certification: "U/A 13+",
  },
  {
    id: 102,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    duration: "2h 28m",
    synopsis: "A thief who steals corporate secrets through dream-sharing technology...",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    image: "/inception-movie-poster.png",
    genre: ["Action", "Sci-Fi", "Thriller"],
    certification: "U/A 13+",
  },
  {
    id: 103,
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    duration: "2h 49m",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival...",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    image: "/interstellar-movie-poster.jpg",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    certification: "U/A 13+",
  },
];

const trendingMovies: Media[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `Trending Movie ${i + 1}`,
  year: 2024,
  image: `/placeholder.svg?height=400&width=300&query=movie poster ${i + 1}`,
  genre: ["Action", "Drama"],
  description: `This is a compelling description for Trending Movie ${i + 1}.`,
}));

const continueWatching: Media[] = Array.from({ length: 6 }, (_, i) => ({
  id: 300 + i + 1,
  title: `Watched Series ${i + 1}`,
  year: 2023,
  image: `/placeholder.svg?height=400&width=300&query=tv series poster ${i + 1}`,
  genre: ["Drama", "Thriller"],
  progress: Math.floor(Math.random() * 80) + 10,
  description: `You were watching Series ${i+1}. Pick up where you left off!`,
}));
// --- End Mock Data ---


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      {/* --- THIS IS THE CRITICAL FIX --- */}
      {/* Change `overflow-hidden` to `overflow-y-auto` right here. */}
      <main className="flex-1 ml-16 overflow-y-auto">
        <HeroCarousel content={featuredContent} />

        <div className="px-6 py-8 space-y-16">
          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Continue Watching</h2>
            <HorizontalCarousel>
              {continueWatching.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Trending Now</h2>
            <HorizontalCarousel>
              {trendingMovies.map((item) => (
                <MediaCard key={item.id} {...item} />
              ))}
            </HorizontalCarousel>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-4">Recommended for You</h2>
            <HorizontalCarousel>
              {trendingMovies.slice(0, 8).map((item) => (
                <MediaCard key={`rec-${item.id}`} {...item} />
              ))}
            </HorizontalCarousel>
          </section>
        </div>
      </main>
    </div>
  );
}