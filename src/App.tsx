import { useState } from 'react'
import { useLocalStorageState } from './hooks/useLocalStorageState';
import './App.css'
import {formats} from '../utils/Formats'
import { TeamColumn } from './TeamColumnComponent';
import {Bouncy} from 'ldrs/react';
import 'ldrs/react/Bouncy.css'

function App() {
  type Pokemon = {
    name?: string | null;
    species: string;
    types?: string[];
    item?: string | null;
    gender?: string | null;
    ability?: string | null;
    nature?: string;
    evs?: Record<string, number>;
    ivs?: Record<string, number>;
    moves: string[];
  }

  // team expand/collapse state removed in favor of TeamColumn component
  const [team1, setTeam1] = useLocalStorageState<Pokemon[]>("team1", []);
  const [team2, setTeam2] = useLocalStorageState<Pokemon[]>("team2", []);
  const [error1, setError1] = useState<String | null>(null);
  const [error2, setError2] = useState<String | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("gen9ou");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [numAttempts, setNumAttempts] = useState<number>(50);

  const MAX_TEAM_SIZE = 6;

  function canAddToTeam(team: Pokemon[]) {
    return team.length < MAX_TEAM_SIZE;
  }

  //onAdd
  function addPokemonToTeam(setTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>, team: Pokemon[], pokemon: Pokemon): boolean {
    if (!canAddToTeam(team)) return false; 
      setTeam([...team, pokemon]);
      return true;
  }

  //onUpdate
  function updatePokemonInTeam(setTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>, team: Pokemon[], index: number, updatedPokemon: Partial<Pokemon>): boolean {
    if (index < 0 || index >= team.length) return false;
    setTeam(prev => prev.map((p,i) => (i=== index ? {...p,...updatedPokemon } : p)));
    return true;
  }

  //onRemove
  function removePokemonFromTeam(setTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>, team: Pokemon[], index: number): boolean {
    if (index < 0 || index >= team.length) return false;
    setTeam(prev => prev.filter((_,i) => i !== index));
    return true;
  }

  // Note: sprite and pokedex URL helpers removed (not used in this simplified App)

  const handleSingles = async () => {
    setIsLoading(true);
    const res = await fetch('http://localhost:3000/simulation/abtest', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        team1Json: team1,
        team2Json: team2,
        formatJson: selectedFormat,
        numSimulations: numAttempts,
      })
    });
    const result = await res.json();
    if (result['errorTeam1'])
    {
      setError1(result['errorTeam1']);
    }
    if (result['errorTeam2'])
    {
      setError2(result['errorTeam2']);
    }
    console.log(result)
    setResults(result);
    setIsLoading(false);
  }

  if (error1 || error2) {
    return (
      <>
      <div className = "flex justify-center">
      <div className = "max-w-md bg-slate-100 border border-grey-300 rounded-xl shadow-md overflow-hidden p-4">
        {error1 && (
          <>
          <p>
            Team One: {error1}
          </p>
          </>
        )}
        {error2 && (
          <p>
            Team Two: {error2}
          </p>
        )}

        <button
        onClick = {() => {
          setError1(null);
          setError2(null);
          setResults(null);
        }}
        >
          Return
        </button>
        </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
      <Bouncy
      size = "45"
      speed = "1.75"
      color = "Blue"
      />
      </>
    )
  }

  if(results) {
    return(
      <>
        <div className = "flex justify-center">
        <div className = "max-w-md bg-slate-100 border border-grey-300 rounded-xl shadow-md overflow-hidden p-4">
          <p>{results.message}</p>
          <p>Average Duration Per Battle: {results.averageDurationMs}ms</p>
          
          <p>Stats</p>
          <p>Draws: {results.draws}</p>
          <div className = "grid grid-cols-2">
            <div>
              <h1>
                Team 1
              </h1>
              <p>Team 1 win rate: {results.winRates.player1}</p>
              <p>Number of games won: {results.player1Wins}</p>
            </div>
            <div>
              <h1>
                Team 2
              </h1>
              <p>Team 2 win rate: {results.winRates.player2}</p>
              <p>Number of games won: {results.player2Wins}</p>
            </div>
          </div>
          <button
          onClick = {() => {
            setResults(null);
          }}
          >
            Return
          </button>
          </div>
          </div>
        </>
      )
  }

  return (
    <>
  <div className = "min-h-screen flex flex-col justify-start items-center gap-4 py-8">
        <h1 className = "text-3xl font-bold">
          Pokemon Win Rate Calculator
        </h1>

        {/* Begin Battle Area */}
        <div className = "text-center grid grid-cols-3">
          <div>
            <select
            value = {selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className = "px-5 py-2 rounded-full bg-white text-black font-bold shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000} active:translate-y-1 active:shadow-none transition m-4"
            >
            {Object.entries(formats ?? {}).map(([formatName, formatValue]) => (
              <option key = {formatValue} value= {formatValue}>
                {formatName}
              </option>
            ))}
            </select>
          </div>

          <div>
            <select
            value = {numAttempts}
            onChange= {(e) => setNumAttempts(Number(e.target.value))}
            className = "px-5 py-2 rounded-full bg-white text-black font-bold shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000} active:translate-y-1 active:shadow-none transition m-4"
            >
              <option key = "100" value="100">100</option>
              <option key = "500" value="500">500</option>
              <option key = "1000" value="1000">1000</option>
            </select>
          </div>

          <div>  
            <button 
            className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000} active:translate-y-1 active:shadow-none transition m-4"
            onClick = {handleSingles}
            >
              Begin Battle  
            </button>
          </div>
        </div>

        <div className = "text-center grid grid-cols-2 gap-4">
          {/*First section*/}
          <div className = "bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
            <TeamColumn
              title="Team One"
              team={team1}
              onAdd={(poke) => addPokemonToTeam(setTeam1, team1, poke)}
              onUpdate={(idx, patch) => updatePokemonInTeam(setTeam1, team1, idx, patch)}
              onRemove={(idx) => removePokemonFromTeam(setTeam1, team1, idx)}
              canAdd={canAddToTeam(team1)}
            />
          </div>
          {/*Second section*/}
          <div className = "bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
            <TeamColumn
              title="Team Two"
              team={team2}
              onAdd={(poke) => addPokemonToTeam(setTeam2, team2, poke)}
              onUpdate={(idx, patch) => updatePokemonInTeam(setTeam2, team2, idx, patch)}
              onRemove={(idx) => removePokemonFromTeam(setTeam2, team2, idx)}
              canAdd={canAddToTeam(team2)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
