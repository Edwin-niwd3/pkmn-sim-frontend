import {slugifySpecies} from './Sprites';

const typeCache = new Map<string, string[]>();
const validCache = new Set<string>();

export async function getTypesForSpecies(species: string): Promise<string[]> {
  if (!validateSpecies(species)) return [];
  
  const slug = slugifySpecies(species);

  if (typeCache.has(slug)) return typeCache.get(slug)!;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`)
    if (!res.ok) throw new Error('Failed to fetch types');
    const json = await res.json();
    const types: string[] = json.types
    .sort((a: any, b:any) => a.slot - b.slot)
    .map((t:any) => String(t.type.name));
    typeCache.set(slug, types);
    return types;
  } catch (e) {
    console.warn(`Could not fetch types for ${species} (${slug})`, e);
    return [];
  }
}

export async function validateSpecies(species: string): Promise<boolean> {
  if (!species) return false;
  const slug = slugifySpecies(species);
  if (validCache.has(slug)) return true;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
  if( res.ok) {
    validCache.add(slug);
    return true;
  }
  return false;
}