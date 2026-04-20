import { Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MhwApi } from "../services/mhwapi";
import { Armor, Monster, Weapon } from "./mhw.interfaces";

export type Category = 'weapons' | 'monsters' | 'armor';

@Component({
  selector: 'app-mhw',
  imports: [],
  templateUrl: './mhw.html',
  styleUrls: ['./mhw.sass']
})
export class Mhw {
  private mhwApi = inject(MhwApi);
  private destroyRef = inject(DestroyRef);

  protected category = signal<Category>('monsters');
  protected searchQuery = signal('');
  protected weapons = signal<Weapon[]>([]);
  protected monsters = signal<Monster[]>([]);
  protected armors = signal<Armor[]>([]);
  protected isLoading = signal(true);
  protected error = signal<string | null>(null);
  protected selectedWeapon = signal<Weapon | null>(null);
  protected selectedMonster = signal<Monster | null>(null);
  protected selectedArmor = signal<Armor | null>(null);

  protected filteredWeapons = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.weapons().filter(w => w.name.toLowerCase().includes(q)) : this.weapons();
  });

  protected filteredMonsters = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.monsters().filter(m => m.name.toLowerCase().includes(q)) : this.monsters();
  });

  protected filteredArmors = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q ? this.armors().filter(a => a.name.toLowerCase().includes(q)) : this.armors();
  });

  constructor() {
    forkJoin({
      weapons: this.mhwApi.getWeapons(),
      monsters: this.mhwApi.getMonsters(),
      armors: this.mhwApi.getArmors()
    }).pipe(
      catchError(() => {
        this.error.set('Failed to load data. Please try again.');
        this.isLoading.set(false);
        return of({ weapons: [], monsters: [], armors: [] });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ weapons, monsters, armors }) => {
      this.weapons.set(weapons as Weapon[]);
      this.monsters.set(monsters as Monster[]);
      this.armors.set(armors as Armor[]);
      this.isLoading.set(false);
    });
  }

  setCategory(cat: Category) {
    this.category.set(cat);
    this.searchQuery.set('');
  }

  selectWeapon(w: Weapon) { this.selectedWeapon.set(w); }
  selectMonster(m: Monster) { this.selectedMonster.set(m); }
  selectArmor(a: Armor) { this.selectedArmor.set(a); }

  closeModal() {
    this.selectedWeapon.set(null);
    this.selectedMonster.set(null);
    this.selectedArmor.set(null);
  }

  rarityStars(rarity: number): string {
    return '★'.repeat(Math.min(rarity, 12));
  }

  capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  }

  elementColor(element: string): string {
    const map: Record<string, string> = {
      fire: '#e8552a',
      water: '#4ab8e8',
      ice: '#a8d8f0',
      thunder: '#f5cc30',
      dragon: '#b87ce8',
      poison: '#b060d0',
      sleep: '#70c8b8',
      paralysis: '#e8e048',
      blast: '#e87040',
      stun: '#f0d840',
    };
    return map[element?.toLowerCase()] ?? '#aaaaaa';
  }

  resistanceColor(value: number): string {
    if (value > 0) return '#6ecf6e';
    if (value < 0) return '#e8552a';
    return '#888888';
  }
}
