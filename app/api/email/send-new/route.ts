import NewProposalEmailTemplate from '@/app/components/NewProposalEmailTemplate';
import { getBearerToken } from '@/helpers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const id = getBearerToken(request);
  if (!id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const {
      hotelName,
      eventTitle,
      eventDate,
      amountOfGuests,
      clientCompanyName,
      clientName,
      clientEmail,
      packages,
      totalPrice,
    } = body;

    const { data, error } = await resend.emails.send({
      from: 'Proposales <onboarding@resend.dev>',
      to: [clientEmail],
      subject: 'Your new proposal',
      react: NewProposalEmailTemplate({
        hotelName,
        eventTitle,
        eventDate,
        amountOfGuests,
        clientCompanyName,
        clientName,
        clientEmail,
        packages,
        totalPrice,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
