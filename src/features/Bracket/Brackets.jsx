import React, { useEffect, useState, useContext } from 'react';
import { Button, Modal, ButtonGroup, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faSquare, faArrowRight, faBox, faX } from '@fortawesome/free-solid-svg-icons';
import { useTeamManager } from '@context/teamManagerContext';
import { useBracketManager } from '@context/BracketContext';
import './Brackets.css';
import { defaultBracketData } from './defaultBracketData';
import { MatchDataContext } from '@context/MatchDataContext';

import confirmModal from '@components/UI/modals/ConfirmModal';
import { LivePreviewSelector, TournamentTeams } from './LivePreviewSelector';
import { useAppContext } from '@context/AppContext';

// Main Bracket Component 
const Bracket = ({ handleFeatureMoved }) => {
    const { matchData, setMatchData } = useContext(MatchDataContext);

    const { allteams, setTeams } = useTeamManager();
    const {
        bracketData, setBracketData,
        bracketType, setBracketType,
        saveBracket, autoSave, setAutoSave,
        tournamentTeams, setTournamentTeams
    } = useBracketManager();

    const {
        hasUnsavedChanges,
        setHasUnsavedChanges,
        action
    } = useAppContext();

    useEffect(() => {
        if (action) {
            switch (action.type) {
                case 'saveBracket':
                    try {
                        saveBracket();

                        if (action.payload.resolve) {
                            action.payload.resolve({
                                success: true,
                                message: 'Bracket saved successfully',
                            });
                        }
                    } catch (error) {
                        if (action.payload.reject) {
                            action.payload.reject({
                                success: false,
                                message: 'Failed to save bracket',
                                error: error.message
                            });
                        }
                    }
                    break;

                default:
                    break;
            }
        }
    }, [action]);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSendToMainWindow = async (e, roundId, title, team1, team2, teams, onTeamSelect) => {
        e.preventDefault();
        console.log('roundId:', roundId, 'title:', title, 'team1:', team1, 'team2:', team2, 'teams:', teams);

        const confirm = await confirmModal('Are you sure you want to send this match to the main window?', 'Send to Match Tab');
        if (confirm) {
            setMatchData({
                ...matchData,
                teams: {
                    team1: {
                        ...matchData.teams.team1,
                        id: team1.id,
                        teamName: team1.name,
                        teamLogoUrl: team1.logo,
                        teamColor: team1.color
                    },
                    team2: {
                        ...matchData.teams.team2,
                        id: team2.id,
                        teamName: team2.name,
                        teamLogoUrl: team2.logo,
                        teamColor: team2.color
                    }
                },
            });
        }
    };

    const onScoreChange = (roundId, position, teamName, score) => {
        setHasUnsavedChanges(true);
        setBracketData(prevData => ({
            ...prevData,
            [roundId]: {
                ...prevData[roundId],
                [position]: {
                    ...prevData[roundId][position],
                    score: parseInt(score, 10),
                }
            }
        }));
    };

    const TeamInput = ({ roundId, position, teamName, teams, onSelect, teamLogo, onScoreChange }) => {
        const [localScore, setLocalScore] = useState(teamName?.score?.toString() || '0');

        useEffect(() => {
            setLocalScore(teamName?.score?.toString() || '0');
        }, [teamName?.score]);

        const handleBlur = () => {
            onScoreChange(roundId, position, teamName?.name, localScore);
        };

        return (
            <div className="team-input">
                <div className="team-logo-container">
                    <img src={teamLogo || "http://localhost:8080/files/teamLogos/default_team.png"} alt="team logo" />
                </div>
                <select value={teamName?.id || ""} onChange={onSelect}>
                    <option value="">Select a team</option>
                    <option value="TBA">TBA</option>

                    {console.log('Tournament Teams:', tournamentTeams)}
                    {tournamentTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    value={localScore}
                    onChange={(e) => setLocalScore(e.target.value)}
                    onBlur={handleBlur}
                    className="score-input"
                />
            </div>
        );
    };

    const BracketRound = ({ roundId, title, team1, team2, teams, onTeamSelect }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [newDetails, setNewDetails] = useState('');

        const handleMarkMatchComplete = async (e, roundId) => {
            e.preventDefault();
            console.log('roundId:', roundId);

            setBracketData(prevData => ({
                ...prevData,
                [roundId]: {
                    ...prevData[roundId],
                    completed: !prevData[roundId].completed
                }
            }));
        };

        const handleEditClick = () => {
            setIsEditing(true);
            setNewDetails(bracketData[roundId]?.details || '');
        };

        const handleSaveClick = () => {
            setIsEditing(false);
            setBracketData(prevData => ({
                ...prevData,
                [roundId]: {
                    ...prevData[roundId],
                    details: newDetails
                }
            }));
        };

        const handleCancelClick = () => {
            setIsEditing(false);
            setNewDetails(bracketData[roundId]?.details || '');
        };

        return (
            <div className="bracket-round mb-2">
                <div className="match-details">
                    {isEditing ? (
                        <div className="edit-container ">
                            <input
                                type="text"
                                value={newDetails}
                                onChange={(e) => setNewDetails(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveClick();
                                    if (e.key === 'Escape') handleCancelClick();
                                }}
                                placeholder="Enter match details..."
                            />

                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>Save Match Title</Tooltip>}
                                delay={{ show: 500 }}
                            >
                                <Button variant="outline-secondary text-white" size='sm' className="" onClick={handleSaveClick}>
                                    <FontAwesomeIcon icon={faCheck} size="sm" />
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip>Cancel</Tooltip>}
                                delay={{ show: 500 }}
                            >
                                <Button variant="outline-secondary text-white" size='sm' className="" onClick={handleCancelClick}>
                                    <FontAwesomeIcon icon={faX} size="sm" />
                                </Button>
                            </OverlayTrigger>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="round-header">
                    <div className="details-display text-white">
                        <small> Info: {bracketData[roundId]?.details || ''} </small>
                    </div>

                    <div
                        className={`round-title ${bracketData[roundId]?.completed ? 'bg-primary' : ''}`}
                    >{title}
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>Edit Match Title</Tooltip>}
                            delay={{ show: 500 }}
                        >
                            <Button onClick={handleEditClick}
                                variant={bracketData[roundId]?.completed ? 'outline-dark text-white' : 'outline-secondary text-white'}
                                size='sm'
                                className="ms-auto"
                            >
                                <FontAwesomeIcon icon={faEdit} size="sm" />
                            </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>See Match Options</Tooltip>}
                            delay={{ show: 500 }}
                        >
                            <Dropdown drop="end">
                                <Dropdown.Toggle size='sm'
                                    variant={bracketData[roundId]?.completed ? 'outline-dark text-white ' : 'outline-secondary text-white'}
                                    id={`match-options-${roundId}`}
                                    className='ms-1'
                                >
                                    <FontAwesomeIcon icon={faArrowRight} size="lg" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={(e) => handleSendToMainWindow(e, roundId, title, team1, team2, teams, onTeamSelect)}
                                    >
                                        <FontAwesomeIcon icon={faBox} className='me-2' />Send to Match Tab
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        active={bracketData[roundId]?.completed}
                                        onClick={(e) => handleMarkMatchComplete(e, roundId)}
                                    >
                                        {bracketData[roundId]?.completed ? <FontAwesomeIcon icon={faCheck} className='me-2' /> : <FontAwesomeIcon icon={faSquare} className='me-2' />}
                                        {bracketData[roundId]?.completed ? 'Match Complete!' : 'Mark Match As Completed'}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </OverlayTrigger>
                    </div>
                </div>

                <div className="teams-container">
                    <TeamInput
                        roundId={roundId}
                        position="team1"
                        teamName={team1}
                        teams={teams}
                        onSelect={(e) => onTeamSelect(roundId, title, 'team1', e.target.value)}
                        teamLogo={teams.find(team => team.name === team1?.name)?.logo}
                        onScoreChange={onScoreChange}
                    />
                    <TeamInput
                        roundId={roundId}
                        position="team2"
                        teamName={team2}
                        teams={teams}
                        onSelect={(e) => onTeamSelect(roundId, title, 'team2', e.target.value)}
                        teamLogo={teams.find(team => team.name === team2?.name)?.logo}
                        onScoreChange={onScoreChange}
                    />
                </div>
            </div>
        );
    };

    const BracketGroup = ({ children }) => {
        return (
            <div className="bracket-group">
                {children}
            </div>
        );
    };

    useEffect(() => {
        localStorage.setItem('bracket-teams', JSON.stringify(allteams));
    }, [allteams]);

    const handleTeamSelect = (roundId, roundTitle, position, teamId) => {
        setHasUnsavedChanges(true);
        const selectedTeam = allteams.find(team => team.id === teamId);

        setBracketData(prevData => ({
            ...prevData,
            [roundId]: {
                ...prevData[roundId],
                [position]: {
                    ...prevData[roundId][position],
                    id: teamId,
                    name: selectedTeam ? selectedTeam.name : teamId,
                    logo: selectedTeam ? selectedTeam.logo : ""
                }
            }
        }));
    };

    const clearBracket = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmClear = () => {
        setBracketData(defaultBracketData);
        setHasUnsavedChanges(false);
        setShowConfirmModal(false);
    };

    const handleCancelClear = () => {
        setShowConfirmModal(false);
    };

    const renderBracketButtons = () => {
        return (
            <div className='justify-content-end pt-2'>
                <ButtonGroup className='me-1' id='bracketTab-bracketType-tour'>
                    <Button
                        variant={bracketType === 'single-elim' ? 'success' : 'outline-secondary text-white'}
                        onClick={() => setBracketType('single-elim')}
                        size='sm'
                        active={bracketType === 'single-elim'}
                    >
                        Single Elim
                    </Button>

                    <Button
                        variant={bracketType === 'dbl-elim' ? 'success' : 'outline-secondary text-white'}
                        onClick={() => setBracketType('dbl-elim')}
                        size='sm'
                        active={bracketType === 'dbl-elim'}
                    >
                        Double Elim
                    </Button>
                </ButtonGroup>
            </div>
        );
    };

    const renderBracket = () => {
        if (bracketType === 'single-elim') {
            return (
                <div className="bracket" id="bracketTab-bracket-tour">
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                roundId="qfm1"
                                title="Quarterfinal 1"
                                team1={bracketData['qfm1']?.team1}
                                team2={bracketData['qfm1']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                roundId="qfm2"
                                title="Quarterfinal 2"
                                team1={bracketData['qfm2']?.team1}
                                team2={bracketData['qfm2']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                roundId="qfm3"
                                title="Quarterfinal 3"
                                team1={bracketData['qfm3']?.team1}
                                team2={bracketData['qfm3']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                roundId="qfm4"
                                title="Quarterfinal 4"
                                team1={bracketData['qfm4']?.team1}
                                team2={bracketData['qfm4']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                roundId="sfm1"
                                title="Semifinal 1"
                                team1={bracketData['sfm1']?.team1}
                                team2={bracketData['sfm1']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                roundId="sfm2"
                                title="Semifinal 2"
                                team1={bracketData['sfm2']?.team1}
                                team2={bracketData['sfm2']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                roundId="gf1m1"
                                title="Grand Final"
                                team1={bracketData['gf1m1']?.team1}
                                team2={bracketData['gf1m1']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>

                    {renderBracketButtons()}
                </div>
            );
        } else {
            return (
                <div className={`bracket`}>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                roundId="sfm1"
                                title="SemiFinal 1"
                                team1={bracketData['sfm1']?.team1}
                                team2={bracketData['sfm1']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                            <BracketRound
                                roundId="sfm2"
                                title="SemiFinal 2"
                                team1={bracketData['sfm2']?.team1}
                                team2={bracketData['sfm2']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                        <div className="bracket-row loser-round">
                            <BracketGroup>
                                <BracketRound
                                    roundId="lsfm1"
                                    title="Loser's SemiFinal"
                                    team1={bracketData["lsfm1"]?.team1}
                                    team2={bracketData["lsfm1"]?.team2}
                                    teams={allteams}
                                    onTeamSelect={handleTeamSelect}
                                />
                            </BracketGroup>
                        </div>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                roundId="wfm1"
                                title="Winners' Final"
                                team1={bracketData["wfm1"]?.team1}
                                team2={bracketData["wfm1"]?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                        <div className="bracket-row loser-round">
                            <BracketGroup>
                                <BracketRound
                                    roundId="lfm1"
                                    title="Loser's Final"
                                    team1={bracketData["lfm1"]?.team1}
                                    team2={bracketData["lfm1"]?.team2}
                                    teams={allteams}
                                    onTeamSelect={handleTeamSelect}
                                />
                            </BracketGroup>
                        </div>
                    </div>
                    <div className="bracket-column">
                        <BracketGroup>
                            <BracketRound
                                roundId="gf1m1"
                                title="Grand Final"
                                team1={bracketData['gf1m1']?.team1}
                                team2={bracketData['gf1m1']?.team2}
                                teams={allteams}
                                onTeamSelect={handleTeamSelect}
                            />
                        </BracketGroup>
                    </div>
                    {renderBracketButtons()}
                </div>
            );
        }
    };

    const handleSaveBracket = () => {
        saveBracket();
        setHasUnsavedChanges(false);
    };

    return (
        <div>
            <div className="fixed-top-bar bg-dark p-2 d-flex justify-content-between pe-4 ps-4">
                <div className="d-flex align-items-center gap-2">
                    <TournamentTeams
                        tournamentTeams={tournamentTeams}
                        setTournamentTeams={setTournamentTeams}
                    />

                    <LivePreviewSelector />
                </div>

                <div className="d-flex">
                    <Modal show={showConfirmModal} onHide={handleCancelClear} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Clear Bracket</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Are you sure you want to clear the bracket?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCancelClear}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleConfirmClear}>
                                Clear Bracket
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <ButtonGroup id='bracketTab-controls-tour'>
                        <Button
                            variant="outline-secondary"
                            onClick={() => setAutoSave(!autoSave)}
                            size='sm'
                            active={autoSave}
                            className="text-white"
                        >
                            <FontAwesomeIcon icon={autoSave ? faCheck : faSquare} className="me-2" />
                            Auto Save {autoSave ? 'Enabled' : 'Disabled'}
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSaveBracket}
                            size='sm'
                        >
                            Save Bracket
                        </Button>

                        <Button variant="danger"
                            onClick={() => clearBracket()}
                            size='sm'
                        >
                            Clear Bracket
                        </Button>
                    </ButtonGroup>
                </div>
            </div>

            <div className='pt-3'>
                {renderBracket()}
            </div>
        </div>
    );
};

export default Bracket;












