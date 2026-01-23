import React from 'react';
import SignUp from '../../components/Login/signUp';
import Features from '../../components/Login/features';


function App() {
  return (
    <div className="flex h-screen bg-gray-100">

      <div className="w-1/2 bg-white flex flex-col justify-center items-center shadow-lg">
        <SignUp />
      </div>

      <div className="w-1/2  full">
        <Features />
      </div>
    </div>
  );
}

export default App;
