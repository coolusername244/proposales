import { checkIsAuthorized, getSession } from '@/helpers';
import Link from 'next/link';
import React from 'react';
export const dynamic = 'force-dynamic';
const Proposal = async ({ params }: { params: { id: string } }) => {
  await checkIsAuthorized();
  const { id }: { id: string } = await getSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/${params.id}`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${id}`,
      },
    },
  );

  const proposal = (await response.json()).rows[0];

  return (
    <div className="flex-1 flex flex-col gap-20 w-[60vw] px-3 pt-12 text-white">
      {id && (
        <>
          <Link
            href="/dashboard"
            className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-white bg-slate-800 hover:bg-slate-900 transition-all duration-200 flex items-center group text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>{' '}
            Back
          </Link>
          <Link
            href={`/proposal/${params.id}/edit`}
            className="absolute right-8 top-8 py-2 px-4 rounded-md no-underline text-white bg-emerald-500 hover:bg-emerald-800 transition-all duration-200 flex items-center group text-sm"
          >
            Edit{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </>
      )}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-4xl text-center pb-12">{proposal.event_title}</h1>
        <div className="flex justify-between">
          <div className="w-1/2">
            <h2 className="text-2xl pb-6">Company Details:</h2>
            <p>Company Name: {proposal.client_company_name}</p>
            <p>Company Contact Person: {proposal.client_name}</p>
            <p>Company Contact Email: {proposal.client_email}</p>
            <p>Company Contact Phone: {proposal.client_phone_number}</p>
            <h2 className="text-2xl pb-6 pt-12">Event Details:</h2>
            <p>Date: {proposal.event_date}</p>
            <p>Amount of Guests: {proposal.amount_of_guests}</p>
            <p>Description: {proposal.description_md}</p>
            <p>Total Cost: {proposal.total_cost}KR</p>
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl pb-6">Packages:</h2>
            {proposal.blocks.packages.map((block: any) => (
              <div key={block.name} className="pb-6">
                <div className="space-y-2 ml-6">
                  <h4 className="text-xl text-white">{block.name}</h4>
                  <p className="ml-6">{block.description}</p>
                  <p className="text-white text-lg">
                    {block.packageTotalPrice}KR
                    {block.unitPrice
                      ? ` - ${block.unitPrice}kr/unit (${block.quantity})`
                      : ''}
                  </p>
                  <p></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal;
