export type Pokemon = {
  name?: string | null;
  species: string;
  types?: string[];
  item?: string | null;
  gender?: string | null;
  ability?: string | null;
  nature?: string;
  evs?: Record<string, number>;
  ivs?: Record<string, number>;
  moves: string[];
};