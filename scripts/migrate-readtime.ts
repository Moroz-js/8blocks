/**
 * Migration script to calculate readTime for all existing blog posts
 * Run with: npx tsx scripts/migrate-readtime.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calculateReadTime(content: string, locale: 'en' | 'ru' = 'en'): number {
  if (!content || content.trim().length === 0) {
    return 1;
  }

  const text = content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_`~\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const words = text.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  const wordsPerMinute = locale === 'ru' ? 190 : 225;
  const minutes = wordCount / wordsPerMinute;

  return Math.max(1, Math.ceil(minutes));
}

function calculateBilingualReadTime(
  contentEn: string,
  contentRu: string | null | undefined
): number {
  const timeEn = calculateReadTime(contentEn, 'en');
  
  if (!contentRu) {
    return timeEn;
  }

  const timeRu = calculateReadTime(contentRu, 'ru');
  return Math.max(timeEn, timeRu);
}

async function migrateReadTime() {
  console.log('🚀 Starting readTime migration...\n');

  try {
    // Get all posts
    const posts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        contentRu: true,
        readTime: true,
      },
    });

    console.log(`📚 Found ${posts.length} posts\n`);

    let updated = 0;
    let skipped = 0;

    for (const post of posts) {
      const newReadTime = calculateBilingualReadTime(post.content, post.contentRu);
      
      if (post.readTime !== newReadTime) {
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { readTime: newReadTime },
        });
        
        console.log(`✅ Updated "${post.title}": ${post.readTime ?? 'null'} → ${newReadTime} min`);
        updated++;
      } else {
        console.log(`⏭️  Skipped "${post.title}": already ${newReadTime} min`);
        skipped++;
      }
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`   Updated: ${updated} posts`);
    console.log(`   Skipped: ${skipped} posts`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateReadTime()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
