import { useState } from 'react'
import './App.css'

function App() {

  const [team1, setTeam1] = useState([{
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
  const [team2, setTeam2] = useState([{
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

  const [expandedTeam1, setExpandedTeam1] = useState<number | null>(null);
  const [expandedTeam2, setExpandedTeam2] = useState<number | null>(null);

  function toggleIndex(current: number | null, set: (v:number | null) => void, index: number) {
    set(current === index ? null : index)
  }

  return (
    <>
  <div className = "min-h-screen flex flex-col justify-start items-center gap-4 py-8">
        <h1 className = "text-3xl font-bold">
          Pokemon Win Rate Calculator
        </h1>
        <div className = "text-center grid grid-cols-2 gap-4">
          {/*First section*/}
          <div className = "bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
            <h2>Team One</h2>
            {team1.map((pokemon, index) => (
              <div key={index} className = "mb-4">
                <button
                type = "button"
                className = "w-full text-left flex items-center justify-between py-2"
                onClick = {() => toggleIndex(expandedTeam1, setExpandedTeam1, index)}
                aria-expanded = {expandedTeam1 === index}
                aria-controls = {`team1-pokemon-${index}`}
                >
                {expandedTeam1 !== index && (
                <span className = "font-semibold">{pokemon.name || pokemon.species}</span>
                )}

                {expandedTeam1 === index && (
                <div key = {`team1-pokemon-${index}`} className = "mt-2 text-sm">
                <h3 className = "font-semibold">{pokemon.species}</h3>
                <p>Item: {pokemon.item}</p>
                <p>Ability: {pokemon.ability}</p>
                <p>Nature: {pokemon.nature}</p>
                <p>EVs: {Object.entries(pokemon.evs).map(([stat, value]) => `${stat.toUpperCase()}: ${value}`).join(', ')}</p>
                <p>Moves: {pokemon.moves.join(', ')}</p>
              </div>
                )}
                <span className = "text-sm text-black/60">{expandedTeam1 === index?'▲' : '▼'}</span>

                </button>
              </div>
            ))}
          </div>
          {/*Second section*/}
          <div className = "bg-white/10 p-4 rounded-lg backdrop-blur-md border border-white/20">
            <h2>Team Two</h2>
            {team2.map((pokemon, index) => (
              <div key={index} className = "mb-4">
                <button
                type = "button"
                className = "w-full text-left flex items-center justify-between py-2"
                onClick = {() => toggleIndex(expandedTeam2, setExpandedTeam2, index)}
                aria-expanded = {expandedTeam2 === index}
                aria-controls = {`team2-pokemon-${index}`}
                >
                {expandedTeam2 !== index && (
                <span className = "font-semibold">{pokemon.name || pokemon.species}</span>
                )}

                {expandedTeam2 === index && (
                <div key = {`team2-pokemon-${index}`} className = "mt-2 text-sm">
                <h3 className = "font-semibold">{pokemon.species}</h3>
                <p>Item: {pokemon.item}</p>
                <p>Ability: {pokemon.ability}</p>
                <p>Nature: {pokemon.nature}</p>
                <p>EVs: {Object.entries(pokemon.evs).map(([stat, value]) => `${stat.toUpperCase()}: ${value}`).join(', ')}</p>
                <p>Moves: {pokemon.moves.join(', ')}</p>
              </div>
                )}
                <span className = "text-sm text-black/60">{expandedTeam1 === index?'▲' : '▼'}</span>

                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
