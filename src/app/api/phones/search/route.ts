import { NextRequest, NextResponse } from 'next/server';
import { searchPhones } from '@/queries/phones';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) {
    return NextResponse.json({ phones: [] });
  }
  const { phones } = await searchPhones(q, 1, 8);
  return NextResponse.json({ phones });
}