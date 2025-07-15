// src/app/posts/[slug]/page.tsx - Fixed version
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs } from '../../../../lib/markdown';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.params.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Await params as required by Next.js 15
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    return (
      <article className="max-w-4xl mx-auto">
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/posts" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Posts
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/10 text-sm rounded-full text-blue-400">
                  #{tag}
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
              {post.blockchain?.map((blockchain) => (
                <span key={blockchain} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                  {blockchain}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold gradient-text mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
              <span>{post.date}</span>
              {post.author && <span>By {post.author}</span>}
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>
            )}
          </div>

          {post.github && (
            <div className="mb-6">
              <a 
                href={post.github} 
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
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    notFound();
  }
}