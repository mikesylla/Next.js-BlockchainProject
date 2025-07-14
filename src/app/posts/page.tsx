// src/app/posts/page.tsx - Posts listing page
import Link from 'next/link';
import { getAllPosts } from '../../../lib/markdown';

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          All Blog Posts
        </h1>
        <p className="text-xl text-gray-300">
          Tutorials, insights, and deep dives into blockchain development
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="glass-card p-6 hover-scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-white hover-text-blue-400 mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white-10 text-xs rounded-full text-blue-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {post.difficulty && (
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  post.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  post.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {post.difficulty}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {post.date} • {post.author}
              </div>
              
              <div className="flex gap-4">
                {post.github && (
                  <a 
                    href={post.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover-text-white"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                <Link 
                  href={`/posts/${post.slug}`}
                  className="text-blue-400 hover-text-blue-300 text-sm font-semibold"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}