


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
    <div className="signup-container">
      <h2 className="signup-title">Sign In</h2>

      <label htmlFor="signup-username" className="signup-label">Username</label>
      <input type="text" id="signup-username" name="username" className="signup-input" required />

      <label htmlFor="signup-password" className="signup-label">Password</label>
      <input type="password" id="signup-password" name="password" className="signup-input" required />

      <div className="signup-checkbox-container">
        <input type="checkbox" id="signup-student" name="student" />
        <label htmlFor="signup-student" className="signup-label">Stay Signed In?</label>
      </div>

      <div>
        <button className="signup-button" onClick={handleSignin}>Sign In</button>
        <h3>New user?</h3>
        <h3 className="already" onClick={() => setCurrentPage(<Signup />)}>Sign up</h3>
      </div>
    </div>
  );
}


export default Signin;