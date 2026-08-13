import { useParams } from "@tanstack/react-router";
import { usePokemon } from "./queries";
import { TypeColors } from "./typeColors";

export const PokemonDetail = () => {
    const { name } = useParams({ from: '/pokemon/$name' })
    const { data: pokemon, isLoading } = usePokemon(name);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <div className="pokemon-card">
        <p>{pokemon?.name}</p>
        <img height="50" width="50" alt={pokemon?.name} src={pokemon?.sprites?.front_default} />
        <div className="type-badge-row">
            {pokemon?.types?.map((t: any) => <span key={t.type.name} className="type-badge" style={{ backgroundColor: TypeColors[t.type.name as keyof typeof TypeColors] }}>{t.type.name}</span>)}
        </div>
        {pokemon && <>
            <p className="pokemon-meta">Height: {(pokemon.height / 10).toFixed(1)} m &middot; Weight: {(pokemon.weight / 10).toFixed(1)} kg</p>
            <p className="pokemon-meta">Abilities: {pokemon.abilities?.map((a: any) => a.ability.name).join(', ')}</p>
            <ul className="stat-list">
                {pokemon.stats?.map((s: any) => (
                    <li key={s.stat.name}>
                        <span className="stat-name">{s.stat.name}</span>
                        <span className="stat-value">{s.base_stat}</span>
                    </li>
                ))}
            </ul>
        </>}
    </div>
}