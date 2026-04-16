import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  Gw2ProfessionResponse,
  Gw2Skill,
  Gw2Specialization,
  Gw2SpecializationTrait,
} from '../gw2/gw2.specialization.model';

@Injectable({
  providedIn: 'root',
})
export class Gw2Api {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.guildwars2.com/v2';
  private cache = new Map<string, Observable<any>>();

  private cached<T>(key: string, request: Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, request.pipe(shareReplay(1)));
    }
    return this.cache.get(key) as Observable<T>;
  }

  getSpecializationsByProfession(profession: string): Observable<Gw2Specialization[]> {
    return this.cached<Gw2Specialization[]>(
      'specializations:all',
      this.http.get<Gw2Specialization[]>(`${this.baseUrl}/specializations?ids=all`)
    ).pipe(
      map(specs => specs.filter(s => s.profession.toLowerCase() === profession.toLowerCase()))
    );
  }

  getProfession(profession: string): Observable<Gw2ProfessionResponse> {
    return this.cached<Gw2ProfessionResponse>(
      `profession:${profession}`,
      this.http.get<Gw2ProfessionResponse>(`${this.baseUrl}/professions/${profession}`)
    );
  }

  getSkills(ids: string): Observable<Gw2Skill[]> {
    return this.cached<Gw2Skill[]>(
      `skills:${ids}`,
      this.http.get<Gw2Skill[]>(`${this.baseUrl}/skills?ids=${ids}`)
    );
  }

  getTraits(ids: string): Observable<Gw2SpecializationTrait[]> {
    return this.cached<Gw2SpecializationTrait[]>(
      `traits:${ids}`,
      this.http.get<Gw2SpecializationTrait[]>(`${this.baseUrl}/traits?ids=${ids}`)
    );
  }
}
