import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export const Browse = () => {
    const { data: listPok, error: listError, isLoading: listIsLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['pokemon', 'list'],
        initialPageParam: 'https://pokeapi.co/api/v2/pokemon?limit=20',
        queryFn: ({ pageParam }) => {
            return fetch(pageParam)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error("Pokemon not found")
                    }
                })
        },
        getNextPageParam: (lastPage) => lastPage.next,
        select: (data) => {
            return data.pages.flatMap(p => p.results)
        }
    });

    return <section>
        <h1>Browse</h1>
        {(listIsLoading) && <p>Loading..</p>}
        {listError && <p className="error-text">{listError.message}</p>}

        {listPok && <>
            <ul className="pokemon-list">
                {listPok.map(p => <li key={p.url}><Link to="/pokemon/$name" params={{ name: p.name }}>{p.name}</Link></li>)}
            </ul>

            <button type='button' className="load-more-btn" onClick={() => fetchNextPage()} disabled={!hasNextPage}>
                {hasNextPage ? 'Load more' : 'No more Pokemon'}
            </button>
        </>
        }
    </section>
}