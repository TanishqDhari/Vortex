import type React from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface ContentSectionProps {
  title: string
  viewAllHref?: string
  children: React.ReactNode
}

export function ContentSection({ title, viewAllHref, children }: ContentSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {viewAllHref && (
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link href={viewAllHref}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      {children}
    </section>
  )
}
