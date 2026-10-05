/**
 * Image Optimization Service
 * Provides utilities for modern format negotiation (WebP, AVIF),
 * responsive srcset generation, lazy loading, and intelligent image caching/preloading.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fit?: 'crop' | 'clip' | 'fill' | 'scale';
}

class ImageOptimizationService {
  private preloadedCache = new Set<string>();
  private webpSupported: boolean | null = null;

  /**
   * Detects browser WebP support asynchronously
   */
  async checkWebPSupport(): Promise<boolean> {
    if (this.webpSupported !== null) return this.webpSupported;
    if (typeof window === 'undefined') return true;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.webpSupported = img.width > 0 && img.height > 0;
        resolve(this.webpSupported);
      };
      img.onerror = () => {
        this.webpSupported = false;
        resolve(false);
      };
      img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    });
  }

  /**
   * Transforms image URLs (Unsplash, Cloudinary, etc.) to request WebP/modern formats with optimal compression
   */
  getOptimizedUrl(src: string, options: ImageOptimizationOptions = {}): string {
    if (!src || typeof src !== 'string') return '';
    if (src.startsWith('data:') || src.startsWith('blob:')) return src;

    const {
      width,
      height,
      quality = 80,
      format = 'webp',
      fit = 'crop'
    } = options;

    try {
      // 1. Unsplash URLs
      if (src.includes('images.unsplash.com')) {
        const url = new URL(src);
        url.searchParams.set('auto', 'format,compress');
        url.searchParams.set('fm', format === 'auto' ? 'webp' : format);
        url.searchParams.set('q', quality.toString());
        url.searchParams.set('fit', fit);
        if (width) url.searchParams.set('w', width.toString());
        if (height) url.searchParams.set('h', height.toString());
        return url.toString();
      }

      // 2. Cloudinary URLs
      if (src.includes('res.cloudinary.com')) {
        const parts = src.split('/upload/');
        if (parts.length === 2) {
          const transforms = [
            `f_${format === 'auto' ? 'auto' : format}`,
            `q_${quality}`,
            width ? `w_${width}` : null,
            height ? `h_${height}` : null,
            `c_${fit}`
          ].filter(Boolean).join(',');
          return `${parts[0]}/upload/${transforms}/${parts[1]}`;
        }
      }

      // 3. Imgur URLs
      if (src.includes('i.imgur.com')) {
        if (format === 'webp') {
          return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
      }

      return src;
    } catch {
      return src;
    }
  }

  /**
   * Generates a responsive srcset string with WebP formatting
   */
  getSrcSet(src: string, widths: number[] = [400, 800, 1200, 1600]): string {
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) return '';
    if (!src.includes('images.unsplash.com') && !src.includes('res.cloudinary.com')) return '';

    return widths
      .map(w => `${this.getOptimizedUrl(src, { width: w, format: 'webp' })} ${w}w`)
      .join(', ');
  }

  /**
   * Preloads an image into the browser cache for instant display
   */
  preload(src: string, options?: ImageOptimizationOptions): Promise<void> {
    const optimized = this.getOptimizedUrl(src, options);
    if (this.preloadedCache.has(optimized)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedCache.add(optimized);
        resolve();
      };
      img.onerror = () => resolve(); // Resolve gracefully to avoid blocking
      img.src = optimized;
    });
  }

  /**
   * Preloads multiple images in batch (e.g. adjacent carousel items)
   */
  preloadBatch(urls: string[], options?: ImageOptimizationOptions): void {
    urls.filter(Boolean).forEach(url => this.preload(url, options));
  }
}

export const imageOptimizationService = new ImageOptimizationService();
