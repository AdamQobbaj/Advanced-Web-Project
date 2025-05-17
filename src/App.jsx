import React, { useState, useContext } from 'react';
import { CurrentPageContext } from './contexts/currentPage'; 
import { ApolloProvider } from '@apollo/client';
import client from './apolloclient'; // Path to your client setup

function App() {
    const { currentPage, setCurrentPage } = useContext(CurrentPageContext);

    return (
            <ApolloProvider client={client}>
                  {currentPage}
            </ApolloProvider>
      );
}

export default App;