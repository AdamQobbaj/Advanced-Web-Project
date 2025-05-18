import { useState, useContext } from 'react';
import { CurrentPageContext } from '../contexts/currentPage';
import { useMutation, gql } from '@apollo/client';

import Signin from "./signin";

const SIGN_UP_STUDENT = gql`
  mutation AddStudent($name: String!, $password: String!, $uid: String!) {
    addStudent(name: $name, password: $password, uid: $uid) {
      uid
    }
  }
`;

const SIGN_UP_ADMIN = gql`
  mutation($name: String!, $password: String!){
    addAdmin(name: $name, password: $password) {
      _id
    }
}
`;

function Signup() {
  const [isStudent, setIsStudent] = useState(false);
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext);

  const [signUpStudent] = useMutation(SIGN_UP_STUDENT);
  const [signUpAdmin] = useMutation(SIGN_UP_ADMIN);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const variables = isStudent
        ? { name: username, password, uid }
        : { name: username, password };
        console.log(variables);

      const response = isStudent
        ? await signUpStudent({ variables })
        : await signUpAdmin({ variables });

      setCurrentPage(<Signin />);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181818]">
      <div className="bg-gray-900 text-white p-8 rounded-2xl w-full md:w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-username" className="block text-lg font-semibold mb-1">
            Username
          </label>
          <input
            type="text"
            id="signup-username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="signup-student"
              name="student"
              checked={isStudent}
              onChange={() => setIsStudent(!isStudent)}
              className="mr-2 accent-green-500"
            />
            <label htmlFor="signup-student" className="text-lg font-semibold">
              I am a student
            </label>
          </div>

          {isStudent && (
            <>
              <label htmlFor="signup-uid" className="block text-lg font-semibold mb-1">
                University ID
              </label>
              <input
                type="text"
                id="signup-uid"
                name="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full p-3 mb-4 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white text-lg font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors mb-4 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <h3 className="text-center text-md">Already have an account?</h3>
        <h3
          className="text-center text-green-400 font-semibold cursor-pointer hover:underline"
          onClick={() => setCurrentPage(<Signin />)}
        >
          Sign in
        </h3>
      </div>
    </div>
  );
}

export default Signup;
