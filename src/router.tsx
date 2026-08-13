import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import App from "./App";
import { Browse } from "./Browse";
import { PokemonDetail } from "./PokemonDetail";

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootRoute = createRootRoute({
    component: () => <>
    <nav className="site-nav">
        <ul>
           <li><Link to="/" activeProps={{ className: 'active' }}>Home</Link></li>
          <li><Link to="/browse" activeProps={{ className: 'active' }}>Browse</Link></li>
        </ul>
      </nav>
      <main className="page">
        <Outlet />
      </main>
    </>,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App, 
})

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: Browse, 
})

const pokemonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pokemon/$name',
  component: PokemonDetail,
})

const routeTree = rootRoute.addChildren([indexRoute, browseRoute, pokemonRoute])
export const router = createRouter({ routeTree })

