/**
 * Media and Document Embed Utilities
 * Supports:
 * - YouTube (watch, youtu.be, shorts, embed)
 * - Vimeo (standard, player)
 * - Google Drive (video preview, file view, documents, spreadsheets)
 * - Google Slides (presentation edit/view -> embed)
 * - PDF (data URLs, direct URLs, Google Docs Viewer)
 * - PPTX (Microsoft Office Online Viewer, Google Docs Viewer)
 */

export interface EmbedMediaInfo {
  type: 'youtube' | 'vimeo' | 'drive' | 'direct_video' | 'google_slides' | 'canva' | 'pdf' | 'pptx' | 'generic_doc' | 'unknown';
  embedUrl: string;
  originalUrl: string;
  title?: string;
  videoId?: string;
  thumbnailUrl?: string;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|user\/[^\/]+\/.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo video ID from Vimeo URL
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?([0-9]+)/i
  );
  return match ? match[1] : null;
}

/**
 * Extracts Google Drive / Google Docs / Google Slides ID
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:presentation|document|spreadsheets)\/d\/)([a-zA-Z0-9_-]+)/i
  );
  return match ? match[1] : null;
}

/**
 * Detects and transforms video URLs into playable embed URLs
 */
export function parseVideoUrl(url?: string): EmbedMediaInfo | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();

  // 1. YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: trimmed,
      videoId: ytId,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      title: 'Video de YouTube'
    };
  }

  // 2. Vimeo
  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
      originalUrl: trimmed,
      videoId: vimeoId,
      title: 'Video de Vimeo'
    };
  }

  // 3. Google Drive Video
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId && trimmed.includes('drive.google.com')) {
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      originalUrl: trimmed,
      videoId: driveId,
      title: 'Video en Google Drive'
    };
  }

  // 4. Direct video files (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'direct_video',
      embedUrl: trimmed,
      originalUrl: trimmed,
      title: 'Video Directo (MP4)'
    };
  }

  // Generic fallback if user entered an embed url directly
  if (trimmed.includes('embed') || trimmed.includes('player')) {
    return {
      type: 'direct_video',
      embedUrl: trimmed,
      originalUrl: trimmed,
      title: 'Reproductor de Video'
    };
  }

  return null;
}

/**
 * Detects and transforms Document URLs (PDF, PPTX, Google Slides, Google Drive) into interactive embed URLs
 */
export function parseDocumentUrl(url?: string, docTypeHint?: string): EmbedMediaInfo | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();

  // 1. Base64 PDF Data URL
  if (trimmed.startsWith('data:application/pdf') || trimmed.startsWith('data:image/')) {
    return {
      type: 'pdf',
      embedUrl: trimmed,
      originalUrl: trimmed,
      title: 'Documento PDF (Local)'
    };
  }

  // 2. Google Slides
  const gSlidesMatch = trimmed.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i);
  if (gSlidesMatch && gSlidesMatch[1]) {
    const presId = gSlidesMatch[1];
    return {
      type: 'google_slides',
      embedUrl: `https://docs.google.com/presentation/d/${presId}/embed?start=false&loop=false&delayms=3000`,
      originalUrl: trimmed,
      videoId: presId,
      title: 'Presentación Google Slides'
    };
  }

  // 3. Google Drive File (PDF, Docs, Presentation, Sheets)
  const gDriveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      originalUrl: trimmed,
      videoId: fileId,
      title: 'Archivo en Google Drive'
    };
  }

  // 4. Canva Presentation or Design Public Link
  const isCanva = trimmed.includes('canva.com') || docTypeHint === 'canva' || trimmed.includes('canva');
  if (isCanva) {
    const embed = formatCanvaEmbedUrl(trimmed);
    const directView = getCanvaDirectViewUrl(trimmed);
    return {
      type: 'canva',
      embedUrl: embed,
      originalUrl: directView || trimmed,
      title: 'Presentación en Canva'
    };
  }

  // 5. Direct PDF file
  if (/\.pdf(\?.*)?$/i.test(trimmed) || docTypeHint === 'pdf') {
    return {
      type: 'pdf',
      embedUrl: trimmed,
      originalUrl: trimmed,
      title: 'Documento PDF'
    };
  }

  // 6. PowerPoint Presentation (.pptx, .ppt)
  if (/\.(pptx|ppt)(\?.*)?$/i.test(trimmed) || docTypeHint === 'pptx') {
    return {
      type: 'pptx',
      embedUrl: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(trimmed)}`,
      originalUrl: trimmed,
      title: 'Presentación PowerPoint (PPTX)'
    };
  }

  // 7. Generic web documents
  return {
    type: 'generic_doc',
    embedUrl: trimmed,
    originalUrl: trimmed,
    title: 'Documento Digital'
  };
}

/**
 * Transforms any Canva public view/design URL, presentation link, or embed code into a valid embed iframe URL.
 * Preserves the Canva design ID AND the public view token (e.g. /design/DAG.../TOKEN/view?embed).
 */
export function formatCanvaEmbedUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();

  // 1. If user pasted raw iframe HTML snippet or Canva embed code
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    trimmed = srcMatch[1].trim();
  }

  // 2. Decode any encoded HTML entities
  trimmed = trimmed.replace(/&amp;/g, '&');

  // 3. If already has /view?embed or /watch?embed
  if (trimmed.includes('/view?embed') || trimmed.includes('/watch?embed')) {
    if (!trimmed.startsWith('http')) {
      trimmed = `https://${trimmed.replace(/^\/\//, '')}`;
    }
    return trimmed;
  }

  // 4. Pattern: canva.com/design/:designId(/:viewToken)(/:action)
  // Handles:
  // - https://www.canva.com/design/DAGR5W4Y2vU/view
  // - https://www.canva.com/design/DAGeXYZ123/kXyZ_4567/view?utm_content=...
  // - https://www.canva.com/design/DAGeXYZ123/kXyZ_4567/watch
  // - https://www.canva.com/design/DAGeXYZ123/kXyZ_4567/edit
  const designRegex = /canva\.com\/design\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?(?:\/(view|watch|edit|present|preview))?/i;
  const match = trimmed.match(designRegex);

  if (match) {
    const designId = match[1];
    const secondParam = match[2];
    const isSecondParamAction = secondParam && ['view', 'watch', 'edit', 'present', 'preview'].includes(secondParam.toLowerCase());

    if (isSecondParamAction || !secondParam) {
      return `https://www.canva.com/design/${designId}/view?embed`;
    }

    // Preserves BOTH design ID and public view token / slug!
    return `https://www.canva.com/design/${designId}/${secondParam}/view?embed`;
  }

  // 5. Fallback for other canva URLs
  const cleanUrl = trimmed.split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (/\/(view|watch|edit|present)$/i.test(cleanUrl)) {
    return cleanUrl.replace(/\/(view|watch|edit|present)$/i, '/view?embed');
  }

  return `${cleanUrl}/view?embed`;
}

/**
 * Returns a clean, direct public presentation URL to open directly in Canva in a new tab
 */
export function getCanvaDirectViewUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    trimmed = srcMatch[1].trim();
  }

  trimmed = trimmed.replace(/&amp;/g, '&');

  if (trimmed.includes('?embed')) {
    trimmed = trimmed.replace('?embed', '');
  }

  const designRegex = /canva\.com\/design\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?(?:\/(view|watch|edit|present|preview))?/i;
  const match = trimmed.match(designRegex);

  if (match) {
    const designId = match[1];
    const secondParam = match[2];
    const isSecondParamAction = secondParam && ['view', 'watch', 'edit', 'present', 'preview'].includes(secondParam.toLowerCase());

    if (isSecondParamAction || !secondParam) {
      return `https://www.canva.com/design/${designId}/view`;
    }

    return `https://www.canva.com/design/${designId}/${secondParam}/view`;
  }

  return trimmed;
}

/**
 * Transforms any Google Drive / Docs sharing link into a valid preview / embed link
 */
export function formatGoogleDrivePreviewUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already preview or embed
  if (trimmed.includes('/preview') || trimmed.includes('/embed')) return trimmed;

  // Google Presentation
  const gSlidesMatch = trimmed.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i);
  if (gSlidesMatch && gSlidesMatch[1]) {
    return `https://docs.google.com/presentation/d/${gSlidesMatch[1]}/embed?start=false&loop=false&delayms=3000`;
  }

  // Google Drive File
  const gDriveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`;
  }

  return trimmed;
}
