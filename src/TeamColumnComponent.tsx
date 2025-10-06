// Put this component in the same file below App or in a new TeamColumn.tsx and import it.
import { useState, useRef, useEffect } from 'react';

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

  // Small reusable inline editable component.
  function InlineEditable({
    value,
    onCommit,
    className,
    multiline,
  }: {
    value: string | undefined | null;
    onCommit: (v: string) => void;
    className?: string;
    multiline?: boolean;
  }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState((value ?? '').toString());
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    useEffect(() => {
      setDraft((value ?? '').toString());
    }, [value]);

    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
        // move cursor to end
        const el = inputRef.current as HTMLInputElement | HTMLTextAreaElement;
        const len = el.value.length;
        el.setSelectionRange && el.setSelectionRange(len, len);
      }
    }, [editing]);

    function start(e?: React.MouseEvent) {
      e?.stopPropagation();
      setEditing(true);
    }

    function save() {
      const newVal = draft.trim();
      setEditing(false);
      if ((value ?? '') !== newVal) onCommit(newVal);
    }

    function cancel() {
      setDraft((value ?? '').toString());
      setEditing(false);
    }

    if (editing) {
      if (multiline) {
        return (
          <textarea
              ref={el => { inputRef.current = el; }}
            className={`rounded border px-1 py-0.5 text-sm ${className ?? ''}`}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => save()}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                cancel();
              }
            }}
          />
        );
      }

      return (
        <input
          ref={el => { inputRef.current = el; }}
          className={`rounded border px-1 py-0.5 text-sm ${className ?? ''}`}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => save()}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              save();
            } else if (e.key === 'Escape') {
              e.stopPropagation();
              cancel();
            }
          }}
        />
      );
    }

    return (
      <span
        onClick={start}
        onDoubleClick={start}
        className={`cursor-text ${className ?? ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            start();
          }
        }}
      >
        {(value ?? '') || <span className="text-black-400">(Nickname)</span>}
        <span className="ml-1 text-black-400">✎</span>
      </span>
    );
  }

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
                className={`p-2 border rounded flex items-center bg-white justify-between ${pokemon ? 'cursor-pointer' : ''}`}
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
                      <div className="font-medium">
                        <InlineEditable
                          value={pokemon.name ?? pokemon.species}
                          onCommit={(v) => onUpdate(slotIdx, { name: v || null })}
                          className="font-medium"
                        />
                      </div>
                      <div className="text-sm text-black-400">
                        <InlineEditable
                          value={pokemon.item ?? ''}
                          onCommit={(v) => onUpdate(slotIdx, { item: v || null })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-black-400">Empty slot</div>
                )}

                <div className="flex gap-2">
                  {pokemon ? (
                    <>
                      <button
                        className="px-2 py-1 text-black rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Remove this Pokémon?')) onRemove(slotIdx);
                        }}
                      >
                        x
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
                <div className="p-2 border-l border-r border-b bg-white rounded-b bg-black/5 text-sm">
                  <div className="font-semibold">
                    <InlineEditable
                      value={pokemon.species}
                      onCommit={(v) => onUpdate(slotIdx, { species: v || pokemon.species })}
                      className="font-semibold"
                    />
                  </div>
                  <div>
                    Ability: <InlineEditable value={pokemon.ability ?? ''} onCommit={(v) => onUpdate(slotIdx, { ability: v || null })} />
                  </div>
                  <div>
                    Nature: <InlineEditable value={pokemon.nature ?? ''} onCommit={(v) => onUpdate(slotIdx, { nature: v || undefined })} />
                  </div>
                  {pokemon.evs && (
                    <div>EVs: {Object.entries(pokemon.evs).map(([s, v]) => `${s.toUpperCase()}: ${v}`).join(', ')}</div>
                  )}
                  {pokemon.ivs && (
                    <div>IVs: {Object.entries(pokemon.ivs).map(([s, v]) => `${s.toUpperCase()}: ${v}`).join(', ')}</div>
                  )}
                  {pokemon.moves && pokemon.moves.length > 0 && (
                    <div className="flex flex-col gap-1 items-center">
                      <div className="font-medium">Moves:</div>
                      {pokemon.moves.map((m, mi) => (
                        <div key={mi} className="flex p-2 items-center rounded-xl gap-2 outline-2 outline-black">
                          <InlineEditable
                            value={m}
                            onCommit={(v) => {
                              const newMoves = [...pokemon.moves];
                              newMoves[mi] = v;
                              onUpdate(slotIdx, { moves: newMoves });
                            }}
                          />
                          <button
                            className="px-2 py-0.5 text-xs text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newMoves = pokemon.moves.filter((_, i) => i !== mi);
                              onUpdate(slotIdx, { moves: newMoves });
                            }}
                          >
                            remove
                          </button>
                        </div>
                      ))}
                      <button
                        className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newMove = prompt('New move name:');
                          if (newMove) onUpdate(slotIdx, { moves: [...pokemon.moves, newMove] });
                        }}
                      >
                        Add move
                      </button>
                    </div>
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