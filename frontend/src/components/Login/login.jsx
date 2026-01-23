import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Zustand für Passwort-Sichtbarkeit
  const [error, setError] = useState(null);
  const router = useRouter();

 const handleLogin = async (e) => {
   e.preventDefault();
   setError(null);

   try {
     // Login bei Firebase
     const userCredential = await signInWithEmailAndPassword(
       auth,
       email,
       password
     );
     const user = userCredential.user;

     // Token abrufen
     const token = await user.getIdToken();

     // Token an das Backend senden
     await fetch('http://localhost:4000/api/session-login', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       credentials: 'include', // Cookies vom Server akzeptieren
       body: JSON.stringify({ token }),
     });

     // Weiterleitung zum Dashboard
     router.push('/dashboard');
   } catch (err) {
     console.error('Login-Fehler:', err.message);
     if (err.code === 'auth/user-not-found') {
       setError('Benutzer nicht gefunden. Bitte registriere dich zuerst.');
     } else {
       setError('Falsches Passwort. Bitte versuche es erneut.');
     }
   }
 };


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-2/4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        logge dich ein
      </h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Gib deine Email-Adresse ein"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-400 outline-none"
            required
          />
        </div>
        <div className="relative">
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

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex flex-col items-center space-y-4">
          <button
            type="submit"
            className="w-full max-w-xs bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Anmelden
          </button>

          <div className="flex items-center space-x-4 w-full max-w-xs">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="text-gray-500 font-medium">oder</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <div className="space-x-4 w-full max-w-xs">
            <Link href="/sign-up">
              <button
                type="button"
                className="w-full max-w-xs bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Neues Konto erstellen
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
