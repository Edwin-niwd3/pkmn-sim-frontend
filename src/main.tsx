import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <footer className = "text-center text-xs text-slate-300 px-4 py-6">
      <p>
        This is an unofficial fan project, not affiliated with or endorsed by Nintendo, Game Freak or The Pokémon Company.
        Pokémon and all related names are trademarks of their respective owners.
      </p>
      <p>
        Battle simulation built with{' '}
        <a className = "underline" href = "https://github.com/pkmn/ps" target = "_blank" rel = "noreferrer">@pkmn/sim</a>
        , based on{' '}
        <a className = "underline" href = "https://pokemonshowdown.com" target = "_blank" rel = "noreferrer">Pokémon Showdown</a>.
      </p>
    </footer>
  </StrictMode>,
)
