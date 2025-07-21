// components/RelatedContent.tsx
import Link from 'next/link';
import { PostData, TutorialData, CourseData } from '../lib/markdown';

export default function RelatedContent({ 
  content, 
  type 
}: { 
  content: (PostData | TutorialData | CourseData)[];
  type: 'posts' | 'tutorials' | 'courses';
}) {
  if (content.length === 0) return null;

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold gradient-text mb-6">Related {type}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {content.slice(0, 2).map((item) => (
          <Link key={item.slug} href={`/${type}/${item.slug}`}>
            <div className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer">
              <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-gray-300 text-sm">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}