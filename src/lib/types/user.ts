export type User = {
  id_user: string;
  id_satker?: string;
  nip_lama?: string;
  nama: string;
  ruangan?: string;
  jabatan?: string;
  role?: { id_role: number; nama_role: string }[];
  email?: string;
  username?: string;
  password?: string;
};
