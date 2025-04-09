import React, { createContext, useContext, useState, useEffect } from 'react';

const TeamManagerContext = createContext();

export const useTeamManager = () => useContext(TeamManagerContext);

export const TeamManagerProvider = ({ children }) => {
    // Mock teams data
    const [allteams, setTeams] = useState(() => {
        const storedTeams = localStorage.getItem('bracket-teams');
        return storedTeams ? JSON.parse(storedTeams) : [
            { id: '1', name: 'Team A', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#ff0000' },
            { id: '2', name: 'Team B', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#0000ff' },
            { id: '3', name: 'Team C', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#00ff00' },
            { id: '4', name: 'Team D', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#ffff00' },
            { id: '5', name: 'Team E', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#ff00ff' },
            { id: '6', name: 'Team F', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#00ffff' },
            { id: '7', name: 'Team G', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#ffffff' },
            { id: '8', name: 'Team H', logo: 'http://localhost:8080/files/teamLogos/default_team.png', color: '#000000' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('bracket-teams', JSON.stringify(allteams));
    }, [allteams]);

    return (
        <TeamManagerContext.Provider value={{ allteams, setTeams }}>
            {children}
        </TeamManagerContext.Provider>
    );
};
