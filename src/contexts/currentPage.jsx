import { createContext, useState, useEffect } from "react";

import Signin from "../Pages/signin";
import MainPage from "../Pages/MainPage";

const CurrentPageContext = createContext();

const CurrentPageProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(<Signin/>);

    useEffect(() => {
        const staySignedIn = JSON.parse(localStorage.getItem("stay-signed-in"));
        if (staySignedIn === true) {
            setCurrentPage(<MainPage />);
        }
    }, []);

    return (
        <CurrentPageContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </CurrentPageContext.Provider>
    );
}

export { CurrentPageContext, CurrentPageProvider };
