import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-4">Erfolgreich registriert!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Vielen Dank für deine Registrierung. Dein Konto wurde erfolgreich
        erstellt.
      </p>
      <Link
        href="/login"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        Jetzt anmelden
      </Link>
    </div>
  );
};
