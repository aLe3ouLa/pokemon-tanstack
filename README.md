# Pokemon Explorer

A small Pokemon app built while learning [TanStack Query](https://tanstack.com/query) and [TanStack Router](https://tanstack.com/router).

## Features

- **Search** — look up any Pokemon by name, with cached results, `staleTime`, and `keepPreviousData` so switching between searches doesn't flash to a loading state.
- **Browse** — paginated roster of the full Pokedex via `useInfiniteQuery`, with a "Load more" button.
- **My Team** — add/remove Pokemon from a team stored in `localStorage`, with optimistic updates (instant UI, rollback on failure) via `useMutation`.
- **Pokemon details** — a dynamic route (`/pokemon/$name`) showing type, height, weight, abilities, and base stats.

Routing is handled by TanStack Router (root + child routes, typed params, `<Link>` navigation); data fetching, caching, and mutations by TanStack Query.

## Running locally

```bash
npm install
npm run dev
```

## Stack

React + TypeScript + Vite, `@tanstack/react-query`, `@tanstack/react-router`, [PokeAPI](https://pokeapi.co/) as the data source.
