// Put this component in the same file below App or in a new TeamColumn.tsx and import it.
import { useState, useEffect } from 'react';

function slugifySpecies(species: string) {
  if (!species) return '';
  const map: Record<string, string> = {
    "Nidoran♀": "nidoran-f",
    "Nidoran♂": "nidoran-m",
    "Farfetch'd": "farfetchd",
    "Mr. Mime": "mr-mime",
    "Mime Jr.": "mime-jr",
    "Type: Null": "type-null",
    "Flabébé": "flabebe",
    "Ho-Oh": "ho-oh",
  };
  if (map[species]) return map[species];
  return species
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`.]/g, '')
    .replace(/[:]/g, '-')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function getPokedexUrl(species: string) {
  const slug = slugifySpecies(species);
  return `https://pokemondb.net/pokedex/${slug}`;
}

function getSpriteUrl(species: string) {
  const slug = slugifySpecies(species);
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}

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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [focusedSlot, setFocusedSlot] = useState<number | 'new' | null>(null);

  // Focused editor used for Add or Edit flows - hides the rest of the list while open
  function FocusedEditor({
    initial,
    onSave,
    onCancel,
    onRemove,
  }: {
    initial: Pokemon;
    onSave: (p: Pokemon) => void;
    onCancel: () => void;
    onRemove?: () => void;
  }) {
    const [draft, setDraft] = useState<Pokemon>(initial);

    useEffect(() => setDraft(initial), [initial]);

    return (
      <span>Hi there</span>)
  }

  function toggleExpanded(idx: number) {
    setExpandedIdx(prev => (prev === idx ? null : idx));
  }

  // focus control handled inline via setFocusedSlot

  // Render fixed 6 slots (0..5). If team has fewer than 6, show "Empty slot" UI.
  return (
    <div className = "max-w-md bg-slate-100 border border-grey-300 rounded-xl shadow-md overflow-hidden p-4">
      {title}
      <ul className = "list-none block">
      {team.map((poke, idx) => (
        <li value = {idx} className = "list-none relative">
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
              <ul className="list-disc ml-4 space-y-1">
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
              <div key={stat} className="flex justify-between">
                <span>{stat.toUpperCase()}</span>
                <div className="bg-gray-200 w-48 h-2 rounded overflow-hidden">
                  <div
                  className="bg-green-400 h-full"
                  style={{ width: `${(ev / 252) * 100}%` }}
                  ></div>
                </div>
              <span>{ev}</span>
              </div>
            ))}
            </div>
          </div>

        </li>
      ))}
      </ul>
      {team.length < 6 && canAdd && (
        <button>Add Pokemon</button>
      )}
    </div>
  );
}