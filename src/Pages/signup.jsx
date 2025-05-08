import { useState, useContext } from 'react';
import { CurrentPageContext } from '../contexts/currentPage'; 

import Signin from "./Signin";


function Signup() {
  const [isStudent, setIsStudent] = useState(false);
  const {currentPage,setCurrentPage} = useContext(CurrentPageContext);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-gray-900 text-white p-8 rounded-2xl w-[100%] md:w-[100%] mx-auto h-800px">
        <h2 className="text-3xl font-bold mb-6">Sign Up</h2>

        <label htmlFor="signup-username" className="block text-lg font-semibold mb-1">
          Username
        </label>
        <input
          type="text"
          id="signup-username"
          name="username"
          className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <label htmlFor="signup-password" className="block text-lg font-semibold mb-1">
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          name="password"
          className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="signup-student"
            name="student"
            onClick={() => setIsStudent(!isStudent)}
            className="mr-2 accent-green-500"
          />
          <label htmlFor="signup-student" className="text-lg font-semibold">
            I am a student
          </label>
        </div>

        {isStudent && (
          <div>
            <label htmlFor="signup-uid" className="block text-lg font-semibold mb-1">
              University ID
            </label>
            <input
              type="text"
              id="signup-uid"
              name="uid"
              className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        )}

        <div>
          <button className="w-full bg-green-500 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors mb-4">
            Sign Up
          </button>

          <h3 className="text-center text-md">Already have an account?</h3>
          <h3
            className="text-center text-green-400 font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setCurrentPage(<Signin />);
            }}
          >
            Sign in
          </h3>
        </div>
      </div>
    </div>

  );
}


export default Signup;