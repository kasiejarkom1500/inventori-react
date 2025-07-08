import { ColumnDef } from "@tanstack/react-table";
import {
  DashboardHampirHabis,
  DashboardPembelian,
  DashboardPermintaan,
} from "@/lib/types/dashboard";
import { Badge } from "@/components/ui/badge";

export const dashboardPerimntaanColumn: ColumnDef<DashboardPermintaan>[] = [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "ruangan",
    header: "ruangan",
  },
  {
    accessorKey: "jumlah_jenis_barang",
    header: "Jumlah Jenis Barang",
  },
  {
    accessorKey: "progres",
    header: "Progres Persetujuan",
    cell: (row) => {
      return (
        <ul className="flex flex-col gap-1 lg:gap-2 font-thin lg:font-normal items-start justify-start text-xs lg:text-sm">
          <div className="px-4 py-0.5 text-white bg-emerald-500 rounded-full text-xs w-24">
            {row.row.original.Approved} disetujui
          </div>
          <div className="px-4 py-0.5 text-white bg-red-500 rounded-full text-xs w-24">
            {row.row.original.Rejected} ditolak
          </div>
          <div className="px-4 py-0.5 text-white bg-amber-500 rounded-full text-xs w-24">
            {row.row.original.Pending} pending
          </div>
        </ul>
      );
    },
  },
  // {
  //   accessorKey: "approved",
  //   header: "Approved",
  //   cell: (row) => {
  //     const status = row.row.original.Approved;
  //     return <Badge variant={"Approved"}>{status}</Badge>;
  //   },
  // },
  // {
  //   accessorKey: "pending",
  //   header: "Pending",
  //   cell: (row) => {
  //     const status = row.row.original.Pending;
  //     return <Badge variant={"Pending"}>{status}</Badge>;
  //   },
  // },
  // {
  //   accessorKey: "rejected",
  //   header: "Rejected",
  //   cell: (row) => {
  //     const status = row.row.original.Rejected;
  //     return <Badge variant={"Rejected"}>{status}</Badge>;
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const status =
        row.row.original.Pending === "0" ? "Completed" : "On Process";
      return (
        <Badge
          variant={status === "Completed" ? "Approved" : "Pending"}
          className="w-24"
        >
          <span className="text-white text-xs font-normal">{status}</span>
        </Badge>
      );
    },
  },
];

export const dashboardPembelianColumn: ColumnDef<DashboardPembelian>[] = [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "tgl_masuk",
    header: "Tanggal Masuk",
  },
  {
    accessorKey: "jumlah_jenis",
    header: "Jumlah Jenis",
  },
  {
    accessorKey: "total_barang",
    header: "Total Barang",
  },
  {
    accessorKey: "total_harga",
    header: "Total Harga",
    cell: (row) => {
      // const harga = row.row.original.total_harga;
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      });
      return (
        <span className="text-right">
          {formatter.format(Number(row.row.original.total_harga))}
        </span>
      );
    },
  },
];
export const dashboardHampirHabisColumn: ColumnDef<DashboardHampirHabis>[] = [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "barang",
    header: "Barang",
  },
  {
    accessorKey: "sisa_stok",
    header: "Sisa Stok",
  },
  {
    accessorKey: "stok_minimum",
    header: "Stok Minimum",
  },
];
