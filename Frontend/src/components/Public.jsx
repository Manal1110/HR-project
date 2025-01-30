import React from 'react';
import { Link } from 'react-router-dom';
import yazaki from '../images/yazaki.png'; 

const Public = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src={yazaki} alt="Yazaki Logo" className="mx-auto h-auto w-auto" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to Yazaki HR</h1>
          <p className="mt-2 text-gray-600">Your gateway to a wonderful experience.</p>
        </div>
        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Public;
