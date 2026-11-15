import {type monStats, type SimulationResults} from './Pokemon';

function mergeSide(a: Record<string, monStats>, b: Record<string, monStats>) {
  const out: Record<string, monStats> = {...a};
  for (const [species, stats] of Object.entries(b)) { 
    const prev = out[species];
    if (!prev) {
      out[species] = stats;
      continue;
    }

    const appearances = prev.appearances + stats.appearances;

    const moves = {...prev.moves};
    for (const [move, count] of Object.entries(stats.moves)) {
      moves[move] = (moves[move] ?? 0) + count;
    }
    const top = Object.entries(moves).sort((x,y) => y[1] - x[1])[0];
    const lifespanTotal = prev.averageLifespan * prev.appearances + stats.averageLifespan * stats.appearances;

    out[species] = {
      appearances,
      faints: prev.faints + stats.faints,
      moves, averageLifespan: appearances ? Number((lifespanTotal / appearances).toFixed(2)): 0,
      mostUsedMove: top ? top[0]: null,
    };
  }
  return out;
}

export function mergeResults(a: SimulationResults | null, b: SimulationResults): SimulationResults {
  if(!a) return b;
  
  const total = a.totalBattles + b.totalBattles;
  const player1Wins = a.player1Wins + b.player1Wins;
  const player2Wins = a.player2Wins + b.player2Wins;
  const draws = a.draws + b.draws;
  const percent = (n: number) => ((n/total) * 100).toFixed(1) + "%";

  const durationTotal = Number(a.averageDurationMs) * a.totalBattles + Number(b.averageDurationMs) * b.totalBattles;

  return {
    message: `Ran ${total} simulations.`,
    totalBattles: total,
    player1Wins,
    player2Wins,
    draws,
    crashes: a.crashes + b.crashes,
    averageDurationMs: (durationTotal / total).toFixed(2),
    winRates: {player1: percent(player1Wins), player2: percent(player2Wins), draws: percent(draws)},
    monStats: {
      p1: mergeSide(a.monStats.p1, b.monStats.p1),
      p2: mergeSide(a.monStats.p2, b.monStats.p2),
    },
  };
}