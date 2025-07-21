// src/components/RelatedContent.tsx
import Link from 'next/link';
import { PostData, TutorialData, CourseData } from '../../lib/markdown';

export default function RelatedContent({ 
  content, 
  type 
}: { 
  content: (PostData | TutorialData | CourseData)[];
  type: 'posts' | 'tutorials' | 'courses';
}) {
  if (content.length === 0) return null;

  const getIcon = () => {
    switch (type) {
      case 'posts': return '📝';
      case 'tutorials': return '📚';
      case 'courses': return '🎓';
      default: return '📄';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'posts': return 'text-blue-400 hover:text-blue-300';
      case 'tutorials': return 'text-green-400 hover:text-green-300';
      case 'courses': return 'text-orange-400 hover:text-orange-300';
      default: return 'text-gray-400 hover:text-gray-300';
    }
  };

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold gradient-text mb-6">
        Related {type.charAt(0).toUpperCase() + type.slice(1)}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.slice(0, 3).map((item) => (
          <Link key={item.slug} href={`/${type}/${item.slug}`}>
            <div className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getIcon()}</div>
                <div className="flex-1">
                  <h4 className={`text-lg font-semibold mb-2 transition-colors ${getColor()}`}>
                    {item.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-2">{item.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{item.date}</span>
                    {'difficulty' in item && item.difficulty && (
                      <>
                        <span>•</span>
                        <span className={`${
                          item.difficulty === 'beginner' ? 'text-green-400' :
                          item.difficulty === 'intermediate' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {item.difficulty}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}