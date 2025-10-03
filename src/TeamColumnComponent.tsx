// Put this component in the same file below App or in a new TeamColumn.tsx and import it.
import { useState } from 'react';

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

  function toggleExpanded(idx: number) {
    setExpandedIdx(prev => (prev === idx ? null : idx));
  }

  // Render fixed 6 slots (0..5). If team has fewer than 6, show "Empty slot" UI.
  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, slotIdx) => {
          const pokemon = team[slotIdx];
          const isExpanded = expandedIdx === slotIdx;

          return (
            <div key={slotIdx} className="space-y-1">
              <div
                className={`p-2 border rounded flex items-center justify-between ${pokemon ? 'cursor-pointer' : ''}`}
                {...(pokemon
                  ? {
                      role: 'button',
                      tabIndex: 0,
                      onClick: () => toggleExpanded(slotIdx),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleExpanded(slotIdx);
                        }
                      },
                    }
                  : {})}
              >
                {pokemon ? (
                  <div className="flex items-center gap-3">
                    <a href={getPokedexUrl(pokemon.species)} target="_blank" rel="noopener noreferrer">
                      <img
                        className="h-10 w-10 rounded"
                        src={getSpriteUrl(pokemon.species)}
                        alt={pokemon.species}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = 'https://via.placeholder.com/96?text=?';
                        }}
                      />
                    </a>
                    <div className="flex flex-col">
                      <div className="font-medium">{pokemon.name || pokemon.species}</div>
                      <div className="text-sm text-gray-400">{pokemon.item || ''}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Empty slot</div>
                )}

                <div className="flex gap-2">
                  {pokemon ? (
                    <>
                      <button
                        className="px-2 py-1 bg-yellow-400 rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // quick inline edit example (replace with modal/form)
                          const newName = prompt('Edit nickname:', pokemon.name ?? pokemon.species);
                          if (newName !== null) {
                            onUpdate(slotIdx, { name: newName });
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Remove this Pokémon?')) onRemove(slotIdx);
                        }}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                      onClick={() => {
                        if (!canAdd) {
                          alert('Team is full (6). Remove a Pokémon first.');
                          return;
                        }
                        // very small example: ask species only
                        const species = prompt('Species to add (e.g. Pikachu):');
                        if (species) {
                          const success = onAdd({ species, name: '', moves: [], evs: {}, ivs: {} });
                          if (!success) alert('Could not add Pokémon (team may be full).');
                        }
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && pokemon && (
                <div className="p-2 border-l border-r border-b rounded-b bg-black/5 text-sm">
                  <div className="font-semibold">{pokemon.species}</div>
                  {pokemon.ability && <div>Ability: {pokemon.ability}</div>}
                  {pokemon.nature && <div>Nature: {pokemon.nature}</div>}
                  {pokemon.evs && (
                    <div>EVs: {Object.entries(pokemon.evs).map(([s, v]) => `${s.toUpperCase()}: ${v}`).join(', ')}</div>
                  )}
                  {pokemon.ivs && (
                    <div>IVs: {Object.entries(pokemon.ivs).map(([s, v]) => `${s.toUpperCase()}: ${v}`).join(', ')}</div>
                  )}
                  {pokemon.moves && pokemon.moves.length > 0 && (
                    <div>Moves: {pokemon.moves.join(', ')}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}