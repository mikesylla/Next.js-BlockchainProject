// src/app/posts/[slug]/page.tsx - Add reading progress and related content
import { getPostBySlug, getAllPostSlugs, getAllPosts } from '../../../../lib/markdown';
import ReadingProgress from '../../../components/ReadingProgress';
import RelatedContent from '../../../components/RelatedContent';
import SocialSharing from '../../../components/SocialSharing';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  
  // Get related posts (same tags or blockchain)
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .filter(p => 
      (post.tags && p.tags?.some(tag => post.tags!.includes(tag))) ||
      (post.blockchain && p.blockchain?.some(blockchain => post.blockchain!.includes(blockchain)))
    )
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />
      
      <article className="container mx-auto py-16 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/posts" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Posts
          </Link>
        </nav>

        {/* Post Header */}
        <header className="mb-12 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/10 text-sm rounded-full text-blue-400">
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
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex justify-center items-center gap-4 text-gray-400">
            <span>{post.date}</span>
            {post.author && (
              <>
                <span>•</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>

          {/* Blockchain tags */}
          {post.blockchain && post.blockchain.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {post.blockchain.map((blockchain) => (
                <span key={blockchain} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                  {blockchain}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* GitHub Link */}
        {post.github && (
          <div className="mt-12 p-6 glass-card">
            <h3 className="text-xl font-bold text-white mb-4">📁 Source Code</h3>
            <a 
              href={post.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>View on GitHub</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}

        {/* Social Sharing */}
        <SocialSharing title={post.title} />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="container mx-auto max-w-4xl pb-16">
          <RelatedContent content={relatedPosts} type="posts" />
        </div>
      )}
    </>
  );
}