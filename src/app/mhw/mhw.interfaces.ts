export interface Weapon {
  id: number;
  name: string;
  type: string;
  rarity: number;
  attack: {
    display: number;
    raw: number;
  };
  elemental?: {
    type: string;
    damage: number;
  };
  damageType: string;
  assets?: {
    icon: string;
    image: string;
  };
}

export interface Armor {
  id: number;
  name: string;
  rank: string;
  rarity: number;
  defense: {
    base: number;
    max: number;
    augmented: number;
  };
  resistances: {
    fire: number;
    water: number;
    ice: number;
    thunder: number;
    dragon: number;
  };
  slots: number[];
  assests: {
    imageMale: string;
    imageFemale: string;
  }
}

export interface Monster {
  id: number;
  name: string;
  species: string;
  description: string;
  weaknesses: Weakness[];
  type: string;
  resistances: Resistance[];
  elements: string[];
}

export interface Resistance {
  element: string;
  condition: string;
}

export interface Weakness {
  element: string;
  condition: string;
  stars: number;
}