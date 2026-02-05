/**
 * Parse headings from HTML content and add IDs to them
 */
export function parseAndAddIdsToHeadings(html: string): {
  content: string;
  headings: Array<{ id: string; text: string; level: number }>;
} {
  if (typeof window === 'undefined') {
    // Server-side: use regex to parse headings
    const headings: Array<{ id: string; text: string; level: number }> = [];
    let modifiedHtml = html;

    // Match h2 and h3 tags
    const headingRegex = /<(h[2-3])(?:\s+[^>]*)?>([^<]+)<\/\1>/gi;
    let match;
    let index = 0;

    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1].charAt(1));
      const text = match[0].replace(/<[^>]+>/g, '').trim();
      const id = `heading-${index}`;

      headings.push({ id, text, level });

      // Add id to the heading if it doesn't have one
      if (!match[0].includes('id=')) {
        const newHeading = match[0].replace(
          `<${match[1]}`,
          `<${match[1]} id="${id}"`
        );
        modifiedHtml = modifiedHtml.replace(match[0], newHeading);
      }

      index++;
    }

    return { content: modifiedHtml, headings };
  }

  // Client-side: use DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headingElements = doc.querySelectorAll('h2, h3');
  const headings: Array<{ id: string; text: string; level: number }> = [];

  headingElements.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent?.trim() || '';
    const id = heading.id || `heading-${index}`;

    if (!heading.id) {
      heading.id = id;
    }

    headings.push({ id, text, level });
  });

  return {
    content: doc.body.innerHTML,
    headings,
  };
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
