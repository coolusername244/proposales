import React from 'react';
import Link from 'next/link';

import { getSession } from '@/helpers';
import ProposalForm from '@/app/components/ProposalForm';

const CreateNewProposal = async ({
  searchParams,
}: {
  searchParams: { hotelId: string };
}) => {
  const { id } = await getSession();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/${searchParams.hotelId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${id}`,
      },
    },
  );
  const { rows } = await response.json();
  const hotelData = rows[0];

  return (
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
        </svg>
        Back
      </Link>
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 pt-12 text-white">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-center font-bold text-4xl mb-4">
            Create New Proposal
          </h2>
          <ProposalForm hotelData={hotelData} userId={id} />
        </div>
      </div>
    </>
  );
};

export default CreateNewProposal;
