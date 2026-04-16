import { Type } from "./Type";

export interface Pokemon {
  name: string;
  url: string;
  id?: number;
  height?: number;
  weight?: number;
  types?: Type[];
  sprites?: {
    front_default: string;
  };
  abilities?: {
    ability: {
      name: string;
    };
  }[];
  stats?: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}