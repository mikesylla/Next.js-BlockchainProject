// src/components/SocialSharing.tsx
"use client";
import { useState } from 'react';

export default function SocialSharing({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="mt-12 p-6 glass-card text-center">
      <h3 className="text-xl font-bold text-white mb-4">Share this post</h3>
      <div className="flex justify-center gap-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          LinkedIn
        </a>
        <button 
          onClick={handleCopyLink}
          className="btn-secondary text-sm"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}