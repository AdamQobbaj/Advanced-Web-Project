import { createContext, useState } from "react"

import AdminHome from "../MainPageContent/AdminHome";

const CurrentMainContentContext = createContext();

const CurrentMainContentProvider = ({ children }) => {
    const [currentMainContent, setCurrentMainContent] = useState(null);
    return (
        <CurrentMainContentContext.Provider value={{ currentMainContent, setCurrentMainContent }}>
            {children}
        </CurrentMainContentContext.Provider>
    );
}

export {CurrentMainContentContext, CurrentMainContentProvider};