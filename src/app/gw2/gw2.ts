import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { forkJoin, of } from "rxjs";
import { catchError, switchMap, map } from "rxjs/operators";
import { Gw2Api } from "../services/gw2api";
import {
  Gw2Fact,
  Gw2ProfessionResponse,
  Gw2Skill,
  Gw2Specialization,
  Gw2SpecializationTrait,
} from "./gw2.specialization.model";
import { professions } from "./gw2.professions.model";

@Component({
  selector: 'app-gw2',
  templateUrl: './gw2.html',
  styleUrls: ['./gw2.sass']
})
export class Gw2 {
  private gw2Api = inject(Gw2Api);
  private destroyRef = inject(DestroyRef);
  protected specialisations = signal<Gw2Specialization[]>([]);
  protected allProfessionSkills = signal<Gw2Skill[]>([]);
  protected selectedSpec = signal<Gw2Specialization | null>(null);
  protected selectedSpecSkills = signal<Gw2Skill[]>([]);
  protected isLoading = signal(false);
  protected error = signal<string | null>(null);
  protected minorOpen = signal(true);
  protected majorOpen = signal(true);
  protected skillsOpen = signal(true);
  protected readonly professions = professions;
  protected hoveredItem = signal<{ name: string; facts: Gw2Fact[] } | null>(null);
  protected tooltipPos = signal({ x: 0, y: 0 });

  onItemHover(event: MouseEvent, name: string, facts: Gw2Fact[] | undefined) {
    if (!facts?.length) return;
    this.hoveredItem.set({ name, facts });
    this.updateTooltipPos(event);
  }

  onItemMove(event: MouseEvent) {
    if (this.hoveredItem()) this.updateTooltipPos(event);
  }

  onItemLeave() {
    this.hoveredItem.set(null);
  }

  getFactValue(fact: Gw2Fact): string {
    switch (fact.type) {
      case 'Recharge': return `${fact.value}s`;
      case 'Range': return `${fact.value}`;
      case 'Number': return fact.value !== undefined ? `${fact.value}` : '';
      case 'Time': return `${fact.duration}s`;
      case 'Distance': return `${fact.distance}`;
      case 'Damage': return fact.dmg_multiplier !== undefined ? `×${fact.dmg_multiplier.toFixed(2)}` : '';
      case 'Buff': return fact.status ?? '';
      case 'ComboField': return fact.field_type ?? '';
      case 'ComboFinisher': return fact.percent !== undefined ? `${fact.percent}%` : (fact.finisher_type ?? '');
      case 'Percent': return `${fact.percent}%`;
      case 'AttributeAdjust': return fact.value !== undefined ? `+${fact.value}` : '';
      default: return '';
    }
  }

  private updateTooltipPos(event: MouseEvent) {
    const OFFSET = 16;
    const TOOLTIP_W = 280;
    const TOOLTIP_H = 220;
    const x = event.clientX + OFFSET + TOOLTIP_W > window.innerWidth
      ? event.clientX - TOOLTIP_W - OFFSET
      : event.clientX + OFFSET;
    const y = event.clientY + OFFSET + TOOLTIP_H > window.innerHeight
      ? event.clientY - TOOLTIP_H - OFFSET
      : event.clientY + OFFSET;
    this.tooltipPos.set({ x, y });
  }

  selectSpec(spec: Gw2Specialization) {
    this.selectedSpec.set(spec);
    this.selectedSpecSkills.set(this.allProfessionSkills().filter(s => s.specialization === spec.id));
    this.minorOpen.set(true);
    this.majorOpen.set(true);
    this.skillsOpen.set(true);
  }

  closeSpec() {
    this.selectedSpec.set(null);
  }

  onProfessionChange(profession: string) {
    if (!profession) {
      this.specialisations.set([]);
      this.allProfessionSkills.set([]);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const profession$ = this.gw2Api.getProfession(profession);

    const specs$ = this.gw2Api.getSpecializationsByProfession(profession).pipe(
      switchMap(specs => forkJoin(
        specs.map(spec => {
          const allIds = [...spec.major_traits, ...spec.minor_traits].join(',');
          return this.gw2Api.getTraits(allIds).pipe(
            map((traits: Gw2SpecializationTrait[]) => ({
              ...spec,
              major_traits: traits.filter(t => t.slot === 'Major'),
              minor_traits: traits.filter(t => t.slot === 'Minor'),
            } as Gw2Specialization))
          );
        })
      ))
    );

    const skills$ = profession$.pipe(
      switchMap((prof: Gw2ProfessionResponse) => {
        const ids = prof.skills.map(s => s.id).join(',');
        return this.gw2Api.getSkills(ids);
      })
    );

    forkJoin({ specializations: specs$, skills: skills$ }).pipe(
      catchError(() => {
        this.error.set('Failed to load specializations. Please try again.');
        this.isLoading.set(false);
        return of({ specializations: [], skills: [] });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ specializations, skills }) => {
      this.specialisations.set(specializations);
      this.allProfessionSkills.set(skills);
      this.isLoading.set(false);
    });
  }
}
