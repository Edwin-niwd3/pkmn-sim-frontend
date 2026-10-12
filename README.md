# pkmn-sim-frontend

Web UI for the Pokemon win-rate calculator. You build two teams of up to six Pokemon, pick a format and a number of battles, and the app asks the backend to simulate those battles and reports each team's win rate.

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
4. Pressing **Begin Battle** sends both teams, the selected format, and the battle count to `POST /simulation/abtest` on the backend and displays the returned win rates.
5. If the backend rejects a team, the validator messages for that team are shown with a button to go back and fix it.

The backend URL is hardcoded in `src/App.tsx`. Change it there if the server runs elsewhere.

## Project layout

```
src/
  App.tsx                   Main screen: format picker, battle count, teams, results
  TeamColumnComponent.tsx   One team's list of Pokemon plus the add/edit form
  hooks/useLocalStorageState.ts
utils/
  Pokemon.ts                The Pokemon type sent to the backend
  Formats.ts                Format dropdown entries mapped to Showdown format ids
  PokemonInfo.ts            PokeAPI lookups for species validation and types
  Sprites.tsx               Species name slugs, sprite and Pokedex URLs
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

- The format list in `utils/Formats.ts` contains only singles formats. Doubles formats need to be added once the backend routes them to the doubles bot.
- Random battle formats are listed but do not make sense with custom teams.
- Validation errors from the backend are arrays but are rendered as a single string.
- The page title in `index.html` is still the template default.

## Roadmap

1. Add VGC doubles formats to the dropdown.
2. Show richer results, such as per-Pokemon KO and faint counts and average turn count.
3. Import teams from Showdown's text export format.
