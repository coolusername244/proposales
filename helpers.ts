import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

type CookieValues = { email: string; apiToken: string };

export const checkIsAuthorized = async () => {
  const cookieStore = cookies();

  const response = cookieStore.get('session');

  if (!response) {
    return false;
  }

  const { email, apiToken }: CookieValues = JSON.parse(response.value);

  try {
    const user = await sql`
      SELECT 1
      FROM users
      WHERE email = ${email} AND api_token = ${apiToken}
    `;

    return user.rows.length > 0;
  } catch (error) {
    return redirect('/login?message=User Not Authenticated');
  }
};

export const getSession = async () => {
  const cookie = cookies();
  const cookieData = cookie.get('session');

  if (!cookieData) {
    return redirect('/login?message=No session found');
  }
  return JSON.parse(cookieData.value);
};

export const getBearerToken = (request: Request) => {
  const value = request.headers.get('Authorization');
  if (!value) {
    return null;
  }
  return value.split(' ')[1];
};

export const signOut = async () => {
  'use server';
  const cookieStore = cookies();
  const response = cookieStore.get('session');
  const { email }: CookieValues = JSON.parse(response!.value);

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signout`, {
    method: 'PUT',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  cookieStore.delete('session');
  return redirect('/login');
};

export const signIn = async (formData: FormData) => {
  'use server';
  const cookieStore = cookies();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?message=Could not authenticate user');
  }

  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
      {
        method: 'PUT',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const {
      response: { rows },
    } = await data.json();

    const session = {
      id: rows[0].id,
      email,
      apiToken: rows[0].api_token,
    };

    cookieStore.set('session', JSON.stringify(session), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    });
  } catch (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/dashboard');
};

export const signUp = async (formData: FormData) => {
  'use server';
  const cookieStore = cookies();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return redirect('/login?message=Could not authenticate user');
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const { rows } = await response.json();

    const session = {
      id: rows[0].id,
      email,
      apiToken: rows[0].api_token,
    };

    cookieStore.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    });
  } catch (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/dashboard');
};
