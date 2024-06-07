import React from 'react';
import { checkIsAuthorized, getSession } from '@/helpers';
import Navbar from '../components/Navbar';
import RegisterToHotels from '../components/RegisterToHotels';
import Link from 'next/link';

const Dashboard = async () => {
  await checkIsAuthorized();
  const { id } = await getSession();

  let hotelUsersData;
  let proposalData;

  try {
    const [hotelUsersResponse, proposalResponse] = await Promise.all([
      fetch('http://localhost:3000/api/hotel-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${id}`,
        },
      }),
      fetch('http://localhost:3000/api/proposals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${id}`,
        },
      }),
    ]);

    hotelUsersData = await hotelUsersResponse.json();
    proposalData = await proposalResponse.json();
  } catch (error) {
    console.error('error', error);
  }

  console.log('hotelUsersData', hotelUsersData);

  if (hotelUsersData.rows.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 pt-12 text-white">
          <div className="flex-1 flex flex-col gap-6">
            <RegisterToHotels />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 pt-12 text-white">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-center font-bold text-4xl mb-4">
            Manage Your Proposals
          </h2>
          {proposalData.rows.length === 0 ? (
            <>
              <h3 className="text-2xl mt-12 text-center">
                Currently No Proposals
              </h3>
              <Link
                className="text-center mt-12 py-2 bg-emerald-500 hover:bg-emerald-800 transition-all duration-200"
                href={'/proposal/create'}
              >
                Create New Proposal
              </Link>
            </>
          ) : (
            <p>view proposals</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
