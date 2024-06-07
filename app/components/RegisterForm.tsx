'use client';
import { getSession } from '@/helpers';
import React, { useState } from 'react';

type Hotel = {
  id: string;
  name: string;
  services: string[];
  archived: boolean | null;
};

const RegisterForm = ({
  hotels,
  userId,
}: {
  hotels: Hotel[];
  userId: string;
}) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const hotelIds = Array.from(formData.keys());

    try {
      const response = await fetch('http://localhost:3000/api/hotel-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hotelIds, userId }),
      });

      if (response.ok) {
        location.reload();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-center space-y-6 mt-4">
      {hotels.map(hotel => (
        <div key={hotel.id}>
          <input type="checkbox" name={hotel.id} id={hotel.id} />
          <label htmlFor={hotel.id}> {hotel.name}</label>
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="submit"
        className="py-2 px-4 rounded-md no-underline bg-emerald-500 hover:bg-emerald-700 transition-all duration-200 cursor-pointer"
        value={loading ? 'Registering...' : 'Register to these hotels'}
        disabled={loading}
      />
    </form>
  );
};

export default RegisterForm;
