// lib/markdown.ts - Updated for new folder structure
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

// Directory paths
const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');
const pagesDirectory = path.join(contentDirectory, 'pages');
const tutorialsDirectory = path.join(contentDirectory, 'tutorials');
const coursesDirectory = path.join(contentDirectory, 'courses');

// Base content interface
interface BaseContent {
  slug: string;
  title: string;
  date: string;
  author?: string;
  tags?: string[];
  image?: string;
  excerpt?: string;
  content: string;
}

// Post-specific interface
export interface PostData extends BaseContent {
  github?: string;
  blockchain?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// Tutorial-specific interface
export interface TutorialData extends BaseContent {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  prerequisites?: string[];
  github?: string;
  blockchain: string[];
  category?: string;
}

// Course-specific interface
export interface CourseData extends BaseContent {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  prerequisites?: string[];
  chapters?: number;
  price?: number;
  github?: string;
  blockchain: string[];
  category?: string;
}

// Static page interface
export interface PageData {
  slug: string;
  title: string;
  content: string;
  lastUpdated?: string;
  author?: string;
}

// Content type enum
export type ContentType = 'posts' | 'pages' | 'tutorials' | 'courses';

// Helper function to ensure directory exists
function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper function to get all files from a directory
function getMarkdownFiles(directory: string): string[] {
  ensureDirectoryExists(directory);
  const fileNames = fs.readdirSync(directory);
  return fileNames.filter(fileName => fileName.endsWith('.md'));
}

// Generic function to get content by slug
function getContentBySlug<T extends BaseContent>(
  directory: string,
  slug: string,
  contentType: ContentType
): T {
  const fullPath = path.join(directory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${contentType} not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const baseContent = {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    author: data.author,
    tags: data.tags || [],
    image: data.image,
    excerpt: data.excerpt || content.slice(0, 150) + '...',
    content,
  };

  // Add type-specific fields
  if (contentType === 'tutorials' || contentType === 'courses') {
    return {
      ...baseContent,
      difficulty: data.difficulty || 'beginner',
      estimatedTime: data.estimatedTime,
      prerequisites: data.prerequisites || [],
      github: data.github,
      blockchain: data.blockchain || [],
      category: data.category,
      ...(contentType === 'courses' && {
        chapters: data.chapters,
        price: data.price,
      }),
    } as T;
  }

  if (contentType === 'posts') {
    return {
      ...baseContent,
      github: data.github,
      blockchain: data.blockchain || [],
      difficulty: data.difficulty,
    } as T;
  }

  return baseContent as T;
}

// Generic function to get all content from a directory
function getAllContent<T extends BaseContent>(
  directory: string,
  contentType: ContentType
): T[] {
  const fileNames = getMarkdownFiles(directory);
  const allContent = fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getContentBySlug<T>(directory, slug, contentType);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return allContent;
}

// POSTS FUNCTIONS
export function getAllPosts(): PostData[] {
  return getAllContent<PostData>(postsDirectory, 'posts');
}

export function getPostBySlug(slug: string): PostData {
  return getContentBySlug<PostData>(postsDirectory, slug, 'posts');
}

export function getAllPostSlugs() {
  const fileNames = getMarkdownFiles(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export function getFeaturedPosts(limit: number = 3): PostData[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

// TUTORIALS FUNCTIONS
export function getAllTutorials(): TutorialData[] {
  return getAllContent<TutorialData>(tutorialsDirectory, 'tutorials');
}

export function getTutorialBySlug(slug: string): TutorialData {
  return getContentBySlug<TutorialData>(tutorialsDirectory, slug, 'tutorials');
}

export function getAllTutorialSlugs() {
  const fileNames = getMarkdownFiles(tutorialsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export function getFeaturedTutorials(limit: number = 3): TutorialData[] {
  const allTutorials = getAllTutorials();
  return allTutorials.slice(0, limit);
}

// COURSES FUNCTIONS
export function getAllCourses(): CourseData[] {
  return getAllContent<CourseData>(coursesDirectory, 'courses');
}

export function getCourseBySlug(slug: string): CourseData {
  return getContentBySlug<CourseData>(coursesDirectory, slug, 'courses');
}

export function getAllCourseSlugs() {
  const fileNames = getMarkdownFiles(coursesDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export function getFeaturedCourses(limit: number = 3): CourseData[] {
  const allCourses = getAllCourses();
  return allCourses.slice(0, limit);
}

// PAGES FUNCTIONS
export function getPageBySlug(slug: string): PageData {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Page not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || 'Untitled',
    content,
    lastUpdated: data.lastUpdated,
    author: data.author,
  };
}

export function getAllPages(): PageData[] {
  const fileNames = getMarkdownFiles(pagesDirectory);
  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    return getPageBySlug(slug);
  });
}

// SEARCH AND FILTER FUNCTIONS
export function getContentByTag(tag: string): (PostData | TutorialData | CourseData)[] {
  const allPosts = getAllPosts();
  const allTutorials = getAllTutorials();
  const allCourses = getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  
  return allContent.filter(content => 
    content.tags && content.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getContentByBlockchain(blockchain: string): (PostData | TutorialData | CourseData)[] {
  const allPosts = getAllPosts();
  const allTutorials = getAllTutorials();
  const allCourses = getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  
  return allContent.filter(content => 
    'blockchain' in content && content.blockchain && 
    content.blockchain.some(b => b.toLowerCase() === blockchain.toLowerCase())
  );
}

export function getContentByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): (PostData | TutorialData | CourseData)[] {
  const allPosts = getAllPosts();
  const allTutorials = getAllTutorials();
  const allCourses = getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  
  return allContent.filter(content => 
    'difficulty' in content && content.difficulty === difficulty
  );
}

export function searchContent(query: string): (PostData | TutorialData | CourseData)[] {
  const allPosts = getAllPosts();
  const allTutorials = getAllTutorials();
  const allCourses = getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  const searchTerm = query.toLowerCase();
  
  return allContent.filter(content => 
    content.title.toLowerCase().includes(searchTerm) ||
    content.content.toLowerCase().includes(searchTerm) ||
    (content.tags && content.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
  );
}

// UTILITY FUNCTIONS
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(markdown);

    return result.toString();
  } catch (error) {
    console.error('Markdown processing error:', error);
    return markdown
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>');
  }
}

// Get all content for homepage/general use
export function getAllContentForHomepage() {
  return {
    posts: getFeaturedPosts(3),
    tutorials: getFeaturedTutorials(3),
    courses: getFeaturedCourses(3),
  };
}

// Get content stats
export function getContentStats() {
  return {
    posts: getAllPosts().length,
    tutorials: getAllTutorials().length,
    courses: getAllCourses().length,
    pages: getAllPages().length,
  };
}