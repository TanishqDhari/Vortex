// In your new test page file: app/test/page.tsx

import { HorizontalCarousel } from '@/components/movie-carousel';
import { MediaCard } from '@/components/media-card'; // Assuming this is your card component

// Use the same mock data
const featuredContent = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Featured ${i + 1}`,
  year: 2024,
  rating: 8.0 + Math.random(),
  image: `/placeholder.svg?height=400&width=300&text=Movie+${i+1}`,
  genre: ["Featured"],
}));

export default function TestPage() {
  return (
    <div className="bg-background p-8">
      <h1 className="text-3xl font-bold mb-4">Carousel Test Page</h1>
      <HorizontalCarousel>
        {featuredContent.map((item) => (
          <MediaCard key={item.id} {...item} />
        ))}
      </HorizontalCarousel>
    </div>
  );
}