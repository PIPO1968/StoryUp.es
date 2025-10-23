import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export function useGlobal() {
    return useContext(GlobalContext);
}

export function GlobalProvider({ children }) {
    const [state, setState] = useState({});
    return (
        <GlobalContext.Provider value={{ state, setState }}>
            {children}
        </GlobalContext.Provider>
    );
}
