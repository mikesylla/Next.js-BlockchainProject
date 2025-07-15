// src/app/posts/page.tsx
import Link from 'next/link';
import { getAllPosts, getContentByTag, getContentByDifficulty } from '../../../lib/markdown';

export default function PostsPage() {
  const allPosts = getAllPosts();

  // Get unique tags and difficulties for filtering
  const allTags = [...new Set(allPosts.flatMap(post => post.tags || []))];
  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;

  return (
    <div className="container mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Blog Posts</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Insights, tutorials, and thoughts on blockchain development
        </p>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 mb-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-400">{allPosts.length}</div>
            <div className="text-gray-300">Total Posts</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{allTags.length}</div>
            <div className="text-gray-300">Topics Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">
              {[...new Set(allPosts.flatMap(post => post.blockchain || []))].length}
            </div>
            <div className="text-gray-300">Blockchain Technologies</div>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Topic</h2>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/posts"
            className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            All Posts
          </Link>
          {allTags.map(tag => (
            <Link 
              key={tag} 
              href={`/posts?tag=${tag}`}
              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter by Difficulty */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Difficulty</h2>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <Link 
              key={difficulty} 
              href={`/posts?difficulty=${difficulty}`}
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

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
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
                
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{post.excerpt}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.blockchain?.slice(0, 2).map((blockchain) => (
                    <span key={blockchain} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {blockchain}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    {post.author && (
                      <span className="text-xs text-gray-500">by {post.author}</span>
                    )}
                  </div>
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
            <h3 className="text-xl font-bold text-white mb-2">No Posts Found</h3>
            <p className="text-gray-300">Check back soon for new content!</p>
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