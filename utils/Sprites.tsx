import { useState } from "react";

export function slugifySpecies(species: string) {
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

const HYPHEN_BASES = ['ho-oh', 'porygon-z', 'jangmo-o', 'hakamo-o', 'kommo-o', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu'];

export function showdownId(species:string) {
  const s = species.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace('♀', 'f').replace('♂', 'm').toLowerCase();
  const clean = (x:string) => x.replace(/[^a-z0-9]/g, '');
  for( const base of HYPHEN_BASES) {
    if (s === base) return clean(s);
    if (s.startsWith(base +'-')) return clean(base) + '-' + clean(s.slice(base.length + 1));
  }

  const i = s.indexOf('-');
  return i === -1 ? clean(s) : clean(s.slice(0,i)) + '-' + clean(s.slice(i+1));
}

export function spriteCandidates(species: string, back = false) {
  const id = showdownId(species);
  const sd = 'https://play.pokemonshowdown.com/sprites';
  return [
    `${sd}/${back ? 'ani-back' : 'ani'}/${id}.gif`,
    `${sd}/${back ? 'gen5-back' : 'gen5'}/${id}.png`,
    getSpriteUrl(species),
  ]
}

export function PokemonSprite({species, back = false, className}: {species: string; back?: boolean; className?: string}) {
  const urls = spriteCandidates(species, back);
  const [i, setI] = useState(0);
  return <img src={urls[Math.min(i, urls.length-1)]} alt={species} className = {className} onError ={() => setI(n => n+1)} />;
}

export function getPokedexUrl(species: string) {
  const slug = slugifySpecies(species);
  return `https://pokemondb.net/pokedex/${slug}`;
}

export function getSpriteUrl(species: string) {
  const slug = slugifySpecies(species);
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}