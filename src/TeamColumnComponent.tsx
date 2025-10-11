// Put this component in the same file below App or in a new TeamColumn.tsx and import it.
import { useState, useEffect } from 'react';
import { getSpriteUrl } from '../utils/Sprites';


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
  const [Evs, setEvs] = useState<Record<string, number> | undefined>(focusedPokemon?.evs || {hp:0, atk:0, def:0, spa:0, spd:0, spe:0});

  // focus control handled inline via setFocusedSlot

  // Render fixed 6 slots (0..5). If team has fewer than 6, show "Empty slot" UI.
  return (
    <div className = "max-w-md bg-slate-100 border border-grey-300 rounded-xl shadow-md overflow-hidden p-4">
      {title}
      {focusedPokemon === null ? (
      <ul className = "list-none block">
      {team.map((poke, idx) => (
        <li value = {idx} className = "list-none relative" onClick = {() => {
        setFocusedPokemon(poke); 
        setFocusedPokemonIndex(idx);
        setEvs(poke.evs)
        }}>

          <div className = "flex justify-between items-start mb-2">
            <input type="text" placeholder = "Nickname" value = {poke.name || ''} className = "font-semibold text-lg bg-transparent border-b border-grey-300 focus:outline-none w-1/2"/>
          </div>
          {/* Pokemon Sprite and info */}
          <div className = "flex items-center gap-4">
            <img src={getSpriteUrl(poke.species)}
            alt = {poke.species} className = 'w-16 h-16'/>
            <div className = "flex-1 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className = "font-semibold">Level:</span></p>
                <p><span className = "font-semibold">Gender:</span></p>
                <p><span className = "font-semibold">Shiny:</span></p>
              </div>
              <div>
                <p><span className = "font-semibold">Tera Type:</span></p>
                <div className = 'flex gap-1 mt-1'>
                  <span className="px-2 py-0.5 bg-pink-400 text-white text-xs rounded">Type 1</span>
                  <span className="px-2 py-0.5 bg-blue-400 text-white text-xs rounded">Type 2</span>
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
          {/*Stats*/}
          <div className="mt-3">
            <p className="font-semibold mb-1 text-sm">Stats</p>
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
      ))}
      </ul>
      ) : (
        <>
        <div className = "flex justify-between items-start mb-2">
            <input type="text" placeholder = "Nickname" value = {focusedPokemon.name || ''} className = "font-semibold text-lg bg-transparent border-b border-grey-300 focus:outline-none w-1/2"/>
          </div>
          {/* Pokemon Sprite and info */}
          <div className = "flex items-center gap-4">
            <img src={getSpriteUrl(focusedPokemon.species)}
            alt = {focusedPokemon.species} className = 'w-16 h-16'/>
            <div className = "flex-1 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className = "font-semibold">Level:</span></p>
                <p><span className = "font-semibold">Gender:</span></p>
                <p><span className = "font-semibold">Shiny:</span></p>
              </div>
              <div>
                <p><span className = "font-semibold">Tera Type:</span></p>
                <div className = 'flex gap-1 mt-1'>
                  <span className="px-2 py-0.5 bg-pink-400 text-white text-xs rounded">Type 1</span>
                  <span className="px-2 py-0.5 bg-blue-400 text-white text-xs rounded">Type 2</span>
                </div>
              </div>
            </div>
          </div>
          {/* Abilities and items and moves */}
          <div className="mt-3 grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Pokemon: </span>{focusedPokemon.species}</p>
              <p><span className="font-semibold">Item: </span>{focusedPokemon.item}</p>
              <p><span className="font-semibold">Ability: </span>{focusedPokemon.ability}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Moves</p>
              <ul className="list-none ml-4 space-y-1">
                {focusedPokemon.moves.map((move, moveIdx) => (
                  <li className = "list-none" key={moveIdx}>{move}</li>
                ))}
              </ul>
            </div>
          </div>
          {/*Stats*/}
          <div className="mt-3">
            <p className="font-semibold mb-1 text-sm">Stats</p>
            <div className="space-y-1 text-sm">
            {Object.entries(focusedPokemon.evs ?? {}).map(([stat, ev]) => (
              <div key={stat} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>{stat.toUpperCase()}</span>
                  <span>{ev}</span>
                </div>

                {/* Progress bar */}
                <div className="bg-gray-200 w-48 h-2 rounded overflow-hidden mb-2">
                  <div
                    className="bg-green-400 h-full transition-all duration-300"
                    style={{ width: `${(ev / 252) * 100}%` }}
                  />
                </div>

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
            ))}
            </div>
          </div>
          <button onClick = {() => {
            setFocusedPokemon(null);
            setFocusedPokemonIndex(null);
            setEvs(undefined);
          }}>Back to Team View</button>
        </>
      )}
      {team.length < 6 && canAdd && (
        <button>Add Pokemon</button>
      )}
    </div>
  );
}