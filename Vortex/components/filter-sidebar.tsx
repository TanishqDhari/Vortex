"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"]
const years = ["2024", "2023", "2022", "2021", "2020"]
const ratings = ["9+", "8+", "7+", "6+"]

export function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Genre</h4>
            <div className="space-y-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox id={genre} />
                  <Label htmlFor={genre} className="text-sm">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-foreground mb-3">Release Year</h4>
            <div className="space-y-2">
              {years.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox id={year} />
                  <Label htmlFor={year} className="text-sm">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-foreground mb-3">Rating</h4>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={rating} />
                  <Label htmlFor={rating} className="text-sm">
                    {rating} and above
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button className="w-full">Apply Filters</Button>
          <Button variant="outline" className="w-full bg-transparent">
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}
