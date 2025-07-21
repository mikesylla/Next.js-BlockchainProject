// src/app/courses/page.tsx - Add search and filter functionality
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar';
import FilterTags from '../../components/FilterTags';
import { CourseData } from '../../../lib/markdown';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    // Fetch courses
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setFilteredCourses(data);
        
        // Extract all unique tags
        const tags = [...new Set(data.flatMap((course: CourseData) => course.tags || []))];
        setAllTags(tags);
      });
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(course =>
        selectedTags.some(tag => course.tags?.includes(tag))
      );
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedTags, selectedDifficulty]);

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
        <h1 className="text-5xl font-bold gradient-text mb-4">All Courses</h1>
        <p className="text-xl text-gray-300">
          Comprehensive learning paths for blockchain mastery
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
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-two-column-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <article key={course.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #f59e0b, #d97706)'}}>
                <div className="text-white text-4xl opacity-75">🎓</div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 text-xs rounded-full text-orange-400">
                      {tag}
                    </span>
                  ))}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {course.difficulty}
                  </span>
                  {course.chapters && (
                    <span className="px-2 py-1 bg-white/10 text-xs rounded-full text-gray-300">
                      {course.chapters} chapters
                    </span>
                  )}
                  {course.estimatedTime && (
                    <span className="px-2 py-1 bg-white/10 text-xs rounded-full text-gray-300">
                      {course.estimatedTime}
                    </span>
                  )}
                </div>
                
                <Link href={`/courses/${course.slug}`}>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-orange-300 transition-colors cursor-pointer">
                    {course.title}
                  </h3>
                </Link>
                
                <p className="text-gray-300 mb-4 text-sm">{course.excerpt}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{course.date}</span>
                    {course.price && (
                      <span className="text-sm font-semibold text-orange-400">
                        ${course.price}
                      </span>
                    )}
                  </div>
                  <Link 
                    href={`/courses/${course.slug}`}
                    className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
                  >
                    Start Course →
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-card p-8 text-center col-span-full">
            <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
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