'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type HotelData = {
  id: string;
  name: string;
  services: Service[];
  archived: boolean | null;
};

type Service = {
  name: string;
  friendlyName: string;
  description?: string;
  price: number;
  perUnit: boolean;
};

const ProposalForm = ({
  hotelData,
  userId,
}: {
  hotelData: HotelData;
  userId: string;
}) => {
  const [amountOfGuests, setAmountOfGuests] = useState<number>(0);
  const [subtotals, setSubtotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const newTotalCost = Object.values(subtotals).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setTotalPrice(newTotalCost);
  }, [subtotals]);

  const handleApiRequest = async (url: string, method: string, body: any) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userId}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong.');
      }
    } catch (error) {
      setError(
        (error as Error).message ||
          'Something went wrong. Please try again later.',
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    setError(null);
    e.preventDefault();
    const eventTitle = (e.target as any).eventTitle.value;
    const eventDate = (e.target as any).eventDate.value;
    const clientCompanyName = (e.target as any).clientCompanyName.value;
    const clientName = (e.target as any).clientName.value;
    const clientPhoneNumber = (e.target as any).clientPhoneNumber.value;
    const clientEmail = (e.target as any).clientEmail.value;
    const description = (e.target as any).description_md.value;
    const packages: {
      name: string;
      quantity?: number;
      checked?: boolean;
      unitPrice?: number;
      packageTotalPrice: number;
    }[] = [];

    hotelData.services.forEach(service => {
      if (service.perUnit) {
        const quantity = Number(
          (e.target as any)[`${service.name}Quantity`].value,
        );
        if (quantity !== 0) {
          packages.push({
            name: service.friendlyName,
            quantity: quantity,
            packageTotalPrice: subtotals[service.name],
            unitPrice: service.price,
          });
        }
      } else {
        const isChecked = (e.target as any)[`${service.name}Check`].checked;
        if (isChecked) {
          packages.push({
            name: service.friendlyName,
            checked: isChecked,
            packageTotalPrice: subtotals[service.name],
          });
        }
      }
    });

    const proposal = {
      hotelId: hotelData.id,
      eventTitle,
      eventDate,
      amountOfGuests: amountOfGuests,
      clientCompanyName,
      clientName,
      clientPhoneNumber,
      clientEmail,
      description,
      packages,
      totalPrice,
    };

    const emailData = {
      hotelName: hotelData.name,
      eventTitle,
      eventDate,
      amountOfGuests: amountOfGuests,
      clientCompanyName,
      clientName,
      clientEmail,
      packages,
      totalPrice,
    };

    try {
      await Promise.all([
        handleApiRequest(
          'http://localhost:3000/api/proposals',
          'POST',
          proposal,
        ),
        handleApiRequest(
          'http://localhost:3000/api/email/send-new',
          'POST',
          emailData,
        ),
      ]);

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      // Handle errors
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    service: Service,
  ) => {
    const newQuantity = Number(event.target.value);
    const newSubTotal = service.perUnit ? newQuantity * service.price : 0;

    setSubtotals(prevSubtotals => ({
      ...prevSubtotals,
      [service.name]: newSubTotal,
    }));

    setTotalPrice(
      Object.values(subtotals).reduce((acc, curr) => acc + curr, 0),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-white text-center text-2xl">
        Event Location - {hotelData.name}
      </h3>
      <div className="text-white flex flex-col gap-6">
        <div className="flex flex-col">
          <label className="pb-2" htmlFor="eventTitle">
            Event Title
          </label>
          <input
            id="eventTitle"
            type="text"
            className="text-black indent-1"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="pb-2" htmlFor="eventDate">
            Event Date
          </label>
          <input
            id="eventDate"
            type="date"
            className="text-black indent-1"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="pb-2" htmlFor="guestQuantity">
            Number of Guests
          </label>
          <input
            id="guestQuantity"
            type="number"
            className="text-black indent-2"
            min={1}
            onChange={e => setAmountOfGuests(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="pb-2" htmlFor="clientCompanyName">
            Client Company Name
          </label>
          <input
            id="clientCompanyName"
            type="text"
            className="text-black indent-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="pb-2" htmlFor="clientName">
            Client Name
          </label>
          <input
            id="clientName"
            type="text"
            className="text-black indent-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="pb-2" htmlFor="clientPhoneNumber">
            Client Phone Number
          </label>
          <input
            id="clientPhoneNumber"
            type="tel"
            className="text-black indent-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="clientEmail">Client Email</label>
          <span className="text-sm pb-2 text-red-500">
            (Make sure you have access to this email address)
          </span>
          <input
            id="clientEmail"
            type="email"
            className="text-black indent-2"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description_md">Description - MarkDown</label>
          <textarea
            id="description_md"
            className="text-black px-2 py-1"
            rows={10}
            required
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-2xl text-center">Packages</h3>
          {hotelData.services.map(service => (
            <div key={service.name} className="py-6">
              <h4 className="text-xl text-white">{service.friendlyName}</h4>
              <p className="text-white text-lg">
                {service.price} KR{service.perUnit ? '/unit' : ''}
              </p>
              {service.perUnit ? (
                <>
                  <input
                    id={`${service.name}Quantity`}
                    name={`${service.name}Quantity`}
                    type="number"
                    min={0}
                    max={amountOfGuests}
                    onChange={e => handleQuantityChange(e, service)}
                    className="w-full text-black indent-2"
                    required
                  />
                  <p>
                    Sub Total:{' '}
                    <span id={`${service.name}Subtotal`}>
                      {subtotals[service.name] || 0} KR
                    </span>
                  </p>
                </>
              ) : (
                <input
                  id={`${service.name}Check`}
                  type="checkbox"
                  onChange={e => {
                    const isChecked = (e.target as HTMLInputElement).checked;

                    setSubtotals(prevSubtotals => ({
                      ...prevSubtotals,
                      [service.name]: isChecked ? service.price : 0,
                    }));
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-2xl text-center">Total</h3>
          <p>{totalPrice} KR</p>
        </div>
        <input
          className="bg-emerald-500 hover:bg-emerald-800 py-2"
          type="submit"
          value={loading ? 'Creating Proposal...' : 'Submit Proposal'}
        />
      </div>
    </form>
  );
};

export default ProposalForm;
