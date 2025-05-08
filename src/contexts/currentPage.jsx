import { createContext, useState } from "react"

import Signin from "../Pages/Signin";
import MainPage from "../Pages/MainPage";

const CurrentPageContext = createContext();

const CurrentPageProvider = ({ children }) => {
    const staySignedIn = JSON.parse(localStorage.getItem("stay-signed-in"));
    const [currentPage, setCurrentPage] = useState(<MainPage/>);
    if(staySignedIn == "true")
        setCurrentPage(<MainPage/>);
    return (
        <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </CurrentPageContext.Provider>
    );
}

export {CurrentPageContext, CurrentPageProvider};