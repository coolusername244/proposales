import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = request.url;
  const pathSegments = url.split('/');
  const id = pathSegments[pathSegments.length - 1];

  try {
    const { rows } = await sql`
      SELECT *
      FROM hotel
      WHERE id = ${id};
    `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
