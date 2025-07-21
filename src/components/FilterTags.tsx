// components/FilterTags.tsx
export default function FilterTags({ 
  tags, 
  selectedTags, 
  onTagToggle 
}: {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagToggle(tag)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}