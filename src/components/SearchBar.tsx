// src/components/SearchBar.tsx
"use client";
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  
  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search posts, tutorials, courses..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
    </div>
  );
}