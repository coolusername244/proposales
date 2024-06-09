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

type ProposalData = {
  id: string;
  event_title: string;
  event_date: string;
  amount_of_guests: number;
  client_company_name: string;
  client_name: string;
  client_phone_number: string;
  client_email: string;
  description_md: string;
  blocks: {
    packages: {
      name: string;
      quantity?: number;
      checked?: boolean;
      unitPrice?: number;
      packageTotalPrice: number;
      description?: string;
    }[];
  };
};

const ProposalForm = ({
  proposalData,
  hotelData,
  userId,
}: {
  proposalData?: ProposalData | null;
  hotelData: HotelData;
  userId: string;
}) => {
  const [amountOfGuests, setAmountOfGuests] = useState<number>(0);
  const [subtotals, setSubtotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  // if coming from edit proposal, set total values
  useEffect(() => {
    if (proposalData) {
      const initialSubtotals: Record<string, number> = {};
      proposalData.blocks.packages.forEach(p => {
        const service = hotelData.services.find(s => s.friendlyName === p.name);
        if (service) {
          initialSubtotals[service.name] = p.packageTotalPrice;
        }
      });
      setSubtotals(initialSubtotals);
      setAmountOfGuests(proposalData.amount_of_guests || 0);
    }
  }, []);

  // update total price of proposal on value change
  useEffect(() => {
    const newTotalCost = Object.values(subtotals).reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setTotalPrice(newTotalCost);
  }, [subtotals]);

  // update quantity and subtotal on block quantity change
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

  const addNewProposal = async (e: React.FormEvent<HTMLFormElement>) => {
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
      description?: string;
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
            description: service.description,
          });
        }
      } else {
        const isChecked = (e.target as any)[`${service.name}Check`].checked;
        if (isChecked) {
          packages.push({
            name: service.friendlyName,
            checked: isChecked,
            packageTotalPrice: subtotals[service.name],
            description: service.description,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/proposals`,
          'POST',
          proposal,
        ),
        handleApiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/email/send-new`,
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

  const updateProposal = async (e: React.FormEvent<HTMLFormElement>) => {
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
      description?: string;
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
            description: service.description,
          });
        }
      } else {
        const isChecked = (e.target as any)[`${service.name}Check`].checked;
        if (isChecked) {
          packages.push({
            name: service.friendlyName,
            checked: isChecked,
            packageTotalPrice: subtotals[service.name],
            description: service.description,
          });
        }
      }
    });

    const proposal = {
      proposalId: proposalData!.id,
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/${
            proposalData!.id
          }`,
          'PUT',
          proposal,
        ),
        handleApiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/api/email/send-update`,
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

  return (
    <form
      onSubmit={proposalData ? updateProposal : addNewProposal}
      className="space-y-8"
    >
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
            defaultValue={proposalData?.event_title || ''}
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
            defaultValue={proposalData?.event_date}
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
            defaultValue={proposalData?.amount_of_guests}
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
            defaultValue={proposalData?.client_company_name}
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
            defaultValue={proposalData?.client_name}
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
            defaultValue={proposalData?.client_phone_number}
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
            defaultValue={proposalData?.client_email}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description_md">Description - MarkDown</label>
          <textarea
            id="description_md"
            className="text-black px-2 py-1"
            rows={10}
            required
            defaultValue={proposalData?.description_md}
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
                    defaultValue={
                      proposalData?.blocks.packages.find(
                        p => p.name === service.friendlyName,
                      )?.quantity || 0
                    }
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
                  defaultChecked={
                    proposalData?.blocks.packages.find(
                      p => p.name === service.friendlyName,
                    )?.checked
                  }
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
