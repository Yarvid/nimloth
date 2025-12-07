// src/app/models/person.interface.ts

export type Gender = 'M' | 'F' | 'N' | 'U';

export interface IUserAccount {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password?: string; // Only used when creating/updating
}

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
  user_account?: IUserAccount | null;
}
