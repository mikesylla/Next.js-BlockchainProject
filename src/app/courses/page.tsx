// src/app/courses/page.tsx
import Link from 'next/link';
import { getAllCourses } from '../../../lib/markdown';

export default function CoursesPage() {
  const allCourses = getAllCourses();

  // Get unique categories, difficulties, and blockchain technologies
  const categories = [...new Set(allCourses.map(course => course.category).filter(Boolean))];
  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
  const blockchains = [...new Set(allCourses.flatMap(course => course.blockchain || []))];

  // Calculate stats
  const freeCoursesCount = allCourses.filter(course => !course.price || course.price === 0).length;
  const totalChapters = allCourses.reduce((sum, course) => sum + (course.chapters || 0), 0);

  return (
    <div className="container mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text mb-4">Courses</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Comprehensive learning paths for blockchain mastery
        </p>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 mb-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-orange-400">{allCourses.length}</div>
            <div className="text-gray-300">Total Courses</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{freeCoursesCount}</div>
            <div className="text-gray-300">Free Courses</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">{totalChapters}</div>
            <div className="text-gray-300">Total Chapters</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">{blockchains.length}</div>
            <div className="text-gray-300">Blockchains</div>
          </div>
        </div>
      </div>

      {/* Filter by Difficulty */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Difficulty</h2>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/courses"
            className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            All Courses
          </Link>
          {difficulties.map(difficulty => (
            <Link 
              key={difficulty} 
              href={`/courses?difficulty=${difficulty}`}
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

      {/* Filter by Price */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Price</h2>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/courses?price=free"
            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm hover:bg-green-500/30 transition-colors"
          >
            Free
          </Link>
          <Link 
            href="/courses?price=paid"
            className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm hover:bg-orange-500/30 transition-colors"
          >
            Paid
          </Link>
        </div>
      </div>

      {/* Filter by Blockchain */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Filter by Blockchain</h2>
        <div className="flex flex-wrap gap-2">
          {blockchains.map(blockchain => (
            <Link 
              key={blockchain} 
              href={`/courses?blockchain=${blockchain}`}
              className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
            >
              {blockchain}
            </Link>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allCourses.length > 0 ? (
          allCourses.map((course) => (
            <article key={course.slug} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="h-48 flex items-center justify-center relative" style={{background: 'linear-gradient(to bottom right, #f59e0b, #d97706)'}}>
                <div className="text-white text-4xl opacity-75">🎓</div>
                {course.price && course.price > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${course.price}
                  </div>
                )}
                {(!course.price || course.price === 0) && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    FREE
                  </div>
                )}
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
                  {course.category && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      {course.category}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{course.excerpt}</p>
                
                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Prerequisites:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {course.prerequisites.slice(0, 2).map((prereq, index) => (
                        <li key={index}>• {prereq}</li>
                      ))}
                      {course.prerequisites.length > 2 && (
                        <li>• +{course.prerequisites.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {/* Blockchain Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.blockchain?.slice(0, 2).map((blockchain) => (
                    <span key={blockchain} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      {blockchain}
                    </span>
                  ))}
                  {course.blockchain && course.blockchain.length > 2 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                      +{course.blockchain.length - 2} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{course.date}</span>
                    {course.author && (
                      <span className="text-xs text-gray-500">by {course.author}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {course.price && course.price > 0 && (
                      <span className="text-lg font-semibold text-orange-400">
                        ${course.price}
                      </span>
                    )}
                    <Link 
                      href={`/courses/${course.slug}`}
                      className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors"
                    >
                      {course.price && course.price > 0 ? 'Enroll Now' : 'Start Free'} →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-card p-8 text-center col-span-full">
            <h3 className="text-xl font-bold text-white mb-2">No Courses Found</h3>
            <p className="text-gray-300">Check back soon for new courses!</p>
          </div>
        )}
      </div>

      {/* Featured Course Banner */}
      {allCourses.length > 0 && (
        <div className="glass-card p-8 text-center mt-12">
          <h2 className="text-2xl font-bold gradient-text mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of developers mastering blockchain technology through our comprehensive courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses?difficulty=beginner" className="btn-primary">
              Start with Beginner Courses
            </Link>
            <Link href="/tutorials" className="btn-secondary">
              Try Free Tutorials First
            </Link>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link href="/" className="btn-secondary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}