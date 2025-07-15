import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

// Configurable content root
const CONTENT_ROOT = process.env.CONTENT_ROOT || path.join(process.cwd(), 'content');

// Directory paths
const contentDirectory = CONTENT_ROOT;
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

// Convert markdown to HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .process(markdown);
    return result.toString();
  } catch (error) {
    console.error('Markdown processing error:', error, 'Content snippet:', markdown.slice(0, 100));
    throw new Error('Failed to process markdown content');
  }
}

// Generic function to get content by slug
async function getContentBySlug<T extends BaseContent>(
  directory: string,
  slug: string,
  contentType: ContentType
): Promise<T> {
  const fullPath = path.join(directory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${contentType} not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content); // Convert markdown to HTML

  // Clean content for excerpt by removing frontmatter and code blocks
  const cleanContent = content.replace(/```[\s\S]*?```/g, '').replace(/^---[\s\S]*?---/, '');
  
  // Validate and normalize date
  const parsedDate = data.date 
    ? new Date(data.date).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  const baseContent = {
    slug,
    title: data.title || 'Untitled',
    date: parsedDate,
    author: data.author,
    tags: data.tags || [],
    image: data.image,
    excerpt: data.excerpt || cleanContent.slice(0, 150).trim() + '...',
    content: htmlContent,
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
async function getAllContent<T extends BaseContent>(
  directory: string,
  contentType: ContentType
): Promise<T[]> {
  const fileNames = getMarkdownFiles(directory);
  const allContent = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getContentBySlug<T>(directory, slug, contentType);
    })
  );
  return allContent.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// POSTS FUNCTIONS
export async function getAllPosts(): Promise<PostData[]> {
  return getAllContent<PostData>(postsDirectory, 'posts');
}

export async function getPostBySlug(slug: string): Promise<PostData> {
  return getContentBySlug<PostData>(postsDirectory, slug, 'posts');
}

export async function getAllPostSlugs() {
  const fileNames = getMarkdownFiles(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export async function getFeaturedPosts(limit: number = 3): Promise<PostData[]> {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, limit);
}

// TUTORIALS FUNCTIONS
export async function getAllTutorials(): Promise<TutorialData[]> {
  return getAllContent<TutorialData>(tutorialsDirectory, 'tutorials');
}

export async function getTutorialBySlug(slug: string): Promise<TutorialData> {
  return getContentBySlug<TutorialData>(tutorialsDirectory, slug, 'tutorials');
}

export async function getAllTutorialSlugs() {
  const fileNames = getMarkdownFiles(tutorialsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export async function getFeaturedTutorials(limit: number = 3): Promise<TutorialData[]> {
  const allTutorials = await getAllTutorials();
  return allTutorials.slice(0, limit);
}

// COURSES FUNCTIONS
export async function getAllCourses(): Promise<CourseData[]> {
  return getAllContent<CourseData>(coursesDirectory, 'courses');
}

export async function getCourseBySlug(slug: string): Promise<CourseData> {
  return getContentBySlug<CourseData>(coursesDirectory, slug, 'courses');
}

export async function getAllCourseSlugs() {
  const fileNames = getMarkdownFiles(coursesDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export async function getFeaturedCourses(limit: number = 3): Promise<CourseData[]> {
  const allCourses = await getAllCourses();
  return allCourses.slice(0, limit);
}

// PAGES FUNCTIONS
export async function getPageBySlug(slug: string): Promise<PageData> {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Page not found: ${slug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);

  return {
    slug,
    title: data.title || 'Untitled',
    content: htmlContent,
    lastUpdated: data.lastUpdated,
    author: data.author,
  };
}

export async function getAllPages(): Promise<PageData[]> {
  const fileNames = getMarkdownFiles(pagesDirectory);
  return Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getPageBySlug(slug);
    })
  );
}

// SEARCH AND FILTER FUNCTIONS
export async function getContentByTag(tag: string): Promise<(PostData | TutorialData | CourseData)[]> {
  const allPosts = await getAllPosts();
  const allTutorials = await getAllTutorials();
  const allCourses = await getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  
  return allContent.filter(content => 
    content.tags?.some(t => t.toLowerCase() === tag.toLowerCase()) || false
  );
}

export async function getContentByBlockchain(blockchain: string): Promise<(PostData | TutorialData | CourseData)[]> {
  const allPosts = await getAllPosts();
  const allTutorials = await getAllTutorials();
  const allCourses = await getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  
  return allContent.filter(content => 
    content.blockchain?.some(b => b.toLowerCase() === blockchain.toLowerCase()) || false
  );
}

export async function getContentByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<(PostData | TutorialData | CourseData)[]> {
  const allPosts = await getAllPosts();
  const allTutorials = await getAllTutorials();
  const allCourses = await getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  
  return allContent.filter(content => 
    'difficulty' in content && content.difficulty === difficulty
  );
}

export async function searchContent(query: string): Promise<(PostData | TutorialData | CourseData)[]> {
  const allPosts = await getAllPosts();
  const allTutorials = await getAllTutorials();
  const allCourses = await getAllCourses();
  
  const allContent = [...allPosts, ...allTutorials, ...allCourses];
  const searchTerm = query.toLowerCase();
  
  return allContent.filter(content => 
    content.title.toLowerCase().includes(searchTerm) ||
    content.content.toLowerCase().includes(searchTerm) ||
    (content.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false)
  );
}

// Get all content for homepage/general use
export async function getAllContentForHomepage() {
  return {
    posts: await getFeaturedPosts(3),
    tutorials: await getFeaturedTutorials(3),
    courses: await getFeaturedCourses(3),
  };
}

// Get content stats
export async function getContentStats() {
  return {
    posts: (await getAllPosts()).length,
    tutorials: (await getAllTutorials()).length,
    courses: (await getAllCourses()).length,
    pages: (await getAllPages()).length,
  };
}