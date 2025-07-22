// src/components/GlobalSearch.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  title: string;
  slug: string;
  type: 'posts' | 'tutorials' | 'courses';
  excerpt?: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick search as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Fetch from all content types
        const [postsRes, tutorialsRes, coursesRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/tutorials'),
          fetch('/api/courses')
        ]);

        const posts = await postsRes.json();
        const tutorials = await tutorialsRes.json();
        const courses = await coursesRes.json();

        // Simple search through titles and excerpts
        const searchTerm = query.toLowerCase();
        const allResults: SearchResult[] = [];

        posts.forEach((post: any) => {
          if (post.title.toLowerCase().includes(searchTerm) || 
              post.excerpt?.toLowerCase().includes(searchTerm)) {
            allResults.push({
              title: post.title,
              slug: post.slug,
              type: 'posts',
              excerpt: post.excerpt
            });
          }
        });

        tutorials.forEach((tutorial: any) => {
          if (tutorial.title.toLowerCase().includes(searchTerm) || 
              tutorial.excerpt?.toLowerCase().includes(searchTerm)) {
            allResults.push({
              title: tutorial.title,
              slug: tutorial.slug,
              type: 'tutorials',
              excerpt: tutorial.excerpt
            });
          }
        });

        courses.forEach((course: any) => {
          if (course.title.toLowerCase().includes(searchTerm) || 
              course.excerpt?.toLowerCase().includes(searchTerm)) {
            allResults.push({
              title: course.title,
              slug: course.slug,
              type: 'courses',
              excerpt: course.excerpt
            });
          }
        });

        setResults(allResults.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'posts': return '📝';
      case 'tutorials': return '📚';
      case 'courses': return '🎓';
      default: return '📄';
    }
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        aria-label="Search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:inline text-sm">Search</span>
        <kbd className="hidden md:inline px-2 py-0.5 text-xs bg-white/10 rounded">⌘K</kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-full md:w-96 z-50">
          <div className="glass-card overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts, tutorials, courses..."
                  className="w-full px-4 py-3 pr-12 bg-transparent border-b border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Results */}
            {query && (
              <div className="p-4 border-t border-white/10">
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-pulse text-gray-400">Searching...</div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Quick results</p>
                    {results.map((result, index) => (
                      <Link
                        key={`${result.type}-${result.slug}-${index}`}
                        href={`/${result.type}/${result.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="block p-3 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl mt-0.5">{getTypeIcon(result.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{result.title}</h4>
                            {result.excerpt && (
                              <p className="text-sm text-gray-400 truncate">{result.excerpt}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={handleSubmit}
                        className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View all results for "{query}" →
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-4">No results found</p>
                )}
              </div>
            )}

            {/* Search Tips */}
            {!query && (
              <div className="p-4 border-t border-white/10 text-sm text-gray-400">
                <p className="mb-2">Search tips:</p>
                <ul className="space-y-1">
                  <li>• Search by title, content, or tags</li>
                  <li>• Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> for full search</li>
                  <li>• Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Esc</kbd> to close</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}