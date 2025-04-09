import React from 'react';
import { BracketProvider } from './context/BracketContext';
import { TeamManagerProvider } from './context/teamManagerContext';
import { MatchDataProvider } from './context/MatchDataContext';
import { AppContextProvider } from './context/AppContext';
import Bracket from './features/Bracket/Brackets';

function App() {
  return (
    <AppContextProvider>
      <TeamManagerProvider>
        <BracketProvider>
          <MatchDataProvider>
            <div className="App" style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', color: 'white' }}>
              <Bracket />
            </div>
          </MatchDataProvider>
        </BracketProvider>
      </TeamManagerProvider>
    </AppContextProvider>
  );
}

export default App;
