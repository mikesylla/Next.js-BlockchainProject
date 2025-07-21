// components/SearchBar.tsx
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
        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
      />
    </div>
  );
}