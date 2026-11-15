import { useState } from 'react'
import { useLocalStorageState } from './hooks/useLocalStorageState';
import './App.css'
import {formats} from '../utils/Formats'
import {defaultTeam1, defaultTeam2, DEFAULT_FORMAT} from '../utils/DefaultTeams'
import {type Pokemon} from '../utils/Pokemon'
import { TeamColumn } from './TeamColumnComponent';
import 'ldrs/react/Bouncy.css'
import { PokemonSprite } from '../utils/Sprites';
import { ResultsPage } from './ResultsPage';


function App() {


  // team expand/collapse state removed in favor of TeamColumn component
  const [team1, setTeam1] = useLocalStorageState<Pokemon[]>("team1", defaultTeam1);
  const [team2, setTeam2] = useLocalStorageState<Pokemon[]>("team2", defaultTeam2);
  const [error1, setError1] = useState<String | null>(null);
  const [error2, setError2] = useState<String | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>(DEFAULT_FORMAT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [battlers, setBattlers] = useState<[Pokemon, Pokemon] | null>(null);
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [numAttempts, setNumAttempts] = useState<number>(100);

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

  const handleSingles = async () => {
    setIsLoading(true);
    const pick = (t: Pokemon[]) => t[Math.floor(Math.random() * t.length)];
    setBattlers([pick(team1), pick(team2)]);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/simulation/abtest`, {
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

  if (isLoading && battlers) {
    const [mine,theirs] = battlers;
    return (
      <div className = "flex flex-col items-center gap-6 py-16">
        <div className = "relative w-96 h-48">
          <div className = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-300 opacity-0 animate-clash motion-reduce:animate-none" style = {{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
          <PokemonSprite key = {theirs.species} species = {theirs.species} className = "absolute top-0 right-4 w-28 animate-lunge-left motion-reduce:animate-none"/>
          <PokemonSprite key = {mine.species} species = {mine.species} back className = "absolute bottom-0 left-4 w-28 animate-lunge-right motion-reduce:animate-none"/>
        </div>
        <p className = "text-slate-600"> Simulating {numAttempts} battles...</p>
      </div>
    );
  }

  if(results) {
    return <ResultsPage results={results} onReturn={() => setResults(null)} />;
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
            onChange= {(e) => {
              setNumAttempts(Number(e.target.value))
            }}
            className = "px-5 py-2 rounded-full bg-white text-black font-bold shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] active:translate-y-1 active:shadow-none transition m-4"
            >
              <option key= "50" value="50">50</option>
              <option key = "100" value="100">100</option>
              <option key = "500" value="500">500</option>
            </select>
          </div>

          <div>  
            <button 
            className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000} active:translate-y-1 active:shadow-none transition m-4"
            onClick = {handleSingles}
            >
              Begin Battle
            </button>
            <button 
            className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] active:translate-y-1 active:shadow-none transition m-4"
            onClick = {() => {
              setTeam1(defaultTeam1);
              setTeam2(defaultTeam2);
              setSelectedFormat(DEFAULT_FORMAT);
            }}
            >
              Load Test Teams
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
