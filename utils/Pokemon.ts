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
  level?: number;
  teraType?: string;
};

export type monStats = {
  appearances: number;
  faints: number;
  moves: Record<string, number>;
  averageLifespan: number;
  mostUsedMove: string | null;
};

export type SimulationResults = {
  message: string;
  totalBattles: number;
  player1Wins: number;
  player2Wins: number;
  draws: number;
  crashes: number;
  averageDurationMs: string;
  winRates: {player1: string; player2: string; draws: string};
  monStats: { p1: Record<string, monStats>; p2:Record<string, monStats> };
};