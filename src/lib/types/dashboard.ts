export type DashboardPermintaan = {
  tanggal: string;
  id_user: string;
  id_ruangan: string;
  ruangan: string;
  jumlah_jenis_barang: string;
  Approved: string;
  Pending: string;
  Rejected: string;
};

export interface DashboardHampirHabis {
  id: string;
  barang: string;
  sisa_stok: string;
  stok_minimum: string;
}

export interface DashboardPembelian {
  tgl_masuk: string;
  jumlah_jenis: string;
  total_barang: string;
  total_harga: string;
}
