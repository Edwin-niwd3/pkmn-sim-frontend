import { type monStats } from "../utils/Pokemon";
import { PokemonSprite } from '../utils/Sprites';

type CardProps = {
  species: string,
  stats: monStats,
}

export function MonStatCard({species, stats} : CardProps) {

  return (
    <div>
      <PokemonSprite species={species} className = "w-12 h-12 mx-auto"/>
      <div className = "font-bold">Pokemon: {species}</div>
      <div>Appearances: {stats.appearances}</div>
      <div>Faints: {stats.faints}</div>
      <div>Average Lifespan: {stats.averageLifespan}</div>
      <div>Most Used Move: {stats.mostUsedMove ? `${stats.mostUsedMove}: ${stats.moves[stats.mostUsedMove]}` : 'N/A'}</div>
      <div>
        <div className = "font-bold">Move Usage:</div>
        <ul className="list-disc list-inside">
          {Object.entries(stats.moves).map(([move, count]) => (
            <li key={move}>{move}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
