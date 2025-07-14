// lib/markdown.ts - Fixed version with simpler markdown processing
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const staticDirectory = path.join(process.cwd(), 'content/static');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  author?: string;
  tags?: string[];
  image?: string;
  excerpt?: string;
  github?: string;
  blockchain?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  content: string;
}

export interface StaticContent {
  slug: string;
  title: string;
  content: string;
  type: 'page' | 'module';
}

// Get all blog posts
export function getAllPosts(): PostData[] {
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getPostBySlug(slug);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return allPostsData;
}

// Get a single post by slug
export function getPostBySlug(slug: string): PostData {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    author: data.author,
    tags: data.tags || [],
    image: data.image,
    excerpt: data.excerpt || content.slice(0, 150) + '...',
    github: data.github,
    blockchain: data.blockchain || [],
    difficulty: data.difficulty,
    content,
  };
}

// Get all post slugs
export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => ({
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }));
}

// Get static content (pages and modules)
export function getStaticContent(type: 'pages' | 'modules', slug: string): StaticContent {
  const contentPath = path.join(staticDirectory, type, `${slug}.md`);
  
  if (!fs.existsSync(contentPath)) {
    throw new Error(`Static content not found: ${type}/${slug}`);
  }
  
  const fileContents = fs.readFileSync(contentPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || 'Untitled',
    content,
    type: type === 'pages' ? 'page' : 'module',
  };
}

// Simplified markdown to HTML conversion
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(remarkHtml, { sanitize: false }) // Allow HTML in markdown
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error('Markdown processing error:', error);
    // Fallback: return basic HTML with line breaks
    return markdown
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>');
  }
}

// Get featured posts (latest 3 posts)
export function getFeaturedPosts(limit: number = 3): PostData[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

// Get posts by tag
export function getPostsByTag(tag: string): PostData[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get posts by blockchain technology
export function getPostsByBlockchain(blockchain: string): PostData[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.blockchain && post.blockchain.some(b => b.toLowerCase() === blockchain.toLowerCase())
  );
}

// Search posts by title and content
export function searchPosts(query: string): PostData[] {
  const allPosts = getAllPosts();
  const searchTerm = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
  );
}