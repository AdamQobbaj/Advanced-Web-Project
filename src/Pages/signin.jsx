


import { useState, useContext } from 'react';
import '../page.css';
import { CurrentPageContext } from '../contexts/currentPage'; 
import { CurrentMainContentContext } from '../contexts/currentMainContent';

import Signup from "./signup";
import MainPage from "./MainPage";
import AdminHome from '../MainPageContent/AdminHome';
import StudentHome from '../MainPageContent/StudentHome';

function Signin() {
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext);
  const {currentMainContent, setCurrentMainContent} = useContext(CurrentMainContentContext);

  const handleSignin = () => {
    const username = document.getElementById("signup-username");
    const password = document.getElementById("signup-password");
    const staySignedIn = document.getElementById("signup-student").checked;

    let type;
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const students = JSON.parse(localStorage.getItem("students")) || [];

    let user = admins.find(admin => admin.name === username.value && admin.password === password.value);
    type = "admin";

    if (!user) {
      user = students.find(student => student.name === username.value && student.password === password.value);
      type = "student";
    }

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem("active-user", JSON.stringify({ name: user.name, password: user.password, id: user.id, type }));
    username.value = "";
    password.value = "";

    if (staySignedIn) {
      localStorage.setItem("stay-signed-in", "true");
    }

      setCurrentPage(<MainPage />);
    if (type === "admin") {
      setCurrentMainContent(<AdminHome />);
    } else {
      setCurrentMainContent(<StudentHome />);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-gray-900 text-white p-8 rounded-2xl w-[100%] md:w-lg mx-auto h-800px ">
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>

        <label htmlFor="signup-username" className="block text-lg font-semibold mb-1">Username</label>
        <input
          type="text"
          id="signup-username"
          name="username"
          className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <label htmlFor="signup-password" className="block text-lg font-semibold mb-1">Password</label>
        <input
          type="password"
          id="signup-password"
          name="password"
          className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="signup-student"
            name="student"
            className="mr-2 accent-green-500"
          />
          <label htmlFor="signup-student" className="text-lg font-semibold">Stay Signed In?</label>
        </div>

        <button
          className="w-full bg-green-500 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
          onClick={handleSignin}
        >
          Sign In
        </button>

        <div className="mt-6 text-center">
          <h3 className="text-md">New user?</h3>
          <h3
            className="text-md text-green-400 font-semibold cursor-pointer hover:underline"
            onClick={() => setCurrentPage(<Signup />)}
          >
            Sign up
          </h3>
        </div>
      </div>
    </div>
    


  );
}


export default Signin;