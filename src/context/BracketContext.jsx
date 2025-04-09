import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultBracketData } from '../features/Bracket/defaultBracketData';

const BracketContext = createContext();
export const useBracketManager = () => useContext(BracketContext);

export const BracketProvider = ({ children }) => {
    const [autoSave, setAutoSave] = useState(false);
    const [tournamentTeams, setTournamentTeams] = useState([]);
    const [selectedRoundsForPreview, setSelectedRoundsForPreview] = useState([]);

    const [bracketData, setBracketData] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem('bracket-data') || '{}');
        return { ...defaultBracketData, ...storedData };
    });
    
    const [bracketType, setBracketType] = useState(() => {
        return JSON.parse(localStorage.getItem('UI_bracket_type') || '"single-elim"');
    });

    useEffect(() => {
        localStorage.setItem('UI_bracket_type', JSON.stringify(bracketType));
    }, [bracketType]);

    useEffect(() => {
        if (autoSave && Object.keys(bracketData).length > 0) {
            saveBracket();
        }
    }, [autoSave, bracketData]);

    const saveBracket = async () => {
        localStorage.setItem('bracket-data', JSON.stringify(bracketData));
        console.log('Bracket saved to localStorage');
        // In a real app, this would make an API call
    };

    return (
        <BracketContext.Provider value={{
            bracketData, setBracketData,
            saveBracket,
            autoSave, setAutoSave,
            bracketType, setBracketType,
            tournamentTeams, setTournamentTeams,
            selectedRoundsForPreview, setSelectedRoundsForPreview
        }}>
            {children}
        </BracketContext.Provider>
    );
};
