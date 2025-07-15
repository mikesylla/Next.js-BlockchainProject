// src/app/page.tsx - Updated with 2-column layouts for featured content
import Link from 'next/link';
import { getFeaturedPosts, getFeaturedTutorials, getFeaturedCourses, getPageBySlug } from '../../lib/markdown';

export default async function Home() {
  const featuredPosts = await getFeaturedPosts(3);
  const featuredTutorials = await getFeaturedTutorials(3);
  const featuredCourses = await getFeaturedCourses(2);
  
  // Try to get mission content from pages, fallback to inline content
  let missionContent = null;
  try {
    missionContent = await getPageBySlug('mission');
  } catch (error) {
    // Mission page doesn't exist, use inline content
    console.log('Mission page not found, using inline content');
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
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
              Explore Posts
            </Link>
            <Link href="/tutorials" className="btn-secondary">
              View Tutorials
            </Link>
            <Link href="/courses" className="btn-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Our Mission Module */}
      <section className="py-16">
        <div className="glass-card p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold gradient-text mb-6">
            {missionContent?.title || 'Our Mission'}
          </h2>
          {missionContent?.content ? (
  <div 
    className="text-xl text-gray-300 mb-6"
    dangerouslySetInnerHTML={{ __html: missionContent.content }} 
  />
  ) : (
  <p className="text-xl text-gray-300 mb-6">
    To democratize blockchain development knowledge and make advanced technologies accessible to developers worldwide.
  </p>
  )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl mb-2">📖</div>
              <div className="text-sm text-gray-300">
                <strong className="text-white">Open Source</strong><br/>
                All code freely available
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🛠️</div>
              <div className="text-sm text-gray-300">
                <strong className="text-white">Practical Learning</strong><br/>
                Real projects, not just theory
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm text-gray-300">
                <strong className="text-white">Community</strong><br/>
                Building together
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm text-gray-300">
                <strong className="text-white">Innovation</strong><br/>
                Cutting edge technology
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold gradient-text mb-4">Technologies I'm Exploring</h2>
        </div>
        
        <div className="tech-stack-grid">
          {[
            { name: 'Solidity', icon: '⚡', desc: 'Smart contracts for Ethereum' },
            { name: 'Cairo', icon: '🏛️', desc: 'StarkNet programming language' },
            { name: 'Scaffold-Stark', icon: '🏗️', desc: 'Rapid StarkNet development' },
            { name: 'Dojo', icon: '🎮', desc: 'Onchain game development' }
          ].map((tech, index) => (
            <div key={index} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">{tech.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
              <p className="text-gray-300 text-sm">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Content Sections */}
      
      {/* Featured Posts */}
      <section className="py-16">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold gradient-text mb-4">Latest Posts</h2>
          <p className="text-xl text-gray-300">Recent blog posts and insights</p>
        </div>
        
        <div className="featured-posts-grid">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => (
              <article key={post.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)'}}>
                  <div className="text-white text-4xl opacity-75">📝</div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 2).map((tag) => (
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
                  
                  {/* Clickable headline */}
                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-300 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-300 mb-4 text-sm">{post.excerpt}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{post.date}</span>
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
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-gray-300">Blog posts are being prepared. Check back soon!</p>
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

      {/* Featured Tutorials */}
      <section className="py-16">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold gradient-text mb-4">Featured Tutorials</h2>
          <p className="text-xl text-gray-300">Step-by-step guides to master blockchain development</p>
        </div>
        
        <div className="featured-tutorials-grid">
          {featuredTutorials.length > 0 ? (
            featuredTutorials.map((tutorial) => (
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
                    {tutorial.blockchain?.slice(0, 1).map((blockchain) => (
                      <span key={blockchain} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {blockchain}
                      </span>
                    ))}
                  </div>
                  
                  {/* Clickable headline */}
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
              <h3 className="text-xl font-bold text-white mb-2">Tutorials Coming Soon!</h3>
              <p className="text-gray-300">Step-by-step tutorials are being prepared.</p>
            </div>
          )}
        </div>
        
        {featuredTutorials.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/tutorials" className="btn-secondary">
              View All Tutorials →
            </Link>
          </div>
        )}
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold gradient-text mb-4">Featured Courses</h2>
          <p className="text-xl text-gray-300">Comprehensive learning paths for blockchain mastery</p>
        </div>
        
        <div className="featured-courses-grid">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <article key={course.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, #f59e0b, #d97706)'}}>
                  <div className="text-white text-4xl opacity-75">🎓</div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
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
                  
                  {/* Clickable headline */}
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
              <h3 className="text-xl font-bold text-white mb-2">Courses Coming Soon!</h3>
              <p className="text-gray-300">Comprehensive courses are being developed.</p>
            </div>
          )}
        </div>
        
        {featuredCourses.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/courses" className="btn-secondary">
              View All Courses →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}