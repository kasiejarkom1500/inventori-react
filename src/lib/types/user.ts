export interface Ruangan {
  id_ruangan: string;
  id_user: string;
  id_satker: string;
  ruangan: string;
}

// import { Ruangan } from "./ruangan";

export type User = {
  id_user: string;
  nama: string;
  ruangan: Ruangan[];
  jabatan: string;
  email: string;
  username: string;
  password: string;
};
