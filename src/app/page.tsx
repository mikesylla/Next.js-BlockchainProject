// src/app/page.tsx - Simplified approach that should work
import Link from 'next/link';
import { getFeaturedPosts } from '../../lib/markdown';

export default function Home() {
  const featuredPosts = getFeaturedPosts(3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md-text-7xl font-bold mb-6">
            <span className="gradient-text">Blockchain</span>
            <br />
            <span className="text-white">Development Journey</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Exploring the cutting edge of blockchain technology through 
            <strong className="text-blue-400"> Solidity</strong>, 
            <strong className="text-purple-400"> Cairo</strong>, 
            <strong className="text-green-400"> Scaffold-Stark</strong>, and 
            <strong className="text-orange-400"> Dojo</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts" className="btn-primary">
              Explore Tutorials
            </Link>
            <Link href="/projects" className="btn-secondary">
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Our Mission Module - Simplified version */}
      <section className="py-16">
        <div className="glass-card p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold gradient-text mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 mb-6">
            To democratize blockchain development knowledge and make advanced technologies 
            accessible to developers worldwide.
          </p>
          
          <div className="grid grid-cols-2 md-grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-sm text-gray-300"><strong className="text-white">Open Source</strong><br/>All code freely available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🛠️</div>
              <div className="text-sm text-gray-300"><strong className="text-white">Practical Learning</strong><br/>Real projects, not just theory</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm text-gray-300"><strong className="text-white">Community</strong><br/>Building together</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm text-gray-300"><strong className="text-white">Innovation</strong><br/>Cutting edge technology</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Technologies I'm Exploring</h2>
        </div>
        
        <div className="grid-cols-4">
          {[
            { name: 'Solidity', icon: '⚡', desc: 'Smart contracts for Ethereum' },
            { name: 'Cairo', icon: '🏛️', desc: 'StarkNet programming language' },
            { name: 'Scaffold-Stark', icon: '🏗️', desc: 'Rapid StarkNet development' },
            { name: 'Dojo', icon: '🎮', desc: 'Onchain game development' }
          ].map((tech, index) => (
            <div key={index} className="glass-card p-6 text-center hover-scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">{tech.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
              <p className="text-gray-300 text-sm">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Featured Posts</h2>
          <p className="text-xl text-gray-300">Latest tutorials and insights from my blockchain journey</p>
        </div>
        
        <div className="grid-cols-3">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => (
              <article key={post.slug} className="glass-card overflow-hidden hover-scale-105 transition-transform duration-300">
                <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)'}}>
                  <div className="text-white text-4xl opacity-75">📝</div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-white-10 text-xs rounded-full text-blue-400">
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
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="text-blue-400 hover-text-blue-300 text-sm font-semibold"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="glass-card p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-gray-300">Blog posts are being prepared. Check back soon!</p>
              <p className="text-sm text-gray-400 mt-2">Debug: Found {featuredPosts.length} posts</p>
            </div>
          )}
        </div>
        
        {featuredPosts.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/posts" className="btn-secondary">
              View All Posts →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}