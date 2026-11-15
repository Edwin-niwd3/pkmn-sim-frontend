
import { type monStats } from "../utils/Pokemon";
import { MonStatCard } from "./MonStatCard";
import { type SimulationResults } from "../utils/Pokemon";

type resultsProps = { 
  results: SimulationResults;
  onReturn: () => void;
}

export function ResultsPage({results, onReturn}: resultsProps) {
  const p1Mons: [string, monStats][] = Object.entries(results.monStats?.p1 ?? {});
  const p2Mons: [string, monStats][] = Object.entries(results.monStats?.p2 ?? {});
  const rowCount = Math.max(p1Mons.length, p2Mons.length);
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  return(
        <>
          <div className = "flex justify-center">
          <div className = "max-w-3xl bg-slate-100 border border-grey-300 rounded-xl shadow-md overflow-hidden p-4">
            <p>{results.message}</p>
            <p>Average Duration Per Battle: {results.averageDurationMs}ms</p>
            
            <p>Stats</p>
            <p>Draws: {results.draws}</p>
            <p>Crashes: {results.crashes}</p>
          
            
            <div className = "grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <h1>
                  Team 1
                </h1>
                <p>Team 1 win rate: {results.winRates.player1}</p>
                <p>Number of games won: {results.player1Wins}</p>
              </div>
              <div>
                <h1>
                  Team 2
                </h1>
                <p>Team 2 win rate: {results.winRates.player2}</p>
                <p>Number of games won: {results.player2Wins}</p>
              </div>
              {rows.map((i) => {
                const p1 = p1Mons[i];
                const p2 = p2Mons[i];
                return [
                  p1 ? <MonStatCard key={`p1-${p1[0]}`} species={p1[0]} stats={p1[1]} /> : <div key={`p1-empty-${i}`} />,
                  p2 ? <MonStatCard key={`p2-${p2[0]}`} species={p2[0]} stats={p2[1]} /> : <div key={`p2-empty-${i}`} />,
                ];
              })}
            </div>
            <button
            onClick = {() => {
              onReturn();
            }}
            >
              Return
            </button>
            </div>
            </div>
        </>
        )}
