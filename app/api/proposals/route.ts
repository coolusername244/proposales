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
      SELECT *
      FROM proposal;
    `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const id = getBearerToken(request);
    if (!id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      hotelId,
      eventTitle,
      eventDate,
      amountOfGuests,
      clientCompanyName,
      clientName,
      clientPhoneNumber,
      clientEmail,
      description,
      totalPrice,
      packages,
    } = body;

    const { rows } = await sql`
      INSERT INTO proposal (
        hotel_id,
        event_title,
        event_date,
        amount_of_guests,
        user_id,
        client_company_name,
        client_name,
        client_phone_number,
        client_email,
        description_md,
        total_cost,
        blocks
      )
      VALUES (
        ${hotelId},
        ${eventTitle},
        ${eventDate},
        ${amountOfGuests},
        ${id},
        ${clientCompanyName},
        ${clientName},
        ${clientPhoneNumber},
        ${clientEmail},
        ${description},
        ${totalPrice},
        jsonb_insert('{}', '{packages}', ${JSON.stringify(packages)}, true)
      )
        RETURNING *;
    `;

    return NextResponse.json({ rows }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
