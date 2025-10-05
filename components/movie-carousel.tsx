'use client';

import { useRef, useState, ReactNode, useEffect, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HorizontalCarouselProps {
  children: ReactNode[];
  className?: string;
}

export function HorizontalCarousel({ children, className }: HorizontalCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const checkScrollability = () => {
    const node = carouselRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    checkScrollability();
    node.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);
    return () => {
      node.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.9 : clientWidth * 0.9;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const node = carouselRef.current;
    if (!node) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - node.offsetLeft;
    scrollLeftStartRef.current = node.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftStartRef.current - walk;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className={cn('relative group/carousel', className)}>
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={cn(
          'flex overflow-x-auto overflow-y-visible scroll-smooth hide-scrollbar',
          'cursor-grab active:cursor-grabbing select-none',
          'gap-3 sm:gap-4',
          'py-12 px-4 sm:px-8'
        )}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              'group relative flex-shrink-0 w-40 sm:w-44 md:w-48 lg:w-52',
              'lg:first:[&_.popover]:left-0 lg:first:[&_.popover]:-translate-x-0',
              'lg:last:[&_.popover]:right-0 lg:last:[&_.popover]:left-auto lg:last:[&_.popover]:-translate-x-0'
            )}
          >
            {child}
          </div>
        ))}
      </div>

      <button
        className={cn(
          'absolute left-0 top-0 bottom-0 z-30 w-16 bg-gradient-to-r from-background via-background/80 to-transparent text-white opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100',
          !canScrollLeft && 'hidden'
        )}
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <button
        className={cn(
          'absolute right-0 top-0 bottom-0 z-30 w-16 bg-gradient-to-l from-background via-background/80 to-transparent text-white opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100',
          !canScrollRight && 'hidden'
        )}
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-10 h-10" />
      </button>
    </div>
  );
}