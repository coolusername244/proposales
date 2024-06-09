# Proposales Technical Assignment

https://proposales.vercel.app/

### Task

Create a set of REST endpoints for a public API, and an example consumer of that public API. The public API is on the side of Proposales, allowing an authenticated outside actor, like a hotel, to query information and automatically make changes to their proposals. The example consumer is an integration with an internal system of that hotel.

<br>

### Client Side Requirements

| Status      |                                                                                           Requirement                                                                                            |
| ----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| complete    |                                                                                   query and create a proposal                                                                                    |
| complete    | set all the blocks in a proposal (in the database this is a jsonb field. No need to set only one block - think of it as re-importing the products from a separate integration into the proposal) |
| outstanding |                                                                       check availability of a room during a certain period                                                                       |

<br>

### Server Side Requirements

| Status      |                                                                                        Requirement                                                                                         |
| ----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| complete    | a mechanism for Proposales to notify you when a first version of a proposal is sent, and send you data for that version, so you can e.g. create an entry into your hotel's internal system |
| complete    | a mechanism for Proposales to notify you when a new version for a proposal is sent, and send you data for that new version, so you can update the entry into your hotel's internal system  |
| outstanding |          a mechanism for Proposales to notify you when a proposal status was changed: it was accepted or rejected, so you can update the entry into your hotel's internal system           |

<br>

### Technology Used

- Next.js 14 App Router
- Tailwind CSS
- Vercel
- @vercel/postgres
- shadcn/ui

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hashed_password text NOT NULL,
  email text UNIQUE NOT NULL,
  api_token uuid DEFAULT null
);

CREATE TABLE IF NOT EXISTS hotel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  services jsonb NOT NULL,
  archived boolean DEFAULT null
);

CREATE TABLE IF NOT EXISTS proposal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotel(id) NOT NULL,
  event_title text NOT NULL,
  event_date text NOT NULL,
  amount_of_guests integer NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  client_name text NOT NULL,
  client_phone_number text NOT NULL,
  client_email text NOT NULL,
  description_md text NOT NULL,
  total_cost integer NOT NULL,
  blocks jsonb NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotel_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  hotel_id uuid REFERENCES hotel(id) NOT NULL,
  CONSTRAINT unique_user_hotel UNIQUE (user_id, hotel_id)
);


```

<br>

### Things I would still like to implement

- Error toasts
- Form validation
  - At the moment the form doesn't have any backend validation. I would like to add some validation to ensure that the user is entering the correct data, using tools such as JOI or Zod to create a schema for the form to be tested against. As it stands, the only validation is the required attribute which can easily be removed.
- Email
  - I would also have included a link to the proposal so the receiver of the email can view the proposal online as well as in the email.
- CRUD for hotels

<br>

### Thought Processes

- Firstly, it took me some time to understand what a block is, even after looking at [this](https://docs.proposales.com/api-reference/entities/block), I still wasn't too sure. However I created a basic array similar to ["catering", "spa", "confrence room"] to represent the blocks in the database and decided to come back to it when the time came. Once that time came I looked through the website for an example and came across [this video](https://cdn.prod.website-files.com/64fa70d89846f59218c2ffad/650b9750a2425df7026c47dd_mobile%20scroll_optimized-transcode.mp4) i assumed to be blocks. I then created this (where 'services' are the blocks that the hotel offers):

```json
[
  {
    "id": "a0307b22-7fd2-4f7a-89f8-b6f5c33a422b",
    "name": "Hotel Awesome",
    "services": [
      {
        "friendlyName": "Spa Treatment",
        "name": "spaTreatment",
        "price": 1500,
        "perUnit": true,
        "description": "Relax and unwind with a full body or a sports massage."
      },
      {
        "friendlyName": "Breakfast",
        "name": "breakfast",
        "price": 130,
        "perUnit": true,
        "description": "Start your day with our breakfast influenced by the worlds leading restaurants."
      },
      {
        "friendlyName": "Lunch",
        "name": "lunch",
        "price": 179,
        "perUnit": true,
        "description": "Different courses for every day. There is always coffee after dinner."
      },
      {
        "friendlyName": "Soft Drinks",
        "name": "softDrinks",
        "price": 35,
        "perUnit": true
      },
      {
        "friendlyName": "Conference Center",
        "name": "conferenceCenter",
        "price": 25000,
        "perUnit": false,
        "description": "Our Conference Hall seats up to 100 guests."
      }
    ],
    "archived": null
  }
]
```

- In the email I received it mentioned 'authentication of the hotel via an API token'. I assumed that this may have meant user instead of hotel so that was the path that I took. Here is the log in process:

  1. User registers/logs in
  2. Create an instance of 'cookies' from 'next/headers'
  3. Email and Password are sent to backend (/api/users/login)
  4. If the inputted email and (hashed) password are a match with whats in the database then a new api_token (uuidv4) is generated and stored in the database in the users row.
  5. With the returned data from the backend, a new cookie is created and set.
  6. The user is then redirected to the dashboard.
  7. All protected routes check for the cookie and if it is not there then the user is redirected to the login page.
  8. User logs out and the api_token is deleted from the database and cookie is removed.

  Extra Info (Security Concern):

  - Currently there is a max-age attribute for the cookie. However i have not yet implemented a function to delete the api_token from the users row once it expires. If the user gets hold of the api_token from the dev tools, it isn't impossible for them to access pages after the token has expired. A way to prevent this with a little code as possible is to use something like Supabase auth which has built in functionality to delete the token once it expires.

- Why didn't I use SQLite? I initially started with SQLite and Prisma however when defining the database structures, I kept getting type errors explaining that SQLite doesn't support JSONB. After much conflicting information I decided to switch to @vercel/postgres as it is a more robust solution, works well with the project and i feel is a better representation of what you would like to see (SQL Queries and JSONB).

- At the moment, all hotels that are in the database have been manually entered. There is no way to CRUD them. So here is a copy of the data:

```json
[
  {
    "id": "a0307b22-7fd2-4f7a-89f8-b6f5c33a422b",
    "name": "Hotel Awesome",
    "services": [
      {
        "friendlyName": "Spa Treatment",
        "name": "spaTreatment",
        "price": 1500,
        "perUnit": true,
        "description": "Relax and unwind with a full body or a sports massage."
      },
      {
        "friendlyName": "Breakfast",
        "name": "breakfast",
        "price": 130,
        "perUnit": true,
        "description": "Start your day with our breakfast influenced by the worlds leading restaurants."
      },
      {
        "friendlyName": "Lunch",
        "name": "lunch",
        "price": 179,
        "perUnit": true,
        "description": "Different courses for every day. There is always coffee after dinner."
      },
      {
        "friendlyName": "Soft Drinks",
        "name": "softDrinks",
        "price": 35,
        "perUnit": true
      },
      {
        "friendlyName": "Conference Center",
        "name": "conferenceCenter",
        "price": 25000,
        "perUnit": false,
        "description": "Our Conference Hall seats up to 100 guests."
      }
    ],
    "archived": null
  },
  {
    "id": "3c4a0538-5fdb-40b0-b065-e1a75f95f47f",
    "name": "Hotel Five Star",
    "services": [
      {
        "friendlyName": "Spa Treatment",
        "name": "spaTreatment",
        "price": 1500,
        "perUnit": true,
        "description": "Relax and unwind with a full body or a sports massage."
      },
      {
        "friendlyName": "Breakfast",
        "name": "breakfast",
        "price": 130,
        "perUnit": true,
        "description": "Start your day with our breakfast influenced by the worlds leading restaurants."
      },
      {
        "friendlyName": "Lunch",
        "name": "lunch",
        "price": 179,
        "perUnit": true,
        "description": "Different courses for every day. There is always coffee after dinner."
      },
      {
        "friendlyName": "Soft Drinks",
        "name": "softDrinks",
        "price": 35,
        "perPerson": true
      },
      {
        "friendlyName": "Conference Center",
        "name": "conferenceCenter",
        "price": 25000,
        "perUnit": false,
        "description": "Our Conference Hall seats up to 100 guests."
      }
    ],
    "archived": null
  },
  {
    "id": "2a26f6ef-ffdc-42dc-bde1-1fa41173ac52",
    "name": "Hotel Beautiful",
    "services": [
      {
        "friendlyName": "Spa Treatment",
        "name": "spaTreatment",
        "price": 1500,
        "perUnit": true,
        "description": "Relax and unwind with a full body or a sports massage."
      },
      {
        "friendlyName": "Breakfast",
        "name": "breakfast",
        "price": 130,
        "perUnit": true,
        "description": "Start your day with our breakfast influenced by the worlds leading restaurants."
      },
      {
        "friendlyName": "Lunch",
        "name": "lunch",
        "price": 179,
        "perUnit": true,
        "description": "Different courses for every day. There is always coffee after dinner."
      },
      {
        "friendlyName": "Soft Drinks",
        "name": "softDrinks",
        "price": 35,
        "perPerson": true
      },
      {
        "friendlyName": "Conference Center",
        "name": "conferenceCenter",
        "price": 25000,
        "perUnit": false,
        "description": "Our Conference Hall seats up to 100 guests."
      }
    ],
    "archived": null
  },
  {
    "id": "d416a7ae-acd8-4112-911c-ae9647bcbb90",
    "name": "Hotel Amazing",
    "services": [
      {
        "friendlyName": "Spa Treatment",
        "name": "spaTreatment",
        "price": 1500,
        "perUnit": true,
        "description": "Relax and unwind with a full body or a sports massage."
      },
      {
        "friendlyName": "Breakfast",
        "name": "breakfast",
        "price": 130,
        "perUnit": true,
        "description": "Start your day with our breakfast influenced by the worlds leading restaurants."
      },
      {
        "friendlyName": "Lunch",
        "name": "lunch",
        "price": 179,
        "perUnit": true,
        "description": "Different courses for every day. There is always coffee after dinner."
      },
      {
        "friendlyName": "Soft Drinks",
        "name": "softDrinks",
        "price": 35,
        "perPerson": true
      },
      {
        "friendlyName": "Conference Center",
        "name": "conferenceCenter",
        "price": 25000,
        "perUnit": false,
        "description": "Our Conference Hall seats up to 100 guests."
      }
    ],
    "archived": null
  },
  {
    "id": "669830f1-979a-4a53-a27a-deda60bfea31",
    "name": "Hotel Superb",
    "services": [
      {
        "friendlyName": "Yoga Workshop",
        "name": "yogaWorkshop",
        "price": 500,
        "perUnit": true,
        "description": "Treat your body and soul with our yoga workshop. Starts at 7pm everyday"
      },
      {
        "friendlyName": "Breakfast",
        "name": "breakfast",
        "price": 130,
        "perUnit": true,
        "description": "Start your day with our breakfast influenced by the worlds leading restaurants."
      },
      {
        "friendlyName": "Lunch",
        "name": "lunch",
        "price": 179,
        "perUnit": true,
        "description": "Different courses for every day. There is always coffee after dinner."
      },
      {
        "friendlyName": "Soft Drinks",
        "name": "softDrinks",
        "price": 35,
        "perUnit": true
      },
      {
        "friendlyName": "Conference Center",
        "name": "conferenceCenter",
        "price": 25000,
        "perUnit": false,
        "description": "Our Conference Hall seats up to 100 guests."
      }
    ],
    "archived": null
  }
]
```
