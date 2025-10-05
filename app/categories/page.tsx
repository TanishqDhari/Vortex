"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { HorizontalCarousel } from "@/components/movie-carousel";

type Genre = {
  genre_id: number;
  title: string;
  description?: string;
  media_count?: number;
};

type Media = {
  id: number;
  title: string;
  year: number;
  rating: number;
  duration: string;
  synopsis: string;
  image: string;
  genre: string[];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Genre[]>([]);
  const [featuredContent, setFeaturedContent] = useState<Media[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreRes, mediaRes] = await Promise.all([fetch("/api/genre"), fetch("/api/media")]);

        const genresData = await genreRes.json();
        const mediaData = await mediaRes.json();

        setCategories(genresData);
        setFeaturedContent(mediaData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-16 min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">Discover content by genre and category</p>
          </div>
        </div>

        <div className="p-6">
          {!selectedCategory ? (
            <div className="space-y-8">
              {/* Category Grid */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Genre</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Card
                      key={category.genre_id}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200 bg-card/40"
                      onClick={() => setSelectedCategory(category.title)}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description || "Explore this genre"}
                        </p>
                        {category.media_count !== undefined && (
                          <Badge variant="secondary">{category.media_count} titles</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Featured This Week */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Featured This Week</h2>
                <HorizontalCarousel>
                  {featuredContent.map((item) => (
                    <MediaCard key={item.id} {...item} />
                  ))}
                </HorizontalCarousel>
              </div>
            </div>
          ) : (
            /* Category Detail View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{selectedCategory}</h2>
                  <p className="text-muted-foreground">
                    {categories.find((c) => c.title === selectedCategory)?.description}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Back to Categories
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {featuredContent
                  .filter((m) => m.genre.includes(selectedCategory!))
                  .map((item) => (
                    <MediaCard key={item.id} {...item} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
