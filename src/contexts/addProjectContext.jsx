import { createContext, useState } from "react";

const AddProjectContext = createContext();

const AddProjectProvider = ({ children }) => {
  const [addedProject, SetaddedProject] = useState(null);
  const [addProjectFlag, SetaddProjectFlag] = useState(false);
  const [studentID, SetstudentID] = useState(-1);
  const [reload, setReload] = useState(null);


  return (
    <AddProjectContext.Provider value={{ addedProject, SetaddedProject, addProjectFlag, SetaddProjectFlag,studentID,SetstudentID,reload, setReload }}>
      {children}
    </AddProjectContext.Provider>
  );
};

export { AddProjectContext, AddProjectProvider };
