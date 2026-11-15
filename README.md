# pkmn-sim-frontend

Web UI for the Pokemon win-rate calculator. You build two teams of up to six Pokemon, pick a format and a number of battles, and the app asks the backend to simulate those battles and reports each team's win rate, along with per-Pokemon stats.

**Live site:** https://pokesim.edwinapp.org

The backend is the Express server in `../PokemonSim/Node-Server`. It must be running for the app to do anything beyond team building.

## Stack

- React 19 with TypeScript
- Vite 7 with the SWC React plugin
- Tailwind CSS 4
- `ldrs` for the loading animation

## Requirements

- Node.js 22 or newer
- npm
- The backend running on `http://localhost:3000` (see `../PokemonSim/README.md`)
- A `.env.local` file in this folder that tells the app where the backend is:

  ```
  VITE_API_URL=http://localhost:3000
  ```

  Restart `npm run dev` after creating or changing it.

## Run

```bash
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Type-checks and builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## How it works

1. Each team column lets you add, edit, and remove Pokemon. A new Pokemon starts as a Pikachu template that you edit in place.
2. Teams are saved to browser `localStorage` under the keys `team1` and `team2`, so they survive a refresh.
3. Species names are validated and typed by fetching from PokeAPI. Sprites and Pokedex links come from external sources via `utils/Sprites.tsx`.
4. Pressing **Begin Battle** sends both teams and the selected format to `POST /simulation/abtest` on the backend in batches of 25 battles, one request after another, and adds the batch results together. The loading screen shows a progress bar and a **Cancel** button; cancelling keeps the results of the batches that already finished. The results page shows the win rates plus a card per Pokemon with its faint count, average lifespan in turns, and most-used move.
5. **Load Test Teams** fills both columns with built-in VGC teams and selects a matching format.
6. Each team is checked against the selected format by `POST /simulation/validate` whenever the team or the format changes. Any problems are listed in red at the top of that team's column, and **Begin Battle** is disabled until both teams are legal.

The backend URL comes from the `VITE_API_URL` environment variable, which Vite reads at build time.

## Deployment

The site is deployed to Cloudflare as a static-assets Worker, configured by `wrangler.jsonc` (it serves `dist/`). Cloudflare runs `npm run build` and `npx wrangler deploy` on every push to `main`. `VITE_API_URL` is set to the backend's address in the Cloudflare project's variables; changing it needs a redeploy to take effect.

## Project layout

```
src/
  main.tsx                  Entry point; renders App and the disclaimer footer
  App.tsx                   Main screen: format picker, battle count, teams, loading animation
  TeamColumnComponent.tsx   One team's list of Pokemon plus the add/edit form
  ResultsPage.tsx           Win rates and the per-Pokemon stat grid
  MonStatCard.tsx           One Pokemon's stats card
  hooks/useLocalStorageState.ts
utils/
  Pokemon.ts                The Pokemon type sent to the backend
  Formats.ts                Format dropdown entries mapped to Showdown format ids
  DefaultTeams.ts           Built-in test teams
  PokemonInfo.ts            PokeAPI lookups for species validation and types
  Sprites.tsx               Species name slugs, sprite and Pokedex URLs
  mergeResults.ts           Adds one batch of results to the running total
  TypeColors.ts             Type badge colours
```

## Team data format

A Pokemon is sent to the backend as:

```ts
type Pokemon = {
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
```

Species, item, ability, and move names use Showdown's display names, for example `Rotom-Wash`, `Choice Specs`, `Will-O-Wisp`.

## Known gaps

- The favicon is still the Vite template default.

## Roadmap

1. Import teams from Showdown's text export format.
