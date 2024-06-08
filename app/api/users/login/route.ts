import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const { rows } = await sql`
      SELECT * 
      FROM users
      WHERE email = ${email};
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const newApiToken = uuidv4();

    const response = await sql`
      UPDATE users
      SET api_token = ${newApiToken}
      WHERE email = ${email}
      RETURNING *;
    `;

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Unable To Authenticate' },
      { status: 500 },
    );
  }
}
