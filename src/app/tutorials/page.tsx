// src/app/tutorials/page.tsx
import Link from 'next/link';
import { getAllTutorials } from '../../../lib/markdown';

export default function TutorialsPage() {
  const allTutorials = getAllTutorials();

  // Get unique categories, difficulties, and blockchain technologies
  const categories = [...new Set(allTutorials.map(tutorial => tutorial.category).filter(Boolean))];
  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
  const blockchains = [...new Set(allTutorials.flatMap(tutorial => tutorial.blockchain || []))];

  return (
    <div className="container mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Tutorials</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Step-by-step guides to master blockchain development
        </p>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 mb-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-green-400">{allTutorials.length}</div>
            <div className="text-gray-300">Total Tutorials</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">{categories.length}</div>
            <div className="text-gray-300">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">{blockchains.length}</div>
            <div className="text-gray-300">Blockchains</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400">
              {allTutorials.filter(t => t.difficulty === 'beginner').length}
            </div>
            <div className="text-gray-300">Beginner Friendly</div>
          </div>
        </div>
      </div>

      {/* Filter by Difficulty */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Difficulty</h2>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/tutorials"
            className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            All Tutorials
          </Link>
          {difficulties.map(difficulty => (
            <Link 
              key={difficulty} 
              href={`/tutorials?difficulty=${difficulty}`}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              {difficulty}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter by Blockchain */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Blockchain</h2>
        <div className="flex flex-wrap gap-2">
          {blockchains.map(blockchain => (
            <Link 
              key={blockchain} 
              href={`/tutorials?blockchain=${blockchain}`}
              className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
            >
              {blockchain}
            </Link>
          ))}
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allTutorials.length > 0 ? (
          allTutorials.map((tutorial) => (
            <article key={tutorial.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #10b981, #059669)'}}>
                <div className="text-white text-4xl opacity-75">📚</div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
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
                  {tutorial.category && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {tutorial.category}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tutorial.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{tutorial.excerpt}</p>
                
                {/* Prerequisites */}
                {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Prerequisites:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {tutorial.prerequisites.slice(0, 2).map((prereq, index) => (
                        <li key={index}>• {prereq}</li>
                      ))}
                      {tutorial.prerequisites.length > 2 && (
                        <li>• +{tutorial.prerequisites.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Blockchain Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.blockchain?.slice(0, 2).map((blockchain) => (
                    <span key={blockchain} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {blockchain}
                    </span>
                  ))}
                  {tutorial.blockchain && tutorial.blockchain.length > 2 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                      +{tutorial.blockchain.length - 2} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{tutorial.date}</span>
                    {tutorial.author && (
                      <span className="text-xs text-gray-500">by {tutorial.author}</span>
                    )}
                  </div>
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
            <h3 className="text-xl font-bold text-white mb-2">No Tutorials Found</h3>
            <p className="text-gray-300">Check back soon for new tutorials!</p>
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