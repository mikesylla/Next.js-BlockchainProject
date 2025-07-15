// src/app/tutorials/page.tsx
import Link from 'next/link';
import { getAllTutorials } from '../../../lib/markdown';

export default async function TutorialsPage() {
  const tutorials = await getAllTutorials();

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">All Tutorials</h1>
        <p className="text-xl text-gray-300">Step-by-step guides to master blockchain development</p>
      </div>

      <div className="tutorials-two-column-grid">
        {tutorials.map((tutorial) => (
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