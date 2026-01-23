import React from 'react';

import Features from '../components/Login/features';
import LoginForm from '../components/Login/login';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center shadow-lg">
        <LoginForm />
      </div>

      <div className="w-1/2  full">
        <Features />
      </div>
    </div>
  );
}

export default App;
