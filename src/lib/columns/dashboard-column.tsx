import { ColumnDef } from "@tanstack/react-table";
import {
  DashboardHampirHabis,
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
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const status = row.row.original.status;
      return (
        <Badge
          variant={
            status == "Disetujui"
              ? "Approved"
              : status == "Ditolak"
              ? "Rejected"
              : "Pending"
          }
        >
          {status}
        </Badge>
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
