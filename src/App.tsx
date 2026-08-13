import { useState } from 'react';
import './App.css'
import { useQuery, keepPreviousData} from '@tanstack/react-query';
import { useAddToTeam, useDeleteFromTeam, useTeam } from './queries';
import { Link } from '@tanstack/react-router';
import { TypeColors } from './typeColors';


function App() {  
  const [query, setQuery] = useState<string>("");
  const [apiQuery, setApiQuery] = useState<string>("");
  const { data, error, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['pokemon', apiQuery],
    queryFn: () => {
      return fetch(`https://pokeapi.co/api/v2/pokemon/${apiQuery}`)
        .then((res) => {
          if (res.ok) {
            setQuery("")
            return res.json();
          } else {
            throw new Error("Pokemon not found")
          }
        })
    },
    staleTime: 1000 * 60,
    enabled: !!apiQuery,
    placeholderData: keepPreviousData
  });

  const result = useTeam();
  const { mutate } = useAddToTeam();
  const { mutate: deleteMutate } = useDeleteFromTeam();

  const speciesQuery = useQuery({
    queryKey: ['species', data?.species?.url],
    queryFn: () => fetch(data.species.url).then(res => res.json()),
    enabled: !!data?.species?.url,
  });

  return (
    <>
      <section>
        <h1>Search</h1>
        <div className="search-bar">
          <input placeholder="Search a pokemon" value={query} onChange={e => setQuery(e.target.value)} />
          <button type="button" onClick={() => {
            const pokemon = query.trim().toLowerCase();
            setApiQuery(pokemon);
          }}>Search</button>
          {data && <button type="button" onClick={() => {
            mutate(data.name);
          }}>Add to team</button>}
        </div>

        {error && <p className="error-text">{error.message}</p>}
        {(isLoading) && <p>Loading..</p>}

        {data && <div className="pokemon-card">
          <p className="pokemon-name">{data.name}</p>
          <img height="50" width="50" alt={data.name} src={data.sprites.front_default} style={{ opacity: `${isPlaceholderData ? "50%" : "100%"}` }} />
          <div className="type-badge-row">
            {data.types?.map((t: any) => <span key={t.type.name} className="type-badge" style={{ backgroundColor: TypeColors[t.type.name as keyof typeof TypeColors] }}>{t.type.name}</span>)}
          </div>
          {speciesQuery?.data ? <p className="pokemon-flavor">{speciesQuery?.data?.flavor_text_entries?.find((entry: any) => entry.language.name === 'en')?.flavor_text}</p> : null}
          <p className="pokemon-meta">Height: {(data.height / 10).toFixed(1)} m &middot; Weight: {(data.weight / 10).toFixed(1)} kg</p>
          <p className="pokemon-meta">Abilities: {data.abilities?.map((a: any) => a.ability.name).join(', ')}</p>
          <ul className="stat-list">
            {data.stats?.map((s: any) => (
              <li key={s.stat.name}>
                <span className="stat-name">{s.stat.name}</span>
                <span className="stat-value">{s.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>}
      </section>

      <section>
        <h1>My Team</h1>
        {result.data && result.data.length > 0 ? (
          <ul className="team-list">
            {result.data.map((pokemon: string) => (
              <li key={pokemon} className="team-chip">
                <Link to="/pokemon/$name" params={{ name: pokemon }}>{pokemon}</Link>
                <button type="button" className="remove-btn" onClick={() => deleteMutate(pokemon)} aria-label={`Remove ${pokemon} from team`}>&times;</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No team members yet — search a Pokemon and add it to your team.</p>
        )}
      </section>
    </>
  )
}

export default App
