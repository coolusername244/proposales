import React from 'react';
import Link from 'next/link';

import { getSession } from '@/helpers';
import ProposalForm from '@/app/components/ProposalForm';

const EditProposal = async ({ params }: { params: { id: string } }) => {
  const { id } = await getSession();
  const proposalResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/${params.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${id}`,
      },
    },
  );

  const { rows } = await proposalResponse.json();
  const proposalData = rows[0];

  const hotelDataResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/${proposalData.hotel_id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${id}`,
      },
    },
  );

  const hotelData = (await hotelDataResponse.json()).rows[0];

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
          <h2 className="text-center font-bold text-4xl mb-4">Edit Proposal</h2>
          <ProposalForm
            hotelData={hotelData}
            proposalData={proposalData}
            userId={id}
          />
        </div>
      </div>
    </>
  );
};

export default EditProposal;
