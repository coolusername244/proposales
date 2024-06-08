import React from 'react';

type EmailTemplateProps = {
  hotelName: string;
  eventTitle: string;
  eventDate: string;
  amountOfGuests: string;
  clientCompanyName: string;
  clientName: string;
  clientEmail: string;
  totalPrice: number;
  packages: {
    name: string;
    quantity?: number;
    checked?: boolean;
    unitPrice?: number;
    packageTotalPrice: number;
  }[];
};

const NewProposalEmailTemplate = ({
  hotelName,
  eventTitle,
  eventDate,
  amountOfGuests,
  clientCompanyName,
  clientName,
  packages,
  totalPrice,
}: EmailTemplateProps) => (
  <div>
    <h1>Hey there, {clientName}!</h1>
    <p className="text-lg">
      You are receiving this email because your initial proposal for{' '}
      {clientCompanyName} is now ready for viewing!
    </p>
    <h2>Proposal Details</h2>
    <p>
      You have booked {hotelName} for your event, &quot;{eventTitle}&quot;,
      which will take place on {eventDate}
    </p>
    <p>You have booked for {amountOfGuests} people.</p>
    <h2>Services</h2>
    <p>Below are the services that have been booked for your day</p>
    {packages.map((service, index) => (
      <div key={index}>
        {service.name}
        <ul>
          {service.quantity && (
            <>
              <li>
                {service.packageTotalPrice}KR for {service.quantity} people
              </li>
              <li>{service.unitPrice}KR per person</li>
            </>
          )}
          {service.checked && <li>{service.packageTotalPrice}KR</li>}
        </ul>
      </div>
    ))}
    <p>Total Cost: {totalPrice}KR</p>
    <p>
      If you have any questions or concerns, please do not hesitate to contact
      us!
    </p>
  </div>
);
export default NewProposalEmailTemplate;
