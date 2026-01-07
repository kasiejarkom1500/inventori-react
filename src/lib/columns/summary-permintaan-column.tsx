import { ColumnDef } from "@tanstack/react-table";
import { SummaryPermintaan } from "@/lib/types/barang";
import { ArrowUpDown, Eye, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DetailPermintaan from "@/container/admin/DetailPermintaan";
import BlankoForm from "@/components/BlankoForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const isSelectMenuPortal = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  return el?.closest(".select__menu-portal") || el?.closest(".select__menu");
};

const formatDate = (value?: string) => {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const summaryPermintaanColumns: ColumnDef<SummaryPermintaan>[] = [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "tanggal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting()}
        >
          Tanggal Permintaan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: "jumlah_permintaan",
    header: "Jenis Barang",
  },
  {
    accessorKey: "ruangan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting()}
        >
          Ruangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Pending",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting()}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (row) => {
      const status = {
        ApproveGudang: row.row.original.ApprovedGudang,
        Approved: row.row.original.Approved,
        Pending: row.row.original.Pending,
        Rejected: row.row.original.Rejected,
        Pengadaan: row.row.original.Pengadaan,
      };
      const colorMap: Record<string, string> = {
        ApproveGudang: "bg-purple-100 text-purple-800",
        Approved: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Rejected: "bg-red-100 text-red-800",
        Pengadaan: "bg-blue-100 text-blue-800",
      };
      const shortLabel: Record<string, string> = {
        ApproveGudang: "Gudang",
        Approved: "Approved",
        Pending: "Pending",
        Rejected: "Rejected",
        Pengadaan: "Pengadaan",
      };

      return (
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(status)
            .filter(([, value]) => value > 0)
            .map(([key, value]) => (
              <Badge
                key={key}
                className={`${colorMap[key] ?? ""} border-0 px-2 py-1`}
              >
                {shortLabel[key] ?? key}: {value}
              </Badge>
            ))}
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: (row) => {
      const hasPending = row.row.original.Pending > 0;
      // const hasPengadaan = row.row.original.Pengadaan > 0;
      // const approve_gudang = row.row.original.approve_gudang === '0';
      const id_ruangan = row.row.original.id_ruangan;
      const ruangan = row.row.original.ruangan;
      const tanggal = row.row.original.tanggal;
      const id_permintaan = row.row.original.id_permintaan;
      const id_transaksi = row.row.original.id_transaksi;
      const has_approved = row.row.original.Approved > 0;


      return (
        <div className="flex space-x-3 justify-center items-center">
          <Dialog>
            <DialogTrigger className="bg-green-500 p-1 rounded-md hover:bg-yellow-900/90">
              <Eye size={18} color="white" />
            </DialogTrigger>
            <DialogContent
              className="max-w-[70%]"
              onInteractOutside={(e) => {
                if (isSelectMenuPortal(e.target)) {
                  e.preventDefault();
                }
              }}
              onPointerDownOutside={(e) => {
                if (isSelectMenuPortal(e.target)) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader className="text-2xl font-semibold">
                Detail Permintaan
              </DialogHeader>
              <DetailPermintaan ruanganID={id_ruangan} tanggal={tanggal} id_transaksi={id_transaksi}/>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger
              disabled={!has_approved || hasPending}
              className={`bg-violet-500 p-1 rounded-md hover:bg-yellow-900/90 ${
                (!has_approved || hasPending) &&
                "cursor-not-allowed bg-violet-500/40 hover:bg-violet-500/40"
              }`}
            >
              <Printer size={18} color="white" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-2xl font-semibold">
                Tanggal Penyerahan
              </DialogHeader>
              <BlankoForm
                ruanganID={id_ruangan}
                tanggal={tanggal}
                ruangan={ruangan}
                id_transaksi={id_transaksi}
                noSurat={id_permintaan}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
