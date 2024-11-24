// src/app/models/person.interface.ts

export type Gender = 'M' | 'F' | 'N' | 'U';

export interface IPerson {
  id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_name: string;
  artist_name: string;
  date_of_birth: string | null;
  place_of_birth: string;
  date_of_death: string | null;
  place_of_death: string;
  cause_of_death: string;
  mother: number | null;
  father: number | null;
  gender: Gender;
}
