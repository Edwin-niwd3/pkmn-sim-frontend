// Put this component in the same file below App or in a new TeamColumn.tsx and import it.
import { useState, useRef, useEffect } from 'react';
import { getSpriteUrl } from '../utils/Sprites';
import { getTypesForSpecies, validateSpecies } from '../utils/PokemonInfo';
import { typeColors } from '../utils/TypeColors';

  type Pokemon = {
    name?: string | null;
    types?: string[];
    species: string;
    item?: string | null;
    gender?: string | null;
    ability?: string | null;
    nature?: string;
    evs?: Record<string, number>;
    ivs?: Record<string, number>;
    moves: string[];
  }

type TeamColumnProps = {
  title: string;
  team: Pokemon[];
  onAdd: (poke: Pokemon) => boolean;
  onUpdate: (index: number, patch: Partial<Pokemon>) => boolean;
  onRemove: (index: number) => boolean;
  canAdd: boolean;
};

export function TeamColumn({ title, team, onAdd, onUpdate, onRemove, canAdd }: TeamColumnProps) {
  
  const [focusedPokemonIndex, setFocusedPokemonIndex] = useState<number | null>(null);
  const [focusedPokemon, setFocusedPokemon] = useState<Pokemon | null> (null);
  const [addFlag, setAddFlag] = useState<boolean>(false);
  
  const handleConfirm = async (updatePoke: Pokemon, PokeIndex: number) => {
    if (!updatePoke) return;
    const currentSpecies = updatePoke.species;
    const valid = await validateSpecies(currentSpecies);

    if (!valid) {
      alert("Invalid species name");
      return;
    }
    // Call the onUpdate prop
    if (addFlag) {
      const success = onAdd(updatePoke);
      setAddFlag(false);
    }
    else {onUpdate(PokeIndex!, updatePoke!);}

    //Reset focus
    setFocusedPokemon(null);
    setFocusedPokemonIndex(null);
  }

  const handleCreate = () => {
    const newPoke: Pokemon = {
      species: 'Pikachu',
      moves: ["Volt Tackle", "Iron Tail", "Quick Attack", "Thunder Wave"],
      evs: {hp: 4, atk: 252, def: 0, spa: 252, spd: 0, spe: 0},
      types: ['electric'],
      ability: 'lightning rod'
    };
    setFocusedPokemon(newPoke);
    setFocusedPokemonIndex(team.length);
    setAddFlag(true);
  }

  const topRef = useRef<HTMLDivElement | null> (null);

  useEffect(() => {
    if(focusedPokemon && topRef.current) {
      topRef.current.scrollIntoView({behavior: "smooth", block: "start"});
    }
  }, [focusedPokemon]);

  // Render fixed 6 slots (0..5). If team has fewer than 6, show "Empty slot" UI.
  return (
    <div ref = {topRef} className = "max-w-md bg-slate-100 border border-grey-300 rounded-xl shadow-md overflow-hidden p-4">
      {title}
      {focusedPokemon === null ? (
      <>
      <ul className = "list-none block">
      {team.map((poke, idx) => (
        <>
        <li value = {idx} className = "list-none relative" onClick = {() => {
        setFocusedPokemon(poke); 
        setFocusedPokemonIndex(idx);
        }}>

          <div className = "flex justify-between items-start mb-2">
            <input 
            type="text" 
            placeholder = "Nickname" 
            value = {poke.name || ''} 
            className = "font-semibold text-lg bg-transparent border-b border-grey-300 focus:outline-none w-1/2"
            readOnly
            />
          </div>
          {/* Pokemon Sprite and info */}
          <div className = "flex items-center gap-4">
            <img src={getSpriteUrl(poke.species)}
            alt = {poke.species} className = 'w-16 h-16'/>
            <div className = "flex-1 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className = "font-semibold">Type:</span></p>
                <div className = 'flex gap-1 mt-1'>
                  {poke?.types?.map((type, typeIdx) => (
                    <span 
                    key={typeIdx} 
                    className="px-2 py-0.5 bg-gray-400 text-white text-xs rounded"
                    style = {{backgroundColor: typeColors[type] || '#6b7280'}}
                    >
                      {type}
                    </span>
                  ))}

                </div>
              </div>
            </div>
          </div>
          {/* Abilities and items and moves */}
          <div className="mt-3 grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Pokemon: </span>{poke.species}</p>
              <p><span className="font-semibold">Item: </span>{poke.item}</p>
              <p><span className="font-semibold">Ability: </span>{poke.ability}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Moves</p>
              <ul className="list-none ml-4 space-y-1">
                {poke.moves.map((move, moveIdx) => (
                  <li key={moveIdx}>{move}</li>
                ))}
              </ul>
            </div>
          </div>
          {/*Evs*/}
          <div className="mt-3">
            <p className="font-semibold mb-1 text-sm">Evs</p>
            <div className="space-y-1 text-sm">
            {Object.entries(poke.evs ?? {}).map(([stat, ev]) => (
              <div key={stat} className="flex items-center justify-between gap-3">
                <span className="w-12">{stat.toUpperCase()}</span>
                <div className="flex-1">
                  {/* Visual slider that looks like the previous bar. Disabled in list view. */}
                  <input
                    type="range"
                    min={0}
                    max={252}
                    value={ev}
                    disabled
                    className="w-full h-2 bg-gray-200 appearance-none rounded overflow-hidden range-no-focus"
                    onChange={() => { /* noop in list view */ }}
                    style={{ background: `linear-gradient(to right, #34d399 ${(ev / 252) * 100}%, #e5e7eb ${(ev / 252) * 100}%)` }}
                  />
                </div>
                <span className="w-8 text-right">{ev}</span>
              </div>
            ))}
            </div>
          </div>
        </li>
        <button
          className="text-red-600 hover:text-red-800 font-semibold"
          onClick = {() => onRemove(idx)}
        >
          Remove
        </button>

        </>
      ))}
      </ul>
      {team.length < 6 && canAdd && (
        <button onClick = {() => {handleCreate()}}>Add Pokemon</button>
      )}
      </>
      ) 
      : 
      (        
        <>
        {/* FOCUS EDITING MODE */}
        {/* Nickname */}
        <div className = "flex justify-between items-start mb-2">
            <input 
            type="text" 
            placeholder = "Nickname" 
            value = {focusedPokemon.name || ''} 
            className = "font-semibold text-lg bg-transparent border-b border-grey-300 focus:outline-none w-1/2"
            onChange = {(e) => {
              const newName = String(e.target.value);
              setFocusedPokemon((prev): Pokemon | null => {
                if (!prev) return prev;
                
                return {
                  ...prev,
                  name: newName,
                };
              });
            }}
            />
          </div>
          {/* Pokemon Sprite and info */}
          <div className = "flex items-center gap-4">
            <img src={getSpriteUrl(focusedPokemon.species)}
            alt = {focusedPokemon.species} className = 'w-16 h-16'/>
            <div className = "flex-1 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className = "font-semibold">Type:</span></p>
                <div className = 'flex gap-1 mt-1'>
                  {focusedPokemon?.types?.map((type, typeIdx) => (
                    <span 
                    key={typeIdx} 
                    className="px-2 py-0.5 text-white text-xs rounded"
                    style = {{backgroundColor: typeColors[type] || '#6b7280'}}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Abilities and items and moves */}
          <div className="mt-3 grid-cols-2 gap-4 text-sm">
            <div className = "space-y-2">
              <p className = "flex items-center gap-2">
                <span className="w-24 font-semibold">
                  Pokemon: 
                </span>
                <input
                type = "text"
                value = {focusedPokemon.species || ''}
                spellCheck = {false}
                className = "bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500  bg-transparent focus:outline-none w-50 text-center min-w-0 text-left"
                onChange={(e) => {
                  const newSpecies = e.target.value;
                  setFocusedPokemon((prev) => prev ? { ...prev, species: newSpecies } : prev);
                }}
                onBlur={async (e) => {
                  const newSpecies = e.target.value;
                  const newTypes = await getTypesForSpecies(newSpecies);
                  setFocusedPokemon((prev) =>
                    prev ? { ...prev, types: newTypes } : prev
                  );
                }}
                />
                </p>
              <p className = "flex items-center gap-2">
                <span className="w-24 font-semibold">
                Item: 
                </span>
                <input
                type = "text"
                value = {focusedPokemon.item || ''}
                spellCheck = {false}
                className = "bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500  bg-transparent focus:outline-none w-50 text-center min-w-0 text-left left-50"
                onChange ={(e) => {
                  const newItem = String(e.target.value);
                  setFocusedPokemon((prev): Pokemon | null => {
                    if (!prev) return prev;
                    
                    return {
                      ...prev,
                      item: newItem,
                    };
                  });
                }}
                />
                </p>
              <p className = "flex items-center gap-2">
                <span className="w-24 font-semibold">
                  Ability: 
                  </span>
                  <input
                type = "text"
                value = {focusedPokemon.ability || ''}
                className = "bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500  bg-transparent focus:outline-none w-50 text-center min-w-0 text-left"
                spellCheck = {false}
                onChange ={(e) => {
                  const newAbility = String(e.target.value);
                  setFocusedPokemon((prev): Pokemon | null => {
                    if (!prev) return prev;
                    
                    return {
                      ...prev,
                      ability: newAbility,
                    };
                  });
                }}
                />
                  </p>
            </div>
            <div>
              <p className="font-semibold mb-1 flex">Moves</p>
              <ul className="list-none ml-4 space-y-1">
                {focusedPokemon.moves.map((move, moveIdx) => (
                  <li className = "list-none flex items-center justify-center w-full" key={moveIdx}>
                      <input
                      type="text"
                      value={move}
                      className="bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 w-full text-center"
                      onChange={(e) => {
                        const newMove = String(e.target.value);
                        setFocusedPokemon((prev): Pokemon | null => {
                          if (!prev) return prev;

                          const currentMoves = prev.moves ?? [];
                          const updatedMoves = currentMoves.map((m, i) => (i === moveIdx ? newMove : m));

                          return {
                            ...prev,
                            moves: updatedMoves,
                          };
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/*Evs*/}
          <div className="mt-3">
            <p className="font-semibold mb-1 text-sm">Evs</p>
            <div className="space-y-1 text-sm">
            {Object.entries(focusedPokemon.evs ?? {}).map(([stat, ev]) => (
              <div key={stat} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>{stat.toUpperCase()}</span>
                  <span>{ev}</span>
                  {/* Slider input */}
                  <input
                  type="range"
                  min={0}
                  max={252}
                  step={4}
                  value={ev}
                  onChange={(e) => {
                  const newVal = Number(e.target.value);

                  setFocusedPokemon((prev): Pokemon | null => {
                    if (!prev) return prev;

                    const currentEvs = prev.evs ?? {};
                    const currentTotal = Object.values(currentEvs).reduce((a, b) => a + b, 0);
                    const oldVal = currentEvs[stat] ?? 0;
                    const totalAfterChange = currentTotal - oldVal + newVal;
                    
                    if (totalAfterChange > 510) return prev;

                    return {
                      ...prev,
                      evs: {
                        ...currentEvs,
                        [stat]: newVal,
                      },
                    };
                  });
                }}

                  className="w-48 accent-green-500"
                />
                </div>
              </div>
            ))}
            </div>
          </div>
          <button onClick = {() => {
            handleConfirm(focusedPokemon!, focusedPokemonIndex!);
          }}>Back to Team View</button>
        </>
      )}
      
    </div>
  );
}