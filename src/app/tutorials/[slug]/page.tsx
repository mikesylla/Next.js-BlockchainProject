// src/app/tutorials/[slug]/page.tsx
import { getTutorialBySlug, getAllTutorialSlugs } from '../../../../lib/markdown';
import Link from 'next/link';

export async function generateStaticParams() {
  const slugs = await getAllTutorialSlugs();
  return slugs.map((slug) => ({
    slug: slug.params.slug,
  }));
}

export default async function TutorialPage({ params }: { params: { slug: string } }) {
  const tutorial = await getTutorialBySlug(params.slug);

  return (
    <article className="max-w-4xl mx-auto">
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/tutorials" className="text-green-400 hover:text-green-300 transition-colors">
            ← Back to Tutorials
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-sm rounded-full ${
              tutorial.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
              tutorial.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {tutorial.difficulty}
            </span>
            {tutorial.estimatedTime && (
              <span className="px-3 py-1 bg-white/10 text-sm rounded-full text-gray-300">
                {tutorial.estimatedTime}
              </span>
            )}
            {tutorial.blockchain?.map((blockchain) => (
              <span key={blockchain} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                {blockchain}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold gradient-text mb-4">{tutorial.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
            <span>{tutorial.date}</span>
            {tutorial.author && <span>By {tutorial.author}</span>}
          </div>

          {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">Prerequisites:</h3>
              <ul className="text-gray-300 text-sm">
                {tutorial.prerequisites.map((prereq, index) => (
                  <li key={index}>• {prereq}</li>
                ))}
              </ul>
            </div>
          )}

          {tutorial.tags && tutorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tutorial.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/10 text-xs rounded-full text-blue-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {tutorial.github && (
          <div className="mb-6">
            <a 
              href={tutorial.github} 
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
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tutorial.content }} />
      </div>
    </article>
  );
}