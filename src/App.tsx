import { useState , useEffect, useRef} from 'react'
import { useLocalStorageState } from './hooks/useLocalStorageState';
import './App.css'
import {formats} from '../utils/Formats'
import {defaultTeam1, defaultTeam2, DEFAULT_FORMAT} from '../utils/DefaultTeams'
import {type Pokemon, type SimulationResults} from '../utils/Pokemon'
import {mergeResults} from '../utils/mergeResults'
import { TeamColumn } from './TeamColumnComponent';
import 'ldrs/react/Bouncy.css'
import { PokemonSprite } from '../utils/Sprites';
import { ResultsPage } from './ResultsPage';
import { splitErrors } from '../utils/splitErrors'

async function fetchTeamErrors(team: Pokemon[], format: string): Promise<string[] | null> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/simulation/validate`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ teamJson: team, formatJson: format}),
    });
    const result = await res.json();
    return result.error ?? null;
}

const BATCH_SIZE = 25;

function ErrorList({ errors, side } : { errors: string[] | null; side: 'left' | 'right'}) {
  return (
    <ul className = {`text-sm text-red-300 ${side === 'left' ? 'text-right' : 'text-left'}`}>
      {errors?.map((msg, i) => <li key = {i}>{msg}</li>)}
    </ul>
  )
}

function App() {


  // team expand/collapse state removed in favor of TeamColumn component
  const [team1, setTeam1] = useLocalStorageState<Pokemon[]>("team1", defaultTeam1);
  const [team2, setTeam2] = useLocalStorageState<Pokemon[]>("team2", defaultTeam2);
  const [error1, setError1] = useState<string[] | null>(null);
  const [error2, setError2] = useState<string[] | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>(DEFAULT_FORMAT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [battlers, setBattlers] = useState<[Pokemon, Pokemon] | null>(null);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [numAttempts, setNumAttempts] = useState<number>(100);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<number>(0);
  const [cancelling, setCancelling] = useState(false);
  const cancelRef = useRef(false);

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

  

  useEffect(() => {
    let cancelled = false;
    fetchTeamErrors(team1, selectedFormat)
    .then(errors => { if (!cancelled) setError1(errors); })
    .catch(() => { if (!cancelled) setError1(null); });
    return () => { cancelled = true;};
  }, [team1, selectedFormat]);

  useEffect(() => {
    let cancelled = false;
    fetchTeamErrors(team2, selectedFormat)
    .then(errors => { if (!cancelled) setError2(errors); })
    .catch(() => { if (!cancelled) setError2(null); });
    return () => { cancelled = true;};
  }, [team2, selectedFormat]);

  const handleBattles = async () => {
    setCancelling(false);
    cancelRef.current = false;
    setRequestError(null);
    setIsLoading(true);
    setCompleted(0);
    const pick = (t: Pokemon[]) => t[Math.floor(Math.random() * t.length)];
    setBattlers([pick(team1), pick(team2)]);
    let total: SimulationResults | null = null;
    try {

      let remaining = numAttempts;

      while(remaining > 0) {
        if (cancelRef.current) break;
        const size = Math.min(BATCH_SIZE, remaining);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/simulation/abtest`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            team1Json: team1,
            team2Json: team2,
            formatJson: selectedFormat,
            numSimulations: size,
          }),
        });
        const result = await res.json();

        if (result.errorTeam1 || result.errorTeam2) {
          setError1(result.errorTeam1 ?? null);
          setError2(result.errorTeam2 ?? null);
          return;
        }
        if (!res.ok || result.error) {
          setRequestError(result.error ?? 'An error occurred during the simulation. Please try again later.');
          if (total) setResults(total);
          return;
        }

        total = mergeResults(total, result);
        remaining -= size;
        setCompleted(numAttempts-remaining);
      }
      setResults(total);
    }
        
    catch (error) {
      console.error('Error during simulation:', error);
      setRequestError('An error occurred during the simulation. Please try again later.');
      if(total) setResults(total)
    }
    finally {
      setIsLoading(false);
    }
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
        <p className = "text-slate-200"> Simulated {completed} / {numAttempts} battles</p>
        <div className = "w-64 h-3 bg-white/40 rounded-full overflow-hidden">
          <div 
          className = "h-full bg-green-500 transition-all duration-300"
          style = {{ width: `${(completed/numAttempts) * 100}%`}}
          />
        </div>
        <button 
            className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-pop hover:translate-y-0.5 hover:shadow-pop-sm active:translate-y-1 active:shadow-none transition m-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick = {() => {cancelRef.current = true; setCancelling(true);}}
            disabled = {cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel'}
        </button>
      </div>
    );
  }

  if(results) {
    return <ResultsPage results={results} onReturn={() => setResults(null)} />;
  }

  const split1 = splitErrors(error1, team1);
  const split2 = splitErrors(error2, team2);

  return (
    <>
  <div className = "min-h-screen flex flex-col justify-start items-center gap-4 py-8">
        <h1 className = "text-3xl font-bold text-white">
          Pokemon Win Rate Calculator
        </h1>

        {requestError && (
          <div className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role = "alert">
            <strong className = "font-bold">Error! </strong>
            <span className = "block sm:inline">{requestError}</span>
          </div>
        )}

        {/* Begin Battle Area */}
        <div className = "text-center grid grid-cols-3">
          <div>
            <select
            value = {selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className = "px-5 py-2 rounded-full bg-white text-black font-bold shadow-pop hover:translate-y-0.5 hover:shadow-pop-sm active:translate-y-1 active:shadow-none transition m-4"
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
            className = "px-5 py-2 rounded-full bg-white text-black font-bold shadow-pop hover:translate-y-0.5 hover:shadow-pop-sm active:translate-y-1 active:shadow-none transition m-4"
            >
              <option key= "50" value="50">50</option>
              <option key = "100" value="100">100</option>
              <option key = "500" value="500">500</option>
            </select>
          </div>

          <div>  
            <button 
            className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-pop hover:translate-y-0.5 hover:shadow-pop-sm active:translate-y-1 active:shadow-none transition m-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled = {!!error1 || !!error2}
            onClick = {handleBattles}
            >
              Begin Battle
            </button>
            <button 
            className = "px-5 py-2 rounded-full bg-white text-black font-bold border-4 border-black shadow-pop hover:translate-y-0.5 hover:shadow-pop-sm active:translate-y-1 active:shadow-none transition m-4"
            
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

        <div className = "w-full grid grid-cols-[minmax(0,1fr)_auto_auto_minmax(0,1fr)] gap-4 items-start">
          {/*First section*/}
          <ErrorList errors = {split1.general} side = "left"/>
          <div className = "bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
            <TeamColumn
              title="Team One"
              team={team1}
              onAdd={(poke) => addPokemonToTeam(setTeam1, team1, poke)}
              onUpdate={(idx, patch) => updatePokemonInTeam(setTeam1, team1, idx, patch)}
              onRemove={(idx) => removePokemonFromTeam(setTeam1, team1, idx)}
              canAdd={canAddToTeam(team1)}
              monErrors = {split1.perMon}
              onImport = {setTeam1}
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
              monErrors = {split2.perMon}
              onImport = {setTeam2}
            />
          </div>
          <ErrorList errors = {split2.general} side = "right"/>
        </div>
      </div>
    </>
  )
}

export default App
