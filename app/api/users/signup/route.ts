import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const apiToken = uuidv4();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows } = await sql`
      INSERT INTO users (email, hashed_password, api_token)
      VALUES (${email}, ${hashedPassword}, ${apiToken})
      RETURNING *;
    `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unable To Authenticate' },
      { status: 500 },
    );
  }
}
