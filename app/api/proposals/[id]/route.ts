import { getBearerToken } from '@/helpers';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const id = getBearerToken(request);

    if (!id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = request.url;
    const pathSegments = url.split('/');
    const proposalId = pathSegments[pathSegments.length - 1];

    const { rows } = await sql`
      SELECT *
      FROM proposal
      WHERE id = ${proposalId};
    `;

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const id = getBearerToken(request);

    if (!id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      proposalId,
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
      UPDATE proposal
      SET
        event_title = ${eventTitle},
        event_date = ${eventDate},
        amount_of_guests = ${amountOfGuests},
        client_company_name = ${clientCompanyName},
        client_name = ${clientName},
        client_phone_number = ${clientPhoneNumber},
        client_email = ${clientEmail},
        description_md = ${description},
        total_cost = ${totalPrice},
        blocks = jsonb_insert('{}', '{packages}', ${JSON.stringify(
          packages,
        )}, true),
        updated_at = NOW()
      WHERE id = ${proposalId}
      RETURNING *;
    `;

    revalidatePath('/', 'layout');
    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
