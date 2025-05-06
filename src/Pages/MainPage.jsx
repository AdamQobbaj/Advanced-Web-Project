import { useContext } from "react";
import { CurrentMainContentContext } from '../contexts/currentMainContent';

import AdminHome from "../MainPageContent/AdminHome";

function MainPage () {
  const {currentMainContent, setCurrentMainContent} = useContext(CurrentMainContentContext);
  const activeUser = JSON.parse(localStorage.getItem("active-user"));
  return (
    <div>
      <div className="top-bar">
        <div className="admin-info">
          <span id="name-span">{activeUser.type} {activeUser.name}</span>
          <button className="logout">Logout</button>
        </div>
      </div>

      <div className="container">
        <div className="sidebar">
          <ul>
            <li className="active">Home</li>
            <li>Projects</li>
            <li>Tasks</li>
            <li>Chat</li>
          </ul>
        </div>

        <div className="main-content" id="content">
          {currentMainContent}
        </div>
      </div>
    </div>
  );
}

export default MainPage;