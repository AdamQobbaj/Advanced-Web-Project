import { createContext, useState } from "react"

import Signin from "../Pages/Signin";

const CurrentPageContext = createContext();

const CurrentPageProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(<Signin/>);
    return (
        <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </CurrentPageContext.Provider>
    );
}

export {CurrentPageContext, CurrentPageProvider};