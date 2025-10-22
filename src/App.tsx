import { useState, useEffect } from 'react'
import { useLocalStorageState } from './hooks/useLocalStorageState';
import './App.css'
import { TeamColumn } from './TeamColumnComponent';

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
  const [selectedFormat, setSelectedFormat] = useState("gen9ou");
  const formats = 
  {  "Random Battle" :"gen9randombattle",
    "Unrated Random Battle" : "gen9unratedrandombattle",
    "Free-For_all random Battle": "gen9freeforallrandombattle",
    "Random Battle (Blitz)": "gen9randombattleblitz",
    "OU" : "gen9ou",
    "Ubers" : "gen9ubers",
    "UU": "gen9uu",
    "RU": "gen9ru",
    "NU" : "gen9nu",
    "PU" : "gen9pu",
    "LC": "gen9lc",
    "Monotype": "gen9monotype",
    "CAP": "gen9cap",
    "BSS Reg J": "gen9bssregj",
  }

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
    const res = await fetch('http://localhost:3000/simulation/begin', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        team1Json: team1,
        team2Json: team2,
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
        <div className = "text-center">
          {/* Begin Battle Area */}
          <button 
          className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000} active:translate-y-1 active:shadow-none transition m-4"
          onClick = {handleSingles}
          >
            Singles  
          </button>
          <button 
          className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-[2px_2px_0_#000] hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000} active:translate-y-1 active:shadow-none transition m-4"
          onClick = {handleSingles}
          >
            Doubles 
          </button>
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
