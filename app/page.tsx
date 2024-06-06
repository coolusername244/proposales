import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
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

          {/*  <AuthButton />} */}
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <div className="m-auto">
            <h2 className="font-bold text-center text-4xl mb-12">
              Proposales Technical Assignment
            </h2>
            <p className="text-center">Please log in/sign up to continue</p>
          </div>
        </main>
      </div>

      <footer className="w-full border-t border-t-white p-8 flex justify-center text-center text-sm">
        <p>
          Learn more at{' '}
          <a
            href="https://proposales.com/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            proposales.com
          </a>
        </p>
      </footer>
    </div>
  );
}
