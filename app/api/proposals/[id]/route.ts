import { getBearerToken } from '@/helpers';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('in GET');
  try {
    const id = getBearerToken(request);

    console.log('id', id);
    if (!id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = request.url;
    const pathSegments = url.split('/');
    const proposalId = pathSegments[pathSegments.length - 1];

    console.log('in POST', proposalId);

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
