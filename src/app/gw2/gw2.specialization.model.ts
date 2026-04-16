export interface Gw2ProfessionSkillRef {
  id: number;
}

export interface Gw2ProfessionResponse {
  id: string;
  name: string;
  skills: Gw2ProfessionSkillRef[];
}

export interface Gw2Specialization {
  background: string;
  elite: boolean;
  id: number;
  name: string;
  profession: string;
  minor_traits: Gw2SpecializationTrait[];
  major_traits: Gw2SpecializationTrait[];
  icon: string;
}

export interface Gw2Fact {
  type: string;
  icon?: string;
  text?: string;
  value?: number;
  duration?: number;
  distance?: number;
  percent?: number;
  dmg_multiplier?: number;
  hit_count?: number;
  field_type?: string;
  finisher_type?: string;
  status?: string;
  apply_count?: number;
  target?: string;
  description?: string;
}

export interface Gw2Skill {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  slot: string;
  specialization?: number;
  facts?: Gw2Fact[];
}

export interface Gw2SpecializationTrait {
  id: number;
  description: string;
  name: string;
  slot: string;
  traited_facts: Gw2Fact[];
  facts: Gw2Fact[];
  specialization: number;
  tier: number;
  icon: string;
}