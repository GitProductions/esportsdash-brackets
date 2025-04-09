
const createDefaultBracketData = () => {
    const bracketPhases = ['qfm1', 'qfm2', 'qfm3', 'qfm4', 'sfm1', 'sfm2', 'lsfm1', 'lfm1', 'lfm2', 'wfm1', 'gf1m1'];
    const bracketData = {};
    bracketPhases.forEach((phase) => {
      bracketData[phase] = {
        team1: {
          name: 'TBA',
          score: 0,
          logo: ''
        },
        team2: {
          name: 'TBA',
          score: 0,
          logo: ''
        },
        details: '',
        completed: false
      };
    });
    return bracketData;
  };
  
  
  const defaultBracketData = createDefaultBracketData();
  
  export { defaultBracketData };