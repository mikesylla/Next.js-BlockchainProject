// src/app/courses/page.tsx
import Link from 'next/link';
import { getAllCourses } from '../../../lib/markdown';

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">All Courses</h1>
        <p className="text-xl text-gray-300">Comprehensive learning paths for blockchain mastery</p>
      </div>

      <div className="courses-two-column-grid">
        {courses.map((course) => (
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
        ))}
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