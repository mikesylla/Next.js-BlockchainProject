// src/app/posts/[slug]/page.tsx - Fixed version
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, markdownToHtml } from '../../../../lib/markdown';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Await params as required by Next.js 15
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const content = await markdownToHtml(post.content);

    return (
      <article className="max-w-4xl mx-auto">
        <header className="glass-card p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white-10 text-sm rounded-full text-blue-400">
                {tag}
              </span>
            ))}
            {post.difficulty && (
              <span className={`px-3 py-1 text-sm rounded-full ${
                post.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                post.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {post.difficulty}
              </span>
            )}
          </div>
          
          <div className="text-gray-400">
            {post.date} • {post.author}
          </div>
        </header>

        <div className="glass-card p-8">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="mt-8 text-center">
          <Link href="/posts" className="btn-secondary">
            ← Back to All Posts
          </Link>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}