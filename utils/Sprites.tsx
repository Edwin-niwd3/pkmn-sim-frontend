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

export function getPokedexUrl(species: string) {
  const slug = slugifySpecies(species);
  return `https://pokemondb.net/pokedex/${slug}`;
}

export function getSpriteUrl(species: string) {
  const slug = slugifySpecies(species);
  return `https://img.pokemondb.net/sprites/home/normal/${slug}.png`;
}