# Game API Website

A multi-feature Angular browser app with two independent data browsing experiences.

## Features

### Pokédex
- Browse all Pokémon with pagination (10 per page)
- Click any card to open a detail modal showing sprite, types, base stats, and abilities
- Data sourced from the [PokéAPI GraphQL endpoint](https://graphql-pokeapi.vercel.app/)

### Guild Wars 2 Specializations
- Select a profession to load its specializations
- Click a specialization to view its minor traits, major traits, and associated skills
- Hover any trait or skill card to see a live tooltip with fact data (recharge, range, damage, buffs, combo fields, etc.)
- Data sourced from the [Guild Wars 2 official API](https://api.guildwars2.com/v2)

## Tech stack

- **Angular 21** — standalone components, signals, SSR
- **RxJS** — `switchMap`, `forkJoin`, `catchError`, `takeUntilDestroyed`
- **SASS** — scoped per-component styles
- **Vitest** — unit testing

## Getting started

```bash
npm install
npm start
```

Then open [http://localhost:4200](http://localhost:4200).

## Build

```bash
npm run build
```

Output goes to `dist/mhw-app/`.

