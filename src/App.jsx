import React, { useState, useContext } from 'react';
import { CurrentPageContext } from './contexts/currentPage'; 

function App() {
    const { currentPage, setCurrentPage } = useContext(CurrentPageContext);

    return (
        <div className='overflow-auto bg-[#181818] text-white w-screen h-screen '>
            {currentPage}
        </div>
    );
}

export default App;