/**
 * Calculate estimated reading time for blog content
 * @param content - The blog post content (can include HTML/Markdown)
 * @param locale - Language locale ('en' or 'ru')
 * @returns Estimated reading time in minutes (minimum 1 minute)
 */
export function calculateReadTime(content: string, locale: 'en' | 'ru' = 'en'): number {
  if (!content || content.trim().length === 0) {
    return 1;
  }

  // Remove HTML tags and special characters
  const text = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[#*_`~\[\]]/g, '') // Remove Markdown symbols
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Count words
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Average reading speed:
  // English: 200-250 words per minute (using 225 as average)
  // Russian: 180-200 words per minute (Cyrillic is slower to read, using 190)
  const wordsPerMinute = locale === 'ru' ? 190 : 225;

  // Calculate reading time
  const minutes = wordCount / wordsPerMinute;

  // Round up and ensure minimum of 1 minute
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Calculate reading time considering both English and Russian content
 * Returns the maximum of both to ensure users have enough time
 */
export function calculateBilingualReadTime(
  contentEn: string,
  contentRu: string | null | undefined
): number {
  const timeEn = calculateReadTime(contentEn, 'en');
  
  if (!contentRu) {
    return timeEn;
  }

  const timeRu = calculateReadTime(contentRu, 'ru');
  
  // Return the maximum to ensure sufficient reading time for both languages
  return Math.max(timeEn, timeRu);
}
