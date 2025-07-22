// src/app/search/page.tsx
import { Suspense } from 'react';
import SearchInterface from '../../components/SearchInterface';

export default function SearchPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
          <span className="gradient-text">Search Everything</span>
        </h1>
        <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
          Find posts, tutorials, and courses across all blockchain technologies
        </p>
        
        <Suspense fallback={
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-white/10 rounded-lg mb-4"></div>
              <div className="h-64 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        }>
          <SearchInterface />
        </Suspense>
      </div>
    </div>
  );
}