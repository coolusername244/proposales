import React from 'react';
import { checkIsAuthorized } from '@/helpers';
import Navbar from '../components/Navbar';

const Dashboard = async () => {
  await checkIsAuthorized();

  return (
    <>
      <Navbar />
      <div>dashboard</div>
    </>
  );
};

export default Dashboard;
