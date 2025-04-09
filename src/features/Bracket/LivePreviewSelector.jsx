import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';

export const LivePreviewSelector = () => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="live-preview-dropdown" size="sm">
                JUST A FILLER
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>FILLER COMP</Dropdown.Item>
     
            </Dropdown.Menu>
        </Dropdown>
    );
};

export const TournamentTeams = ({ tournamentTeams, setTournamentTeams }) => {
    const handleClick = () => {
        // For demo, just add a sample team to tournament teams


        setTournamentTeams(prev => [
            ...prev, 
            { id: `new-${Date.now()}`,
             name: `Team ${prev.length + 1}`,
              logo: "http://localhost:8080/files/teamLogos/default_team.png",
                color: "#ffffff",
                players: [
                 { id: `p_${Date.now()}`, name: `Player ${prev.length + 1}`, discordId: "", info: "", role: null, hero: null }
                ],
                gameRosters: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
                
             }
        ]);
    };

    return (
        <Dropdown>
            <Dropdown.Toggle variant="outline-success" id="tournament-teams-dropdown" size="sm">
                Tournament Teams ({tournamentTeams.length})
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={handleClick}>Add Sample Team</Dropdown.Item>
                {tournamentTeams.map(team => (
                    <Dropdown.Item key={team.id}>{team.name}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
