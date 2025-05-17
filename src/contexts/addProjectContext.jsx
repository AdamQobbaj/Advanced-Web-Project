import { createContext, useState } from "react";

const AddProjectContext = createContext();

const AddProjectProvider = ({ children }) => {
  const [addedProject, SetaddedProject] = useState(null);
  const [addProjectFlag, SetaddProjectFlag] = useState(false);
  const [studentID, SetstudentID] = useState(-1);

  return (
    <AddProjectContext.Provider value={{ addedProject, SetaddedProject, addProjectFlag, SetaddProjectFlag,studentID,SetstudentID }}>
      {children}
    </AddProjectContext.Provider>
  );
};

export { AddProjectContext, AddProjectProvider };
