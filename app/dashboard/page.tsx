import React from 'react';
import { checkIsAuthorized, getSession } from '@/helpers';
import Navbar from '../components/Navbar';
import RegisterToHotels from '../components/RegisterToHotels';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type HotelResponse = {
  id: string;
  user_id: string;
  hotel_id: string;
  hotel_name: string;
}[];

type ProposalResponse = {
  id: string;
  hotel_id: string;
  event_title: string;
  event_date: string;
  client_company_name: string;
  client_name: string;
  client_phone_number: string;
}[];

const Dashboard = async () => {
  await checkIsAuthorized();
  const { id }: { id: string } = await getSession();

  let hotelUsersData: HotelResponse = [];
  let proposalData: ProposalResponse = [];

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
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${id}`,
        },
      }),
    ]);

    ({ rows: hotelUsersData } = await hotelUsersResponse.json());
    ({ rows: proposalData } = await proposalResponse.json());
  } catch (error) {
    console.log('THIS IS THE ERROR', error);
  }

  if (!hotelUsersData.length) {
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
      <div className="flex-1 flex flex-col gap-20 w-[70vw] px-3 pt-12 text-white">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-center font-bold text-4xl mb-4">
            Manage Your Proposals
          </h2>
          {hotelUsersData.map(hotel => {
            const hotelProposals = proposalData.filter(
              proposal => proposal.hotel_id === hotel.hotel_id,
            );
            return (
              <div key={hotel.id} className="flex flex-col gap-6 pb-24">
                <div className="flex justify-between px-24 pb-12">
                  <h3 className="text-2xl">{hotel.hotel_name}</h3>
                  <Link
                    className="text-center px-2 py-1 bg-emerald-500 hover:bg-emerald-800 transition-all duration-200"
                    href={{
                      pathname: '/proposal/create',
                      query: { hotelId: hotel.hotel_id },
                    }}
                  >
                    Create New Proposal
                  </Link>
                </div>
                <div className="flex flex-col gap-6">
                  {hotelProposals.length > 0 ? (
                    <Table className="text-center border">
                      <TableHeader>
                        <TableRow className="hover:bg-slate-800 bg-slate-800">
                          <TableHead className="text-white text-lg text-center">
                            Event Title
                          </TableHead>
                          <TableHead className="text-white text-lg text-center">
                            Client Company Name
                          </TableHead>
                          <TableHead className="text-white text-lg text-center">
                            Client Name
                          </TableHead>
                          <TableHead className="text-white text-lg text-center">
                            Client Phone Number
                          </TableHead>
                          <TableHead className="text-white text-lg text-center">
                            Date
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hotelProposals.map(proposal => (
                          <TableRow key={proposal.id}>
                            <TableCell>{proposal.event_title}</TableCell>
                            <TableCell>
                              {proposal.client_company_name}
                            </TableCell>
                            <TableCell>{proposal.client_name}</TableCell>
                            <TableCell>
                              {proposal.client_phone_number}
                            </TableCell>
                            <TableCell>{proposal.event_date}</TableCell>
                            <TableCell>
                              <Link
                                href={`/proposal/${proposal.id}`}
                                className="hover:text-black transition-all duration-200"
                              >
                                View Proposal
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-lg text-white">
                      No proposals found
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
