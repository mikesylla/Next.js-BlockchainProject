// src/app/tutorials/page.tsx - Add search and filter functionality
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import FilterTags from '../../components/FilterTags';
import { TutorialData } from '../../../lib/markdown';

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<TutorialData[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<TutorialData[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    // Fetch tutorials
    fetch('/api/tutorials')
      .then(res => res.json())
      .then(data => {
        setTutorials(data);
        setFilteredTutorials(data);
        
        // Extract all unique tags
        const tags = [...new Set(data.flatMap((tutorial: TutorialData) => tutorial.tags || []))];
        setAllTags(tags);
      });
  }, []);

  useEffect(() => {
    let filtered = tutorials;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tutorial.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(tutorial =>
        selectedTags.some(tag => tutorial.tags?.includes(tag))
      );
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(tutorial => tutorial.difficulty === selectedDifficulty);
    }

    setFilteredTutorials(filtered);
  }, [tutorials, searchQuery, selectedTags, selectedDifficulty]);

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
        <h1 className="text-5xl font-bold gradient-text mb-4">All Tutorials</h1>
        <p className="text-xl text-gray-300">
          Step-by-step guides to master blockchain development
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
          Showing {filteredTutorials.length} of {tutorials.length} tutorials
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="tutorials-two-column-grid">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <article key={tutorial.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #10b981, #059669)'}}>
                <div className="text-white text-4xl opacity-75">📚</div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tutorial.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 text-xs rounded-full text-green-400">
                      {tag}
                    </span>
                  ))}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tutorial.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    tutorial.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                  {tutorial.estimatedTime && (
                    <span className="px-2 py-1 bg-white/10 text-xs rounded-full text-gray-300">
                      {tutorial.estimatedTime}
                    </span>
                  )}
                  {tutorial.blockchain?.slice(0, 1).map((blockchain) => (
                    <span key={blockchain} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {blockchain}
                    </span>
                  ))}
                </div>
                
                <Link href={`/tutorials/${tutorial.slug}`}>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-green-300 transition-colors cursor-pointer">
                    {tutorial.title}
                  </h3>
                </Link>
                
                <p className="text-gray-300 mb-4 text-sm">{tutorial.excerpt}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{tutorial.date}</span>
                  <Link 
                    href={`/tutorials/${tutorial.slug}`}
                    className="text-green-400 hover:text-green-300 text-sm font-semibold transition-colors"
                  >
                    Start Tutorial →
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-card p-8 text-center col-span-full">
            <h3 className="text-xl font-bold text-white mb-2">No tutorials found</h3>
            <p className="text-gray-300">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link href="/" className="btn-secondary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}