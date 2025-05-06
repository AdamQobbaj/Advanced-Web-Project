import { useState, useContext } from 'react';
import '../page.css';
import { CurrentPageContext } from '../contexts/currentPage'; 

import Signin from "./Signin";


function Signup() {
  const [isStudent, setIsStudent] = useState(false);
  const {currentPage,setCurrentPage} = useContext(CurrentPageContext);
  return (
    <>
      <div className="signup-container">
        <h2 className="signup-title">Sign Up</h2>

        <label htmlFor="signup-username" className="signup-label">Username</label>
        <input type="text" id="signup-username" name="username" className="signup-input" required />

        <label htmlFor="signup-password" className="signup-label">Password</label>
        <input type="password" id="signup-password" name="password" className="signup-input" required />

        <div className="signup-checkbox-container">
          <input 
            type="checkbox" 
            id="signup-student" 
            name="student" 
            onClick={() => setIsStudent(!isStudent)} 
          />
          <label htmlFor="signup-student" className="signup-label">I am a student</label>
        </div>

        {isStudent && (
          <div>
            <label htmlFor="signup-uid" className="signup-label">University ID</label>
            <input 
              type="text" 
              id="signup-uid" 
              name="uid" 
              className="signup-input" 
              required 
            />
          </div>
        )}

        <div>
          <button className="signup-button">Sign Up</button>
          <h3>Already have an account?</h3>
          <h3 className="already" onClick={()=> {setCurrentPage(<Signin/>)}}>Sign in</h3>
        </div>
      </div>
    </>
  );
}


export default Signup;