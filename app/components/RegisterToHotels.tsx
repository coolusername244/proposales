import React from 'react';
import RegisterForm from './RegisterForm';
import { getSession } from '@/helpers';

const RegisterToHotels = async () => {
  const { id } = await getSession();

  let data;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/get-all`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    data = await response.json();
  } catch (error) {
    console.error('error', error);
  }

  return (
    <>
      <h2 className="text-center font-bold text-4xl mb-4">Next steps</h2>
      <p className="text-xl text-center">Welcome to Proposales 👋</p>
      <p className="text-xl text-center">
        To continue, please register to the hotels you are affiliated with.
      </p>
      <RegisterForm userId={id} hotels={data.rows} />
    </>
  );
};

export default RegisterToHotels;
