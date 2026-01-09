export type Barang = {
  id_barang: string;
  kd_barang: string;
  nama_barang: string;
  stok: number;
  stok_dasar: number;
  satuan: string;
  harga_satuan: number;
  harga_pengajuan: number;
};

export type BarangTrans = {
  id: string;
  tanggal: string;
  kd_barang: string;
  nama_barang: string;
  satuan: string;
  kategori: string;
  jumlah: number;
  ruangan: string;
  id_barang_masuk?: number;
  harga?: number;
  sisa_stok?: number;
  catatan?: string;
  id_barang?: string | number;
};
export type BarangPermintaan = {
  id_permintaan: number;
  tanggal: string;
  id_barang?: string | number;
  kd_barang: string;
  nama_barang: string;
  kategori: string;
  satuan: string;
  stok?: number;
  jumlah: number;
  jumlah_approved: number | string;
  id_ruangan: string;
  status: string;
  is_buat_pengajuan: boolean;
  kd_subkategori: string;
};

export type BarangKarken = {
  id_barang: number;
  nama_barang: string;
  total_masuk: number;
  total_keluar: number;
  stok: number;
};

export type BarangPembelian = {
  id_barang: string;
  tanggal: string;
  nama_barang: string;
  jumlah: number;
  id_barang_masuk?: number;
  harga?: number;
  sisa_stok?: number;
  catatan?: string;
  catatan_penyesuaian?: string;
  tgl_masuk?: string;
};

export type BarangPengajuan = {
  id_pengajuan: string;
  kd_barang: string;
  tanggal: string;
  harga_pengajuan: number;
  status: string;
  kategori: string;
  stok: string;
  stok_dasar: string;
  nama_barang: string;
  satuan: string;
  jumlah: string | number;
  harga_satuan: string;
  total_harga: string;
  temp: string;
  kd_subkategori: string;
};

export type SummaryPermintaan = {
  id_permintaan: string;
  id_user: number;
  id_ruangan: string;
  id_transaksi: string;
  approve_tim: string;
  approve_gudang: string;
  tanggal: string;
  ruangan: string;
  jumlah_permintaan: number;
  Approved: number;
  Pending: number;
  Rejected: number;
  Pengadaan: number;
  ApprovedGudang: number;
};
export type SummaryPengajuan = {
  id_user: number;
  id_ruangan: string;
  tanggal: string;
  ruangan: string;
  jumlah_pengajuan: number;
  Approved: number;
  Pending: number;
  Rejected: number;
};

export type InputKuitansi = {
  id_pembelian: number;
  no_kuitansi: string;
  tanggal: string;
  sumber: string;
  jumlah_barang: number;
};

export type PermintaanFormType = {
  id_barang: string;
  id_user: string;
  id_ruangan: string;
  jumlah: number;
};

export type BarangBASO = {
  id_barang: string;
  kd_barang: string;
  nama_barang: string;
  stok: number;
  stok_dasar: number;
  satuan: string;
  harga_satuan: number;
  harga_pengajuan: number;
  total_harga:number
};
