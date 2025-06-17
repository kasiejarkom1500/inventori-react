export type DashboardPermintaan = {
  id: string;
  tanggal: string;
  ruangan: string;
  jumlah_jenis_barang: string;
  status: string;
};

export interface DashboardHampirHabis {
  id: string;
  barang: string;
  sisa_stok: string;
  stok_minimum: string;
}
