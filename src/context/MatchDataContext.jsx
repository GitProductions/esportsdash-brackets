import React, { createContext, useState } from 'react';

export const MatchDataContext = createContext();

export const MatchDataProvider = ({ children }) => {
    const [matchData, setMatchData] = useState({
        teams: {
            team1: {
                id: '',
                teamName: 'Team 1',
                teamLogoUrl: 'http://localhost:8080/files/teamLogos/default_team.png',
                teamColor: '#ff0000'
            },
            team2: {
                id: '',
                teamName: 'Team 2',
                teamLogoUrl: 'http://localhost:8080/files/teamLogos/default_team.png',
                teamColor: '#0000ff'
            }
        }
    });

    return (
        <MatchDataContext.Provider value={{ matchData, setMatchData }}>
            {children}
        </MatchDataContext.Provider>
    );
};
