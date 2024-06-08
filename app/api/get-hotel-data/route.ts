import { getBearerToken } from '@/helpers';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const id = getBearerToken(request);
    if (!id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await sql`
    SELECT hu.*, h.name AS hotel_name
    FROM hotel_user hu
    INNER JOIN hotel h ON hu.hotel_id = h.id
    WHERE user_id = ${id};
  `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
