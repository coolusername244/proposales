import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getBearerToken } from '@/helpers';

export async function GET(request: Request) {
  try {
    const id = getBearerToken(request);
    if (!id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // const { rows } = await sql`
    //   SELECT * FROM hotel_user
    //   WHERE user_id = ${id};
    // `;
    const { rows } = await sql`
        SELECT hotel_user.*, hotel.name AS hotel_name
        FROM hotel_user hotel_user
        INNER JOIN hotel ON hotel_user.hotel_id = hotel.id
        WHERE user_id = ${id};
    `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, hotelIds } = body;

    const { rows } = await hotelIds.map(async (id: number) => {
      await sql`
          INSERT INTO hotel_user (user_id, hotel_id)
          VALUES (${userId}, ${id});
        `;
    });

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
