// src/app/posts/page.tsx - Add search and filter functionality
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import FilterTags from '../../components/FilterTags';
import { PostData } from '../../../lib/markdown';

// This would normally be fetched server-side, but for search/filter we need client-side
export default function PostsPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    // Fetch posts - you'll need to create an API route for this
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setFilteredPosts(data);
        
        // Extract all unique tags
        const tags = [...new Set(data.flatMap((post: PostData) => post.tags || []))];
        setAllTags(tags);
      });
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags?.includes(tag))
      );
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(post => post.difficulty === selectedDifficulty);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedTags, selectedDifficulty]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Blog Posts</h1>
        <p className="text-xl text-gray-300">
          Insights, tutorials, and deep dives into blockchain development
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6 mb-12">
        <SearchBar onSearch={setSearchQuery} />
        
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Filter by Tags:</h3>
            <FilterTags 
              tags={allTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Difficulty:</h3>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center text-gray-400">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
      </div>

      {/* Posts Grid */}
      <div className="posts-two-column-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)'}}>
                <div className="text-white text-4xl opacity-75">📝</div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 text-xs rounded-full text-blue-400">
                      {tag}
                    </span>
                  ))}
                  {post.difficulty && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      post.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {post.difficulty}
                    </span>
                  )}
                </div>
                
                <Link href={`/posts/${post.slug}`}>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-300 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-300 mb-4 text-sm">{post.excerpt}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <Link 
                    href={`/posts/${post.slug}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-card p-8 text-center col-span-full">
            <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
            <p className="text-gray-300">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}