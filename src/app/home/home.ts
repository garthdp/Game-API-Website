import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Api } from '../services/api';
import { Pokemon } from '../models/Pokemon';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.sass']
})
export class Home {
  private readonly api = inject(Api);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pokemons = signal<Pokemon[]>([]);
  protected readonly selectedPokemon = signal<Pokemon | null>(null);
  protected readonly page = signal(0);
  protected readonly currentPage = computed(() => this.page() + 1);

  constructor() {
    toObservable(this.page).pipe(
      tap(() => {
        this.isLoading.set(true);
        this.error.set(null);
        this.pokemons.set([]);
      }),
      switchMap(page =>
        this.api.getPokemons(10, page * 10).pipe(
          switchMap(pokemons =>
            forkJoin(pokemons.map((p: Pokemon) =>
              this.api.getPokemonDetails(p.name).pipe(
                map((d: Pokemon) => ({ ...p, ...d } as Pokemon))
              )
            ))
          ),
          catchError(() => {
            this.error.set('Failed to load Pokémon. Please try again.');
            return of([]);
          })
        )
      ),
      takeUntilDestroyed()
    ).subscribe(pokemons => {
      this.pokemons.set(pokemons);
      this.isLoading.set(false);
    });
  }

  changePage(increment: number) {
    const newPage = this.page() + increment;
    if (newPage < 0) return;
    this.page.set(newPage);
  }

  selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon);
  }

  closePokemon() {
    this.selectedPokemon.set(null);
  }
}
