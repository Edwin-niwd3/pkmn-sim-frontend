import { useState } from 'react'
import './App.css'
import { TeamColumn } from './TeamColumnComponent';

function App() {
  type Pokemon = {
    name?: string | null;
    species: string;
    item?: string | null;
    gender?: string | null;
    ability?: string | null;
    nature?: string;
    evs?: Record<string, number>;
    ivs?: Record<string, number>;
    moves: string[];
  }

  

  const [team1, setTeam1] = useState<Pokemon[]>([{
    "name": "",
    "species": "Articuno",
    "gender": "",
    "item": "Leftovers",
    "ability": "Pressure",
    "evs": {"hp": 252, "atk": 0, "def": 0, "spa": 252, "spd": 4, "spe": 0},
    "nature": "Modest",
    "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 30, "spd": 30, "spe": 31},
    "moves": ["Ice Beam", "Hurricane", "Substitute", "Roost"]
  },
  {
    "name": "",
    "species": "Ludicolo",
    "gender": "",
    "item": "Life Orb",
    "ability": "Swift Swim",
    "evs": {"hp": 4, "atk": 0, "def": 0, "spa": 252, "spd": 0, "spe": 252},
    "nature": "Modest",
    "moves": ["Surf", "Giga Drain", "Ice Beam", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Volbeat",
    "gender": "M",
    "item": "Damp Rock",
    "ability": "Prankster",
    "evs": {"hp": 248, "atk": 0, "def": 252, "spa": 0, "spd": 8, "spe": 0},
    "nature": "Bold",
    "moves": ["Tail Glow", "Baton Pass", "Encore", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Seismitoad",
    "gender": "",
    "item": "Life Orb",
    "ability": "Swift Swim",
    "evs": {"hp": 0, "atk": 0, "def": 0, "spa": 252, "spd": 4, "spe": 252},
    "nature": "Modest",
    "moves": ["Hydro Pump", "Earth Power", "Stealth Rock", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Alomomola",
    "gender": "",
    "item": "Damp Rock",
    "ability": "Regenerator",
    "evs": {"hp": 252, "atk": 0, "def": 252, "spa": 0, "spd": 4, "spe": 0},
    "nature": "Bold",
    "moves": ["Quick Attack", "Protect", "Toxic", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Armaldo",
    "gender": "",
    "item": "Leftovers",
    "ability": "Swift Swim",
    "evs": {"hp": 128, "atk": 252, "def": 4, "spa": 0, "spd": 0, "spe": 124},
    "nature": "Adamant",
    "moves": ["X-Scissor", "Stone Edge", "Aqua Tail", "Rapid Spin"]
   }]);
  const [team2, setTeam2] = useState<Pokemon[]>([{
    "name": "",
    "species": "Articuno",
    "gender": "",
    "item": "Leftovers",
    "ability": "Pressure",
    "evs": {"hp": 252, "atk": 0, "def": 0, "spa": 252, "spd": 4, "spe": 0},
    "nature": "Modest",
    "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 30, "spd": 30, "spe": 31},
    "moves": ["Ice Beam", "Hurricane", "Substitute", "Roost"]
  },
  {
    "name": "",
    "species": "Ludicolo",
    "gender": "",
    "item": "Life Orb",
    "ability": "Swift Swim",
    "evs": {"hp": 4, "atk": 0, "def": 0, "spa": 252, "spd": 0, "spe": 252},
    "nature": "Modest",
    "moves": ["Surf", "Giga Drain", "Ice Beam", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Volbeat",
    "gender": "M",
    "item": "Damp Rock",
    "ability": "Prankster",
    "evs": {"hp": 248, "atk": 0, "def": 252, "spa": 0, "spd": 8, "spe": 0},
    "nature": "Bold",
    "moves": ["Tail Glow", "Baton Pass", "Encore", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Seismitoad",
    "gender": "",
    "item": "Life Orb",
    "ability": "Swift Swim",
    "evs": {"hp": 0, "atk": 0, "def": 0, "spa": 252, "spd": 4, "spe": 252},
    "nature": "Modest",
    "moves": ["Hydro Pump", "Earth Power", "Stealth Rock", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Alomomola",
    "gender": "",
    "item": "Damp Rock",
    "ability": "Regenerator",
    "evs": {"hp": 252, "atk": 0, "def": 252, "spa": 0, "spd": 4, "spe": 0},
    "nature": "Bold",
    "moves": ["Quick Attack", "Protect", "Toxic", "Rain Dance"]
  },
  {
    "name": "",
    "species": "Armaldo",
    "gender": "",
    "item": "Leftovers",
    "ability": "Swift Swim",
    "evs": {"hp": 128, "atk": 252, "def": 4, "spa": 0, "spd": 0, "spe": 124},
    "nature": "Adamant",
    "moves": ["X-Scissor", "Stone Edge", "Aqua Tail", "Rapid Spin"]
   }]);

  // team expand/collapse state removed in favor of TeamColumn component

  const MAX_TEAM_SIZE = 6;

  function canAddToTeam(team: Pokemon[]) {
    return team.length < MAX_TEAM_SIZE;
  }

  function addPokemonToTeam(setTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>, team: Pokemon[], pokemon: Pokemon): boolean {
    if (!canAddToTeam(team)) return false; 
      setTeam([...team, pokemon]);
      return true;
  }

  function updatePokemonInTeam(setTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>, team: Pokemon[], index: number, updatedPokemon: Partial<Pokemon>): boolean {
    if (index < 0 || index >= team.length) return false;
    setTeam(prev => prev.map((p,i) => (i=== index ? {...p,...updatedPokemon } : p)));
    return true;
  }

  function removePokemonFromTeam(setTeam: React.Dispatch<React.SetStateAction<Pokemon[]>>, team: Pokemon[], index: number): boolean {
    if (index < 0 || index >= team.length) return false;
    setTeam(prev => prev.filter((_,i) => i !== index));
    return true;
  }

  // Note: sprite and pokedex URL helpers removed (not used in this simplified App)



  return (
    <>
  <div className = "min-h-screen flex flex-col justify-start items-center gap-4 py-8">
        <h1 className = "text-3xl font-bold">
          Pokemon Win Rate Calculator
        </h1>
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
