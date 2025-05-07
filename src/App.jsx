import React, { useState, useContext } from 'react';
import { CurrentPageContext } from './contexts/currentPage'; 

function App() {
    const { currentPage, setCurrentPage } = useContext(CurrentPageContext);

    return (
        <div className='main-content'>
            {currentPage}
        </div>
    );
}

export default App;