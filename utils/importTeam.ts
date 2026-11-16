import { type Pokemon} from './Pokemon';
import { getTypesForSpecies } from './PokemonInfo';

const ZERO_EVS = { hp:0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
const MAX_IVS = { hp: 31, atk:31, def: 31, spa:31, spd: 31, spe: 31 };

export async function importTeam(text: string): Promise<Pokemon[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/simulation/import`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({text}),
  });
  const result = await res.json();
  if (!res.ok || result.error) throw new Error(result.error ?? 'Import failed.');
  return Promise.all(result.team.map(async (set: Pokemon) => ({
    ...set,
    evs: {...ZERO_EVS, ...set.evs },
    ivs: { ...MAX_IVS, ...set.ivs },
    types : await getTypesForSpecies(set.species),
  })));
}