
const availableTeams = [
    {
        "name": "Blue Team",
        "logo": "http://localhost:8080/files/playerImages/IMGP5209-scaled.jpg",
        "color": "#ffffff",
        "players": [
            {
                "id": "p_467289f9-f2f9-4090-b81c-e22930d119b8",
                "name": "Player1",
                "discordId": "",
                "info": "Hai",
                "role": null,
                "hero": null
            },
            {
                "id": "p_3c79ce4c-d01f-4ef5-b9c5-d5e23e2f3786",
                "name": "Player2",
                "discordId": "",
                "info": "Hai Again",
                "role": null,
                "hero": null
            }
        ],
        "gameRosters": [],
        "id": "t_0822ad5d-77ab-4437-9bcd-500f42a912b8",
        "createdAt": 1746035613380,
        "updatedAt": 1746035632752
    },
    {
        "name": "Yesss",
        "logo": "http://localhost:8080/files/playerImages/IMGP5209-scaled.jpg",
        "color": "#ffffff",
        "players": [
            {
                "id": "p_467289f9-f2f9-4090-b81c-e22930d119b8",
                "name": "Player1",
                "discordId": "",
                "info": "Hai",
                "role": null,
                "hero": null
            },
            {
                "id": "p_3c79ce4c-d01f-4ef5-b9c5-d5e23e2f3786",
                "name": "Player2",
                "discordId": "",
                "info": "Hai Again",
                "role": null,
                "hero": null
            }
        ],
        "gameRosters": [],
        "id": "t_09ce1b40-54cb-4b0f-a7e1-65482eb234db",
        "createdAt": 1746035614446,
        "updatedAt": 1746035625672
    },
    {
        "name": "SomeTeam",
        "logo": "http://localhost:8080/files/playerImages/IMGP5209-scaled.jpg",
        "color": "#ffffff",
        "players": [
            {
                "id": "p_467289f9-f2f9-4090-b81c-e22930d119b8",
                "name": "Player1",
                "discordId": "",
                "info": "Hai",
                "role": null,
                "hero": null
            },
            {
                "id": "p_3c79ce4c-d01f-4ef5-b9c5-d5e23e2f3786",
                "name": "Player2",
                "discordId": "",
                "info": "Hai Again",
                "role": null,
                "hero": null
            }
        ],
        "gameRosters": [],
        "id": "t_4fd1c1ca-e73a-4c58-845c-968e3c685880",
        "createdAt": 1746035614886,
        "updatedAt": 1746035621741
    },
    {
        "name": "TestTeam1 (Copy) (Copy) (Copy)",
        "logo": "http://localhost:8080/files/playerImages/IMGP5209-scaled.jpg",
        "color": "#ffffff",
        "players": [
            {
                "id": "p_467289f9-f2f9-4090-b81c-e22930d119b8",
                "name": "Player1",
                "discordId": "",
                "info": "Hai",
                "role": null,
                "hero": null
            },
            {
                "id": "p_3c79ce4c-d01f-4ef5-b9c5-d5e23e2f3786",
                "name": "Player2",
                "discordId": "",
                "info": "Hai Again",
                "role": null,
                "hero": null
            }
        ],
        "gameRosters": [],
        "id": "t_55e21580-1f23-4167-8686-192043b1f00b",
        "createdAt": 1746035615266,
        "updatedAt": 1746035615266
    }
];

import React, { useState } from 'react';
import { SingleEliminationBracket, SVGViewer } from 'react-tournament-brackets';
import { Button, Offcanvas, Form, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export const CustomMatchBracket = ({ bracketMatches, onMatchesUpdate }) => {
    const [matches, setMatches] = useState(bracketMatches);
    const [editingMatch, setEditingMatch] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const finalWidth = 1800;
    const finalHeight = 1200;

    const handleEditClick = (match) => {
        // Create a deep copy of the match to edit
        const matchToEdit = JSON.parse(JSON.stringify(match));
        
        // Ensure participants array exists and is properly initialized
        if (!matchToEdit.participants || matchToEdit.participants.length === 0) {
            // Create default participants if none exist
            matchToEdit.participants = [
                { id: null, teamId: "", name: "", status: "", isWinner: false, resultText: "" },
                { id: null, teamId: "", name: "", status: "", isWinner: false, resultText: "" }
            ];
        } else {
            // Make sure each participant has the necessary properties
            matchToEdit.participants = matchToEdit.participants.map(participant => ({
                ...participant,
                teamId: participant.teamId || participant.id || "",
                status: participant.status || "",
                isWinner: participant.isWinner || false,
                resultText: participant.resultText || ""
            }));
            
            // Ensure we have exactly 2 participants (top and bottom)
            while (matchToEdit.participants.length < 2) {
                matchToEdit.participants.push({
                    id: null, teamId: "", name: "", status: "", isWinner: false, resultText: ""
                });
            }
        }
        
        setEditingMatch(matchToEdit);
        setShowOffcanvas(true);
    };

    const handleSaveMatch = () => {
        // Update the current match in the matches array
        const updatedMatches = matches.map(match => 
            match.id === editingMatch.id ? editingMatch : match
        );
        
        setMatches(updatedMatches);
        if (onMatchesUpdate) {
            onMatchesUpdate(updatedMatches);
        }
        setShowOffcanvas(false);
    };

    const updateParticipant = (index, field, value) => {
        if (!editingMatch || !editingMatch.participants[index]) return;
        
        const updatedParticipants = [...editingMatch.participants];
        const participant = updatedParticipants[index];
        
        if (field === 'teamId') {
            if (value === "TBA") {
                // Handle "TBA" selection
                updatedParticipants[index] = {
                    ...participant,
                    id: "TBA",
                    teamId: "TBA",
                    name: "TBA",
                    logo: null,
                    color: null
                };
            } else if (value === "") {
                // Handle empty selection
                updatedParticipants[index] = {
                    ...participant,
                    id: null,
                    teamId: "",
                    name: "",
                    logo: null,
                    color: null
                };
            } else {
                // Handle team selection from dropdown
                const selectedTeam = availableTeams.find(team => team.id === value);
                if (selectedTeam) {
                    updatedParticipants[index] = {
                        ...participant,
                        id: value,  // Use selected value as ID
                        teamId: value,
                        name: selectedTeam.name,
                        logo: selectedTeam.logo,
                        color: selectedTeam.color
                    };
                }
            }
        } else {
            // Handle other field updates normally
            updatedParticipants[index] = {
                ...participant,
                [field]: value
            };
        }
        
        setEditingMatch({
            ...editingMatch,
            participants: updatedParticipants
        });
    };

    return (
        <>
            <SingleEliminationBracket
                matches={matches}
                options={{
                    style: {
                        roundHeader: { backgroundColor: '#AAA' },
                        connectorColor: '#FF8C00',
                        connectorColorHighlight: '#000',
                    },
                }}
                svgWrapper={({ children, ...props }) => (
                    <SVGViewer
                        background="#FFF"
                        SVGBackground="#FFF"
                        width={finalWidth}
                        height={finalHeight}
                        {...props}
                    >
                        {children}
                    </SVGViewer>
                )}
                matchComponent={({
                    match,
                    onMatchClick,
                    onPartyClick,
                    onMouseEnter,
                    onMouseLeave,
                    topParty,
                    bottomParty,
                    topWon,
                    bottomWon,
                    topHovered,
                    bottomHovered,
                    topText,
                    bottomText,
                    connectorColor,
                    computedStyles,
                    teamNameFallback,
                    resultFallback,
                }) => {
                    // Whether this match is empty and needs setup
                    const isEmpty = (!topParty || !topParty.name) && (!bottomParty || !bottomParty.name);
                    
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                color: '#000',
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '8px',
                                backgroundColor: isEmpty ? '#f9f0ff' : '#f8f9fa', // Highlight empty matches
                            }}
                        >
                            <div className="edit-button" 
                                style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(match);
                                }}
                            >
                                <FontAwesomeIcon icon={faEdit} size="xs" />
                            </div>
                            
                            {isEmpty ? (
                                <div style={{ textAlign: 'center', padding: '10px', color: '#6c757d' }}>
                                    Click edit to set up this match
                                </div>
                            ) : (
                                <>
                                    <div
                                        onMouseEnter={() => onMouseEnter(topParty?.id)}
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            padding: '4px',
                                            backgroundColor: topWon ? '#e6ffe6' : 'transparent',
                                            borderRadius: '3px',
                                        }}
                                    >
                                        <div>{topParty?.name || teamNameFallback}</div>
                                        <div>{topParty?.resultText ?? resultFallback(topParty)}</div>
                                    </div>
                                    
                                    <div
                                        style={{ height: '1px', width: '100%', background: '#FF8C00', margin: '4px 0' }}
                                    />
                                    
                                    <div
                                        onMouseEnter={() => onMouseEnter(bottomParty?.id)}
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            padding: '4px',
                                            backgroundColor: bottomWon ? '#e6ffe6' : 'transparent',
                                            borderRadius: '3px',
                                        }}
                                    >
                                        <div>{bottomParty?.name || teamNameFallback}</div>
                                        <div>{bottomParty?.resultText ?? resultFallback(bottomParty)}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                }}
            />

            {/* Replace Modal with Offcanvas */}
            <Offcanvas 
                show={showOffcanvas} 
                onHide={() => setShowOffcanvas(false)} 
                placement="end"
                style={{ width: '800px' }}
                backdrop={false}
                //  data-bs-backdrop="false"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {editingMatch?.participants?.some(p => p.name) 
                            ? `Edit Match: ${editingMatch?.participants?.[0]?.name || 'TBA'} vs ${editingMatch?.participants?.[1]?.name || 'TBA'}`
                            : 'Set Up New Match'}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {editingMatch && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Match Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editingMatch.tournamentRoundText || ''}
                                    onChange={(e) => setEditingMatch({...editingMatch, tournamentRoundText: e.target.value})}
                                    placeholder="e.g. Quarter Final 1"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Match State</Form.Label>
                                <Form.Select 
                                    value={editingMatch.state || 'SCHEDULED'}
                                    onChange={(e) => setEditingMatch({...editingMatch, state: e.target.value})}
                                >
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="RUNNING">Running</option>
                                    <option value="SCORE_DONE">Score Done</option>
                                    <option value="DONE">Complete</option>
                                </Form.Select>
                            </Form.Group>

                            <h5 className="mt-4 mb-3">Participants</h5>
                            
                            {editingMatch.participants.map((participant, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Header className={index === 0 ? 'bg-info text-white' : 'bg-warning text-dark'}>
                                        {index === 0 ? 'Top Team' : 'Bottom Team'}
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Team</Form.Label>
                                            <Form.Select 
                                                value={participant.teamId || ''}
                                                onChange={(e) => updateParticipant(index, 'teamId', e.target.value)}
                                            >
                                                <option value="">Select a team</option>
                                                <option value="TBA">TBA</option>
                                                
                                                {availableTeams.map((team) => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        
                                        {participant.logo && (
                                            <div className="mb-3 d-flex align-items-center border-bottom pb-2">
                                                <img 
                                                    src={participant.logo} 
                                                    alt={participant.name} 
                                                    style={{ width: '30px', height: '30px', marginRight: '8px', objectFit: 'cover', borderRadius: '50%' }} 
                                                />
                                                <span className="fw-bold">{participant.name}</span>
                                            </div>
                                        )}
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Score/Result</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                value={participant.resultText || ''}
                                                onChange={(e) => updateParticipant(index, 'resultText', e.target.value)}
                                                placeholder="e.g. 2"
                                            />
                                        </Form.Group>
                                        
                                        <div className="d-flex justify-content-between">
                                            <Form.Group className="mb-2 me-2">
                                                <Form.Check 
                                                    type="checkbox" 
                                                    label="Winner" 
                                                    checked={participant.isWinner || false}
                                                    onChange={(e) => updateParticipant(index, 'isWinner', e.target.checked)}
                                                />
                                            </Form.Group>
                                            
                                            <Form.Group className="mb-2" style={{ width: '60%' }}>
                                                <Form.Select 
                                                    value={participant.status || ''}
                                                    onChange={(e) => updateParticipant(index, 'status', e.target.value)}
                                                >
                                                    <option value="">Not Started</option>
                                                    <option value="PLAYED">Played</option>
                                                    <option value="NO_SHOW">No Show</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}

                            <div className="d-flex justify-content-end mt-4">
                                <Button variant="secondary" className="me-2" onClick={() => setShowOffcanvas(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleSaveMatch}>
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};