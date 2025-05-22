import { createContext, useState } from "react";

const UpdateProjectContext = createContext();

const  UpdateProjectProvider = ({ children }) => {
   const [updateProjectID, setUpdateProjectID] = useState(-1);
  

  return (
    <UpdateProjectContext.Provider value={{updateProjectID, setUpdateProjectID}}>
      {children}
    </UpdateProjectContext.Provider>
  );
};

export { UpdateProjectContext, UpdateProjectProvider };
