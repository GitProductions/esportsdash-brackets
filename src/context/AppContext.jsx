import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [action, setAction] = useState(null);

    return (
        <AppContext.Provider value={{ 
            hasUnsavedChanges, 
            setHasUnsavedChanges,
            action,
            setAction
        }}>
            {children}
        </AppContext.Provider>
    );
};
