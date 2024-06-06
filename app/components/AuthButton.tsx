import React from 'react';
import Link from 'next/link';
import { checkIsAuthorized, signOut } from '@/helpers';

const AuthButton = async () => {
  const isAuthorized = await checkIsAuthorized();

  return isAuthorized ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-slate-800 hover:bg-slate-900 transition-all duration-200">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-slate-800 hover:bg-slate-900 transition-all duration-200"
    >
      Login
    </Link>
  );
};

export default AuthButton;
