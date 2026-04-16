import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../models/Pokemon';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'https://graphql-pokeapi.vercel.app/api/graphql';

  getPokemons(limit: number = 12, offset: number = 0): Observable<Pokemon[]> {
    const query = `
      query GetPokemons($limit: Int!, $offset: Int!) {
        pokemons(limit: $limit, offset: $offset) {
          results {
            name
            url
          }
        }
      }
    `;
    return this.http
      .post<{ data: { pokemons: { results: Pokemon[] } } }>(this.baseUrl, { query, variables: { limit, offset } })
      .pipe(map(response => response.data.pokemons.results));
  }

  getPokemonDetails(name: string): Observable<Pokemon> {
    const query = `
      query GetPokemonDetails($name: String!) {
        pokemon(name: $name) {
          id
          name
          height
          weight
          types {
            type {
              name
            }
          }
          sprites {
            front_default
          }
          abilities {
            ability {
              name
            }
          }
          stats {
            base_stat
            stat {
              name
            }
          }
        }
      }
    `;
    return this.http
      .post<{ data: { pokemon: Pokemon } }>(this.baseUrl, { query, variables: { name } })
      .pipe(map(response => response.data.pokemon));
  }
}
