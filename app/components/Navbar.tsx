import React from 'react';
import Image from 'next/image';
import AuthButton from './AuthButton';

const Navbar = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-white h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <Image
          alt="proposales"
          src={
            'https://assets-global.website-files.com/64fa70d89846f59218c2ffad/660f4f1aa9f94598aa2bc011_logo-light-without-trademark.svg'
          }
          width={150}
          height={50}
        />

        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;
