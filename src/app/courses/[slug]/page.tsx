// src/app/courses/[slug]/page.tsx
import { getCourseBySlug, getAllCourseSlugs } from '../../../../lib/markdown';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs();
  return slugs.map((slug) => ({
    slug: slug.params.slug,
  }));
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);

  return (
    <article className="max-w-4xl mx-auto">
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/courses" className="text-orange-400 hover:text-orange-300 transition-colors">
            ← Back to Courses
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-sm rounded-full ${
              course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
              course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {course.difficulty}
            </span>
            {course.chapters && (
              <span className="px-3 py-1 bg-white/10 text-sm rounded-full text-gray-300">
                {course.chapters} chapters
              </span>
            )}
            {course.estimatedTime && (
              <span className="px-3 py-1 bg-white/10 text-sm rounded-full text-gray-300">
                {course.estimatedTime}
              </span>
            )}
            {course.blockchain?.map((blockchain) => (
              <span key={blockchain} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                {blockchain}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold gradient-text mb-4">{course.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
            <span>{course.date}</span>
            {course.author && <span>By {course.author}</span>}
            {course.price && (
              <span className="text-lg font-semibold text-orange-400">
                ${course.price}
              </span>
            )}
          </div>

          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {course.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/10 text-xs rounded-full text-blue-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {course.github && (
          <div className="mb-6">
            <a 
              href={course.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View Source Code →
            </a>
          </div>
        )}
      </div>

      <div className="glass-card p-8">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.content }} />
      </div>
    </article>
  );
}