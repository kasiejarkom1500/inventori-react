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
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      // {title: 'Data Ruangan', url: 'data-ruangan'},
    ],
  },
  {
    label: "Permintaan & Pengajuan",
    icon: ScrollText,
    contents: [
      // {title: 'Barang Masuk', url: 'barang-masuk'},
      // {title: 'Barang Keluar', url: 'barang-keluar'},
      { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
  {
    label: "Laporan",
    icon: FileText,
    contents: [
      { title: "Laporan Pengajuan", url: "laporan-pengajuan" },
      { title: "Kartu Kendali", url: "kartu-kendali" },
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
    contents: [{ title: "Laporan Pengajuan", url: "laporan-pengajuan" }],
  },
];
export const user = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Dashboard", url: "dashboard" },
      { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      { title: "Pengajuan Barang", url: "pengajuan-barang" },
      { title: "Permintaan Barang", url: "permintaan-barang" },
    ],
  },
];
export const adminPembelian = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    contents: [
      { title: "Data Barang ATK", url: "data-barang-atk" },
      // {title: 'Data Barang ARK', url: 'data-barang-ark'},
      { title: "Input Barang Masuk", url: "input-barang-masuk" },
    ],
  },
];
