import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isChecked, setIsChecked] = useState(false); // Zustand für die Check-Box
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isChecked) {
      setError('Bitte akzeptieren Sie die Datenverarbeitungsrichtlinien.');
      return;
    }

    try {
      // Benutzer registrieren
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // E-Mail-Verifizierung senden
      await sendEmailVerification(user);

      // ID-Token abrufen
      const token = await user.getIdToken();

      // Benutzerdaten an das Backend senden
      const response = await fetch('http://localhost:4000/api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Token im Header senden
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Benutzerdaten im Backend');
      }

      
      router.push('/sign-up/erfolgreich');
    } catch (err) {
      console.error('Registrierungsfehler:', err);
      setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-2/4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Erstelle ein Konto
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="firstName"
            className="block text-gray-700 font-medium"
          >
            Vorname
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Gib deinen Vornamen ein"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="max-w-xl w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
            required
          />
          <label htmlFor="lastName" className="block text-gray-700 font-medium">
            Nachname
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Gib deinen Nachnamen ein"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="max-w-xl w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
            required
          />

          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Gib deine Email-Adresse ein"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xl w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
            required
          />

          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <div className="flex items-center w-full border border-gray-300 rounded-lg px-4 focus-within:ring-2 focus-within:ring-gray-400">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Gib dein Passwort ein"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 outline-none"
              required
            />
            {password && (
              <span
                onClick={togglePasswordVisibility}
                className="cursor-pointer text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={!showPassword ? faEye : faEyeSlash} />
              </span>
            )}
          </div>
        </div>

        {/* Check-Box für Datenverarbeitungsrichtlinien */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="dataProcessing"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="dataProcessing" className="text-sm">
            Ich akzeptiere die{' '}
            <Link
              href="/impressum&&datenschutz"
              target="_blank"
              className="text-blue-500 underline"
            >
              Datenverarbeitungsrichtlinien
            </Link>
            .
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex flex-col items-center space-y-4">
          <button
            type="submit"
            className={`w-full max-w-xs bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300 ${
              !isChecked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isChecked}
          >
            registrieren
          </button>

          <div className="flex items-center space-x-4 w-full max-w-xs">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="text-gray-500 font-medium">oder</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <div className="space-x-4 w-full max-w-xs">
            <Link href="/login">
              <button
                type="button"
                className="w-full max-w-xs bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Bereits registriert?
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
