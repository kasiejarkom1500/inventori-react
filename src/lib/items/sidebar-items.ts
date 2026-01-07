import { Package, ScrollText, FileText, LayoutDashboard } from "lucide-react";

export const superAdmin = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [{ title: "Dashboard admin", url: "dashboard" }],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [
      // {title: 'Data Admin', url: 'data-admin'},
      { title: "Data Operator Ruangan", url: "data-pegawai" },
      // {title: 'Data Admin Pengajuan', url: 'data-admin-pengajuan'},
      { title: "Data Barang ATK", url: "data-barang-atk" },
      {title: 'Data Barang ARK', url: 'data-barang-ark'},
      { title: "Data Sumber", url: "data-sumber" },
      // {title: 'Data Ruangan', url: 'data-ruangan'},
    ],
  },
  {
    label: "Transaksi",
    icon: ScrollText,
    contents: [
      // {title: 'Barang Masuk', url: 'barang-masuk'},
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      { title: "Input Barang Masuk", url: "input-barang-masuk" },
      { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
      { title: "Input Permintaan Barang", url: "input-permintaan-barang" },
      { title: "Input Pengajuan Barang", url: "input-pengajuan-barang" },
    ],
  },
  {
    label: "Laporan",
    icon: FileText,
    contents: [
      { title: "Laporan Pengajuan", url: "laporan-pengajuan" },
      { title: "Kartu Kendali", url: "kartu-kendali" },
      { title: "Laporan Stok", url: "laporan-stok" },
    ],
  },
];
export const adminPengajuan = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard", url: "dashboard" },
      // { title: "Data Barang ATK", url: "data-barang-atk" },
      // // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // { title: "Input Barang Masuk", url: "input-barang-masuk" },
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      // { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [
      { title: "Data Barang ATK", url: "data-barang-atk" },
      { title: "Input Barang Masuk", url: "input-barang-masuk" },
    ],
  },
  {
    label: "Pengajuan & Permintaan",
    icon: ScrollText,
    contents: [
      // {title: 'Barang Masuk', url: 'barang-masuk'},
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: " Laporan",
    icon: FileText,
    contents: [
      { title: "Laporan Pengajuan", url: "laporan-pengajuan" },
      { title: "Kartu Kendali", url: "kartu-kendali" },
    ],
  },
];
export const user = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard Operator", url: "dashboard" },
      // { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      // { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [
      // {title: 'Data Admin', url: 'data-admin'},
      // { title: "Data Operator Ruangan", url: "data-pegawai" },
      // {title: 'Data Admin Pengajuan', url: 'data-admin-pengajuan'},
      { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // {title: 'Data Ruangan', url: 'data-ruangan'},
    ],
  },
  {
    label: "Transaksi",
    icon: ScrollText,
    contents: [
      // {title: 'Barang Masuk', url: 'barang-masuk'},
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      // { title: "Input Barang Masuk", url: "input-barang-masuk" },
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
];
export const adminPembelian = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard Pembelian", url: "dashboard" },
      // { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      // { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Transaksi",
    icon: ScrollText,
    contents: [{ title: "Input Barang Masuk", url: "input-barang-masuk" }],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [{ title: "Data Barang ATK", url: "data-barang-atk" }],
  },
];
export const viewer = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [{ title: "Dashboard Kepala", url: "dashboard" }],
  },
];
export const adminPengadaan = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard Admin", url: "dashboard" },
      // { title: "Data Barang ATK", url: "data-barang-atk" },
      // // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // { title: "Input Barang Masuk", url: "input-barang-masuk" },
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      // { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [{ title: "Data Barang ATK", url: "data-barang-atk" }],
  },
  {
    label: "Pengajuan & Permintaan",
    icon: ScrollText,
    contents: [
      // {title: 'Barang Masuk', url: 'barang-masuk'},
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      { title: "Pengadaan Barang", url: "pengajuan-barang" },
    ],
  },
  {
    label: " Laporan",
    icon: FileText,
    contents: [{ title: "KAK", url: "laporan-pengajuan" }],
  },
];

export const adminGudang = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard Admin", url: "dashboard" },
      // { title: "Data Barang ATK", url: "data-barang-atk" },
      // // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // { title: "Input Barang Masuk", url: "input-barang-masuk" },
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      // { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [{ title: "Data Barang ATK", url: "data-barang-atk" }],
  },
  {
    label: "Pengajuan & Permintaan",
    icon: ScrollText,
    contents: [
      { title: "Pengajuan Barang", url: "input-pengajuan-barang" },
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      { title: "Permintaan Barang", url: "permintaan-barang" },
      { title: "Input Barang Masuk", url: "input-barang-masuk" },
    ],
  },
  {
    label: " Laporan",
    icon: FileText,
    contents: [
      { title: "Kartu Kendali", url: "kartu-kendali" },
      { title: "Laporan Stok", url: "laporan-stok" },
    ],
  },
];

export const ketuaTim = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard Operator", url: "dashboard" },
      // { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      // { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [
      // {title: 'Data Admin', url: 'data-admin'},
      // { title: "Data Operator Ruangan", url: "data-pegawai" },
      // {title: 'Data Admin Pengajuan', url: 'data-admin-pengajuan'},
      { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // {title: 'Data Ruangan', url: 'data-ruangan'},
    ],
  },
  {
    label: "Transaksi",
    icon: ScrollText,
    contents: [
      // {title: 'Barang Masuk', url: 'barang-masuk'},
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      // { title: "Input Barang Masuk", url: "input-barang-masuk" },
      // { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
];

export const adminKabupaten = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [{ title: "Dashboard admin", url: "dashboard" }],
  },
  {
    label: "Data Master",
    icon: Package,
    contents: [
      { title: "Data Operator Ruangan", url: "data-pegawai" },
      { title: "Data Barang ATK", url: "data-barang-atk" },
      {title: 'Data Barang ARK', url: 'data-barang-ark'},
    ],
  },
  {
    label: "Transaksi",
    icon: ScrollText,
    contents: [
      { title: "Input Barang Masuk", url: "input-barang-masuk" },
      { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
      { title: "Input Permintaan Barang", url: "input-permintaan-barang" },
      { title: "Input Pengajuan Barang", url: "input-pengajuan-barang" },
    ],
  },
  {
    label: "Laporan",
    icon: FileText,
    contents: [
      { title: "Laporan Pengajuan", url: "laporan-pengajuan" },
      { title: "Kartu Kendali", url: "kartu-kendali" },
      { title: "Laporan Stok", url: "laporan-stok" },
    ],
  },
];
