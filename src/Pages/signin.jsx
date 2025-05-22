import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_ADMIN, LOGIN_STUDENT } from '../mutations/auth';
import '../page.css';
import { CurrentPageContext } from '../contexts/currentPage';
import { CurrentMainContentContext } from '../contexts/currentMainContent';

import Signup from "./signup";
import MainPage from "./MainPage";
import AdminHome from '../MainPageContent/AdminHome';
import StudentHome from '../MainPageContent/StudentHome';

function Signin() {
  const { setCurrentPage } = useContext(CurrentPageContext);
  const { setCurrentMainContent } = useContext(CurrentMainContentContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState('');

  const [loginAdmin] = useMutation(LOGIN_ADMIN);
  const [loginStudent] = useMutation(LOGIN_STUDENT);
  const storgaeActiveTab = localStorage.getItem("active-tab");

  const handleSignin = async () => {
    try {
      let response;
      let userType = '';

      try {
        response = await loginAdmin({ variables: { name: username, password } });
        userType = 'admin';
      } catch {
          response = await loginStudent({ variables: { name: username, password } });
          userType = 'student';
      }

      const token = response.data.loginAdmin?.token || response.data.loginStudent?.token;
      const userId = response.data.loginAdmin?.id || response.data.loginStudent?.id;
      //console.log(token, userId);
      if (!token) throw new Error("No token returned");

      localStorage.setItem('token', token);
      localStorage.setItem('active-user', JSON.stringify({ name: username, id: response.data.loginAdmin?.id || response.data.loginStudent?.id, type: userType }));
      if (staySignedIn) {
        localStorage.setItem('stay-signed-in', 'true');
      }
      setCurrentPage(<MainPage />);
      setCurrentMainContent(userType === 'admin' ?<AdminHome /> : <StudentHome />);
      localStorage.setItem('active-tab',"home");
        
      setUsername('');
      setPassword('');
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-gray-900 text-white p-8 rounded-2xl w-[100%] md:w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label htmlFor="signup-username" className="block text-lg font-semibold mb-1">Username</label>
        <input
          type="text"
          id="signup-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <label htmlFor="signup-password" className="block text-lg font-semibold mb-1">Password</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="signup-student"
            checked={staySignedIn}
            onChange={() => setStaySignedIn(!staySignedIn)}
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
