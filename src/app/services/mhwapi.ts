import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class MhwApi {
  private http = inject(HttpClient);
  private baseUrl = 'https://mhw-db.com';
  private cache = new Map<string, Observable<any>>();

  getMonsters(): Observable<any> {
    const cacheKey = 'monsters';
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, this.http.get(`${this.baseUrl}/monsters`).pipe(shareReplay(1)));
    }
    return this.cache.get(cacheKey)!;
  }

  getArmors(): Observable<any> {
    const cacheKey = 'armors';
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, this.http.get(`${this.baseUrl}/armor`).pipe(shareReplay(1)));
    }
    return this.cache.get(cacheKey)!;
  }

  getWeapons(): Observable<any> {
    const cacheKey = 'weapons';
    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, this.http.get(`${this.baseUrl}/weapons`).pipe(shareReplay(1)));
    }
    return this.cache.get(cacheKey)!;
  }
}
