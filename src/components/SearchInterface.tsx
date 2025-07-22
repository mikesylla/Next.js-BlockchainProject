// src/components/SearchInterface.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PostData, TutorialData, CourseData } from '../../lib/markdown';

type ContentType = 'posts' | 'tutorials' | 'courses';
type ContentItem = (PostData | TutorialData | CourseData) & { contentType: ContentType };

interface SearchFilters {
  contentTypes: ContentType[];
  difficulty: string;
  blockchain: string;
  dateRange: string;
  sortBy: 'relevance' | 'date' | 'title';
}

const ITEMS_PER_PAGE = 12;

export default function SearchInterface() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    contentTypes: ['posts', 'tutorials', 'courses'],
    difficulty: 'all',
    blockchain: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  });
  
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Load all content on mount
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const [postsRes, tutorialsRes, coursesRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/tutorials'),
          fetch('/api/courses')
        ]);

        const posts = await postsRes.json();
        const tutorials = await tutorialsRes.json();
        const courses = await coursesRes.json();

        const combined = [
          ...posts.map((p: PostData) => ({ ...p, contentType: 'posts' })),
          ...tutorials.map((t: TutorialData) => ({ ...t, contentType: 'tutorials' })),
          ...courses.map((c: CourseData) => ({ ...c, contentType: 'courses' }))
        ];

        setAllContent(combined);
        setFilteredContent(combined);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Filter and search logic
  const performSearch = useCallback(() => {
    let results = [...allContent];

    // Filter by content type
    results = results.filter(item => 
      filters.contentTypes.includes(item.contentType as ContentType)
    );

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      results = results.filter(item => 
        'difficulty' in item && item.difficulty === filters.difficulty
      );
    }

    // Filter by blockchain
    if (filters.blockchain !== 'all') {
      results = results.filter(item => 
        'blockchain' in item && 
        Array.isArray(item.blockchain) && 
        item.blockchain.some(b => b.toLowerCase() === filters.blockchain.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateLimit = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          dateLimit.setDate(now.getDate() - 7);
          break;
        case 'month':
          dateLimit.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          dateLimit.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      results = results.filter(item => new Date(item.date) >= dateLimit);
    }

    // Search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(item => {
        const searchableText = `
          ${item.title} 
          ${item.excerpt || ''} 
          ${item.tags?.join(' ') || ''} 
          ${'blockchain' in item ? item.blockchain?.join(' ') || '' : ''}
          ${item.author || ''}
        `.toLowerCase();
        
        return searchableText.includes(searchTerm);
      });

      // Save to recent searches
      if (!recentSearches.includes(query)) {
        const updated = [query, ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
    }

    // Sort results
    switch (filters.sortBy) {
      case 'date':
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'title':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
      default:
        // For relevance, prioritize title matches
        if (query.trim()) {
          results.sort((a, b) => {
            const aScore = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            const bScore = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            return bScore - aScore;
          });
        }
    }

    setFilteredContent(results);
    setCurrentPage(1);
  }, [query, filters, allContent, recentSearches]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  // Pagination
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
  const paginatedContent = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContent.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContent, currentPage]);

  // Get unique values for filters
  const uniqueBlockchains = useMemo(() => {
    const blockchains = new Set<string>();
    allContent.forEach(item => {
      if ('blockchain' in item && Array.isArray(item.blockchain)) {
        item.blockchain.forEach(b => blockchains.add(b));
      }
    });
    return Array.from(blockchains);
  }, [allContent]);

  // Get content type icon and color
  const getContentTypeStyle = (type: string) => {
    switch (type) {
      case 'posts':
        return { icon: '📝', color: 'text-blue-400', bg: 'bg-blue-500/20' };
      case 'tutorials':
        return { icon: '📚', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'courses':
        return { icon: '🎓', color: 'text-orange-400', bg: 'bg-orange-500/20' };
      default:
        return { icon: '📄', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <mark key={i} className="bg-yellow-400/30 text-white px-1 rounded">{part}</mark>
        : part
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tutorials, courses..."
            className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
          <div className="absolute right-3 top-3.5 text-gray-400">
            🔍
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(search)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-gray-300 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full p-4 flex justify-between items-center text-white hover:bg-white/5 transition-colors"
        >
          <span className="font-semibold">Filters</span>
          <span className="text-2xl">{showFilters ? '−' : '+'}</span>
        </button>
        
        {showFilters && (
          <div className="p-6 pt-0 space-y-4">
            {/* Content Type Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {(['posts', 'tutorials', 'courses'] as ContentType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      if (filters.contentTypes.includes(type)) {
                        setFilters(prev => ({
                          ...prev,
                          contentTypes: prev.contentTypes.filter(t => t !== type)
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          contentTypes: [...prev.contentTypes, type]
                        }));
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      filters.contentTypes.includes(type)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-full md:w-auto"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Blockchain Filter */}
            {uniqueBlockchains.length > 0 && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Blockchain</label>
                <select
                  value={filters.blockchain}
                  onChange={(e) => setFilters(prev => ({ ...prev, blockchain: e.target.value }))}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-full md:w-auto"
                >
                  <option value="all">All Blockchains</option>
                  {uniqueBlockchains.map(blockchain => (
                    <option key={blockchain} value={blockchain}>{blockchain}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-full md:w-auto"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white w-full md:w-auto"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-gray-300">
        <p>
          Found <span className="font-semibold text-white">{filteredContent.length}</span> results
          {query && <span> for "<span className="text-blue-400">{query}</span>"</span>}
        </p>
        {filteredContent.length > ITEMS_PER_PAGE && (
          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="glass-card p-8 text-center">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-300">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedContent.map((item, index) => {
            const style = getContentTypeStyle(item.contentType as string);
            return (
              <div key={`${item.contentType}-${item.slug}-${index}`} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Content Type Indicator */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 ${style.bg} rounded-lg flex items-center justify-center`}>
                      <span className="text-2xl">{style.icon}</span>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold ${style.color} uppercase`}>
                        {item.contentType?.slice(0, -1)}
                      </span>
                      {'difficulty' in item && item.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          item.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.difficulty}
                        </span>
                      )}
                      {'blockchain' in item && item.blockchain?.map(b => (
                        <span key={b} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          {b}
                        </span>
                      ))}
                    </div>

                    <Link href={`/${item.contentType}/${item.slug}`}>
                      <h3 className="text-xl font-bold text-white hover:text-blue-300 transition-colors cursor-pointer mb-2">
                        {highlightText(item.title, query)}
                      </h3>
                    </Link>

                    <p className="text-gray-300 mb-3">
                      {highlightText(item.excerpt || '', query)}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      {item.author && <span>by {item.author}</span>}
                      {'estimatedTime' in item && item.estimatedTime && (
                        <span>⏱️ {item.estimatedTime}</span>
                      )}
                      {'chapters' in item && item.chapters && (
                        <span>📖 {item.chapters} chapters</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 rounded-lg text-white transition-colors"
          >
            ← Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 rounded-lg text-white transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}