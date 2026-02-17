'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      // Check localStorage to avoid unnecessary API calls
      const lastView = localStorage.getItem(`blog_view_${slug}`);
      
      if (lastView) {
        const lastViewDate = new Date(lastView);
        const now = new Date();
        
        // If viewed less than 24 hours ago, skip
        if (now.getTime() - lastViewDate.getTime() < 24 * 60 * 60 * 1000) {
          return;
        }
      }
      
      try {
        const response = await fetch(`/api/blog/posts/${slug}/view`, {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.viewed) {
            localStorage.setItem(`blog_view_${slug}`, new Date().toISOString());
          }
        }
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };
    
    // Track after 3 seconds to ensure it's a real view
    const timer = setTimeout(trackView, 3000);
    
    return () => clearTimeout(timer);
  }, [slug]);
  
  return null;
}
