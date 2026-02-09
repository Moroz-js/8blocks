'use client';

import { useState } from 'react';
import { Facebook, Instagram, Send, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: 'instagram' | 'x' | 'facebook' | 'telegram') => {
    const shareLinks = {
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    };

    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="flex flex-col gap-[1.25rem]">
      <p className="font-berka font-medium text-[0.8125rem] leading-[1.5] text-white opacity-50">
        Share
      </p>
      <div className="flex gap-[1.1875rem] items-center">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="relative size-[1.375rem] text-white hover:opacity-70 transition-opacity"
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? (
            <Check className="size-full" strokeWidth={2} />
          ) : (
            <LinkIcon className="size-full" strokeWidth={2} />
          )}
        </button>

        {/* Instagram */}
        <button
          onClick={() => handleShare('instagram')}
          className="relative size-[1.375rem] text-white hover:opacity-70 transition-opacity"
          aria-label="Share on Instagram"
          title="Share on Instagram"
        >
          <Instagram className="size-full" strokeWidth={2} />
        </button>

        {/* X (Twitter) */}
        <button
          onClick={() => handleShare('x')}
          className="relative size-[1.375rem] text-white hover:opacity-70 transition-opacity"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg className="size-full" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="relative size-[1.375rem] text-white hover:opacity-70 transition-opacity"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <Facebook className="size-full" strokeWidth={2} />
        </button>

        {/* Telegram */}
        <button
          onClick={() => handleShare('telegram')}
          className="relative size-[1.375rem] text-white hover:opacity-70 transition-opacity"
          aria-label="Share on Telegram"
          title="Share on Telegram"
        >
          <Send className="size-full" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
