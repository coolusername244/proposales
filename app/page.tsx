import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
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
    </div>
  );
}
