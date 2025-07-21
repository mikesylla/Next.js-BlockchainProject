// src/app/api/posts/route.ts - API route to fetch posts for client-side filtering
import { getAllPosts } from '../../../../lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}