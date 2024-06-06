import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const { rows } = await sql`
      UPDATE users
      SET api_token = NULL
      WHERE email = ${email};
    `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
