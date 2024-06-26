import React, { useState, useEffect } from 'react';
import TeamPanel from './component/TeamPanel';
import ListPanel from './component/ListPanel';
import RandomizerPanel from './component/RandomizerPanel';

const App = () => {
  const DUMMY_PLAYER = 999

  const createPlayer = (id, name, tier) => ({ id, name, tier });

  const [teams, setTeams] = useState([...Array(8)].map((_, i) => ({ id: i + 1, players: [] })));

  // Mock Data
  const [pairs, setPairs] = useState([
    { id: 101, players: [createPlayer('1', 'Pain boy', 3), createPlayer('2', 'The Origin', 3)] },
    { id: 102, players: [createPlayer('3', 'Pata-Mon', 3), createPlayer('4', '- Q', 1)] },
    { id: 103, players: [createPlayer('5', 'Snte4es', 2), createPlayer('6', '[Satori]', 3)] },
    { id: 104, players: [createPlayer('7', 'ShandenLunaire', 2), createPlayer('8', 'BurgerKing', 1)] },
    { id: 105, players: [createPlayer('9', 'My Angel Bronya', 3), createPlayer('10', 'suzuka1', 2)] },
    { id: 106, players: [createPlayer('11', 'Sy_Abyss', 2), createPlayer('12', 'LomOmon', 3)] },
    { id: 107, players: [createPlayer('13', 'Dichlorocarbene', 2), createPlayer('14', 'Folinic', 3)] },
    { id: 108, players: [createPlayer('15', 'Tokai-Teio', 2), createPlayer('16', '[-buki-]', 1)] },
    { id: 109, players: [createPlayer('17', 'Antonilization', 3), createPlayer('18', 'chanliuko', 3)] },
    { id: 110, players: [createPlayer('19', 'ElectroTD', 3), createPlayer('20', 'Mars New', 2)] },
    { id: 111, players: [createPlayer('21', 'maduang', 1), createPlayer('22', 'Cake Sauce', 2)] },
    { id: 112, players: [createPlayer('23', 'K45en', 1), createPlayer('24', 'KiraKiraAyu', 1)] },
    { id: 113, players: [createPlayer('25', 'pepmoutain', 2), createPlayer('26', '-Mqre-', 1)] },
    { id: 114, players: [createPlayer('27', 'Hinanawi Momoko', 3), createPlayer('28', 'ZxKirara', 3)] },
  ]);

  const [freeAgents, setFreeAgents] = useState([
    createPlayer('29', 'AstonFrenchWine', 1),
    createPlayer('30', 'miltonfs', 1),
    createPlayer('31', 'Truth you left', 1),
    createPlayer('32', 'TwinIslandMilk', 1),
    createPlayer('33', 'WuYilcft', 1),
    createPlayer('34', 'babyvzzz', 1),
    createPlayer('35', 'BG eggman', 1),
    createPlayer('36', 'QiCaiLieMaxMox', 1),
    createPlayer('37', 'ShandenYamada', 1),
    createPlayer('38', 'JD14121', 2),
    createPlayer('39', 'EveLiya', 2),
    createPlayer('40', 'Trecont', 2),
    createPlayer('41', 'TTTtraitor', 2),
    createPlayer('42', 'ATRI514', 2),
    createPlayer('43', 'NaimuTongzi', 2),
    createPlayer('44', '[SomaRia]', 2),
    createPlayer('45', 'Senbe1', 3),
    createPlayer('46', 'astralrain', 3),
    createPlayer('47', 'Fyu_Neru', 3),
    createPlayer('48', 'Zh_Jk', 3),
  ]);

  // const [current, setCurrent] = useState(null);
  const [current, setCurrent] = useState(createPlayer(DUMMY_PLAYER, 'Click Randomize Team! button to start.', 'T'),);
  const [isCurrentPair, setIsCurrentPair] = useState(false);

  // useEffect(() => {
  //   initializeNext();
  // }, []); // Run only once on mount

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shufflePlayers = () => {
    setPairs(prevPairs => shuffleArray([...prevPairs]));
    setFreeAgents(prevFreeAgents => shuffleArray([...prevFreeAgents]));
  };

  const sortPlayersByTier = (players) => {
    return players.sort((a, b) => a.tier - b.tier);
  };

  const isTeamCompatible = (team, players) => {
    const tierCounts = { 1: 0, 2: 0, 3: 0 };
    team.players.forEach(player => tierCounts[player.tier]++);
    players.forEach(player => tierCounts[player.tier]++);

    return tierCounts[1] <= 2 && tierCounts[2] <= 2 && tierCounts[3] <= 2;

  };

  const initializeNext = () => {
    if (pairs.length > 0) {
      setCurrent(pairs[0]);
      setPairs(prevPairs => prevPairs.slice(1));
      setIsCurrentPair(true)
    } else if (freeAgents.length > 0) {
      setCurrent(freeAgents[0]);
      setFreeAgents(prevFreeAgents => prevFreeAgents.slice(1));
      setIsCurrentPair(false)
    } else {
      setCurrent(null);
    }
  };

  const randomizeTeam = () => {
    if (!current) return;

    if (current.id === DUMMY_PLAYER) {
      initializeNext();
      return;
    }

    let targetTeam = null;

    if (Array.isArray(current.players)) {
      // Handle pair
      const compatibleTeams = teams.filter(team => isTeamCompatible(team, current.players));
      if (compatibleTeams.length > 0) {
        targetTeam = compatibleTeams[Math.floor(Math.random() * compatibleTeams.length)];
      } else {
        setFreeAgents(prevFreeAgents => [...prevFreeAgents, ...current.players]);
      }
    } else {
      // Handle single player
      const compatibleTeams = teams.filter(team => isTeamCompatible(team, [current]));
      if (compatibleTeams.length > 0) {
        targetTeam = compatibleTeams[Math.floor(Math.random() * compatibleTeams.length)];
      } else {
        // setFreeAgents(prevFreeAgents => [...prevFreeAgents, current]);
      }
    }

    if (targetTeam) {
      setTeams(prevTeams => {
        const updatedTeams = [...prevTeams];
        const teamIndex = updatedTeams.findIndex(team => team.id === targetTeam.id);

        if (Array.isArray(current.players)) {
          current.players.forEach(player => {
            if (!targetTeam.players.some(p => p.id === player.id)) {
              updatedTeams[teamIndex].players.push(player);
            }
          });
        } else {
          if (!updatedTeams[teamIndex].players.some(p => p.id === current.id)) {
            updatedTeams[teamIndex].players.push(current);
          }
        }

        // Sort players by tier after insertion
        updatedTeams[teamIndex].players = sortPlayersByTier(updatedTeams[teamIndex].players);

        return updatedTeams;
      });
    }

    // Initialize next player or pair
    initializeNext();
  };

  return (
    <div className="app">
      <div className="teams">
        {teams.map(team => (
          <TeamPanel key={team.id} team={team} />
        ))}
      </div>
      <div className="players-container">
        <RandomizerPanel current={current} onRandomize={randomizeTeam} onShufflePlayers={shufflePlayers} isPair={isCurrentPair} />
        <div className="lists">
          <ListPanel title="Pairs" items={pairs} isPair={true} />
          <ListPanel title="Free Agents" items={freeAgents} />
        </div>
      </div>
    </div>
  );
};

export default App;
