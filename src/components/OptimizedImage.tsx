import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { imageOptimizationService } from '../services/imageOptimizationService';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  showPlaceholder?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fallbackSrc = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  aspectRatio,
  showPlaceholder = true,
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading triggers
  useEffect(() => {
    if (priority || isInView) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px 0px' } // Pre-fetch 200px before entering viewport
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [priority, isInView]);

  // Reset states if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const currentSrc = hasError ? fallbackSrc : src;
  const webpSrc = imageOptimizationService.getOptimizedUrl(currentSrc, { quality, format: 'webp' });
  const srcSet = imageOptimizationService.getSrcSet(currentSrc);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!hasError) {
      setHasError(true);
    }
    onError?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Sleek Skeleton Placeholder with Pulse Animation */}
      {showPlaceholder && !isLoaded && (
        <div 
          className="absolute inset-0 bg-neutral-900/80 animate-pulse flex items-center justify-center z-0"
          aria-hidden="true"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
            <ImageIcon className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Modern Picture Tag with WebP & Responsive SrcSet */}
      {isInView && (
        <picture className="w-full h-full block">
          {srcSet ? (
            <source
              type="image/webp"
              srcSet={srcSet}
              sizes={sizes}
            />
          ) : (
            <source
              type="image/webp"
              srcSet={webpSrc}
            />
          )}

          <img
            src={webpSrc || currentSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            referrerPolicy="no-referrer"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`transition-all duration-500 ease-out transform-gpu will-change-transform ${
              isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-[1.02] blur-sm'
            } ${className}`}
            {...rest}
          />
        </picture>
      )}
    </div>
  );
};
