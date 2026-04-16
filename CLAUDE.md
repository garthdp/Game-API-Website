# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200 (auto-reloads)
npm run build      # production build → dist/game-api-website/
npm run watch      # dev build in watch mode
npm test           # unit tests via Vitest
npx ng build --configuration development   # dev build (faster, no optimisation)
```

There is no lint script configured. TypeScript strict mode is on (`strict`, `strictTemplates`, `noImplicitReturns`), so `npx ng build` acts as the type-check step.

## Git workflow

After completing any meaningful unit of work (a feature, a fix, a refactor), commit and push to GitHub immediately. Do not batch up multiple unrelated changes into one commit.

- Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Keep commit messages specific — describe *what changed and why*, not just "update files"
- Always `git push` after committing so work is never only local
- Remote: `https://github.com/garthdp/Game-API-Website.git`

## Architecture

### Routing
Two routes defined in `src/app/app.routes.ts`:
- `/` → `Home` (Pokédex browser)
- `/gw2` → `Gw2` (Guild Wars 2 specializations browser)

`App` (root component) is a bare `<router-outlet />` shell with no layout of its own.

### State model
Both feature components use **Angular signals** exclusively — no `BehaviorSubject`, no `NgRx`. Reactive data loading is driven by `toObservable()` on a signal piped through `switchMap` / `forkJoin`, with `takeUntilDestroyed()` for cleanup and `catchError` for error state.

### Services
Both services (`src/app/services/api.ts`, `src/app/services/gw2api.ts`) are `providedIn: 'root'` singletons injected with `inject()`.

`Gw2Api` has an in-memory `Map` cache using `shareReplay(1)` — every unique URL is fetched at most once per app session. `Api` (PokéAPI) has no cache; pagination drives fresh requests.

### Data flow — GW2 page
`onProfessionChange(profession)` fires three parallel request chains via `forkJoin`:
1. `getSpecializationsByProfession` → filters the full `specializations?ids=all` list
2. Per specialization: `getTraits(ids)` to hydrate `major_traits` / `minor_traits` with full objects
3. `getProfession` → `getSkills(ids)` to load the profession's skill list

Results land in signals; `selectedSpecSkills` is derived by filtering `allProfessionSkills` on `skill.specialization === spec.id`.

### Tooltip system (GW2)
`hoveredItem` and `tooltipPos` signals drive a `position: fixed` overlay rendered at the bottom of `gw2.html`. Mouse events on each `.trait-card` call `onItemHover / onItemMove / onItemLeave`. `getFactValue(fact)` converts a `Gw2Fact` to a display string based on `fact.type`.

### Models
- `src/app/models/` — `Pokemon`, `Type`
- `src/app/gw2/gw2.specialization.model.ts` — `Gw2Specialization`, `Gw2Skill`, `Gw2SpecializationTrait`, `Gw2Fact`, `Gw2ProfessionResponse`

### Styling
Each component has a scoped `.sass` file. GW2 uses SASS variables (`$gold`, `$bg`, `$surface`, etc.) defined at the top of `gw2.sass`. Home uses plain hex values. No global design tokens or shared stylesheet beyond `src/styles.sass` (which is near-empty).

### External APIs
- PokéAPI GraphQL: `https://graphql-pokeapi.vercel.app/api/graphql` — POST with `{ query, variables }`
- GW2 REST API v2: `https://api.guildwars2.com/v2` — GET with `?ids=` params
