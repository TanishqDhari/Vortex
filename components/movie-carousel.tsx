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

  // Refs for drag-to-scroll functionality
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

  // --- Drag Event Handlers ---
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
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
    const walk = (x - startXRef.current) * 1.5; // Multiply for faster drag
    carouselRef.current.scrollLeft = scrollLeftStartRef.current - walk;
    checkScrollability(); // Update arrow states while dragging
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className={cn('relative group overflow-hidden', className)}>
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={cn(
          'flex gap-2 sm:gap-4 overflow-x-auto scroll-smooth hide-scrollbar overscroll-x-contain',
          'cursor-grab active:cursor-grabbing select-none' // Add cursor and text selection styles
        )}
      >
        {children.map((child, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 min-w-[150px] w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/8 py-4"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        className={cn(
          'absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-16 bg-gradient-to-r from-black/60 to-transparent text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          !canScrollLeft && 'hidden'
        )}
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      {/* Right Arrow */}
      <button
        className={cn(
          'absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-16 bg-gradient-to-l from-black/60 to-transparent text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100',
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