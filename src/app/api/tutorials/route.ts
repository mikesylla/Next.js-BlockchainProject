import { getAllTutorials } from '../../../../lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tutorials = await getAllTutorials();
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
  }
}