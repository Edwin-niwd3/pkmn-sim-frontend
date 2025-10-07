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
    <div className = "flex flex-col gap-4 block">
      {title}
      <ul className = "list-none block">
      {team.map((poke, idx) => (
        <li value = {idx} className = "list-none relative">
        <div className = "absolute top-0 left-0 border rounded-md">
          <label className = "text-sm text-white/50">Nickname</label>
        </div>
        <div className = "border rounded-md p-2 h-auto grid grid-cols-4">

          <div className = "grid place-items-center gap-2 p-2 border border-black/20 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer row-span-2">
            <img src={getSpriteUrl(poke.species)} alt={poke.species} className = "w-16 h-16"/>
            <div className = "flex flex-col">
              <a href={getPokedexUrl(poke.species)} target="_blank" rel="noopener noreferrer" className = "font-bold hover:underline ">{poke.species}</a>
              <div className = "text-sm text-white/50">{poke.ability}</div>
            </div>
          </div>

          <div className = "grid gap-2 place-items-center p-2 border border-black/20 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer grid-rows-2">
            <div className = "gap-2">
              <label>Details</label>
              <button className = "block box-border border rounded-sm p-1 m-2">
                <span className = "p-2 block float-left text-sm text-center">
                  <label>Gender</label>
                  {poke.gender || '-'}
                </span>
              </button>
            </div>
            <div className = "grid gap-2 grid-cols-2">
              <div className = "">
                <label>Item</label>
                <div>
                  <input type="text" value={poke.item || ''} className = "bg-transparent border-b border-white/20 w-full"/>
                </div>
              </div>
              <div className = "">
                <label>Ability</label>
                <div>{poke.ability || ''}</div>
              </div>
            </div>
          </div>

          <div className = "grid grid-rows-4 gap-2 p-2 border border-black/20 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer">
            <label>Moves</label>
            {poke.moves.map((move, i) => (
              <div className = "text-sm" key={i}>
                {move}
              </div>
            ))}
          </div>

          <div className = "grid grid-rows-2 gap-2 p-2 border border-black/20 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer">
            <label>Stats</label>
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