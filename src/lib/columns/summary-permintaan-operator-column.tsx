import { ColumnDef } from "@tanstack/react-table";
import { SummaryPermintaan } from "@/lib/types/barang";
import { ArrowUpDown, CircleCheckBig, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DetailPermintaan from "@/container/operator-ruangan/DetailPermintaan";
import { Button } from "@/components/ui/button";
import { getUser } from "../network/authServices";
// aa

export const summaryPermintaanOperatorColumns: ColumnDef<SummaryPermintaan>[] =
  [
    {
      header: "No",
      cell: (row) => row.row.index + 1,
    },
    {
      accessorKey: "tanggal",
      header: "Tanggal Permintaan",
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (row) => {
        const status = {
          Approved: row.row.original.Approved,
          Pending: row.row.original.Pending,
          Rejected: row.row.original.Rejected,
          Pengadaan: row.row.original.Pengadaan,
        };
        return (
          <ul className="list-disc list-inside first:marker:text-green-500 [&:nth-child(2)]:marker:text-yellow-500 last:marker:text-red-500">
            {Object.entries(status).map(([key, value]) => (
              <li key={key}>
                {key} : {value}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      header: "Action",
      cell: (row) => {
        const id_ruangan = row.row.original.id_ruangan;
        const tanggal = row.row.original.tanggal;
        const id_transaksi = row.row.original.id_transaksi;
        const user = getUser();
        // console.log(user);
        const onApproveClick = () => {
          // Handle approve action here
          console.log(`Approve clicked for transaction ID: ${id_transaksi}`);
        };
        return (
          <div className="flex gap-3 items-center justify-center">
            <div className="flex space-x-3 justify-center items-center">
              <Dialog>
                <DialogTrigger className="bg-green-500 p-1 rounded-md hover:bg-green-300">
                  <Eye size={18} color="white" />
                </DialogTrigger>
                <DialogContent className="max-w-[70%]">
                  <DialogHeader className="text-2xl font-semibold">
                    Detail Permintaan
                  </DialogHeader>
                  <DetailPermintaan
                    ruanganID={id_ruangan}
                    tanggal={tanggal}
                    id_transaksi={id_transaksi}
                  />
                </DialogContent>
              </Dialog>
            </div>
            {user.role === "ketua-tim" && (
              <div className="flex space-x-3 justify-center items-center">
                <div
                  className="bg-purple-500 p-1 rounded-md hover:bg-purple-300"
                  onClick={onApproveClick}
                >
                  <CircleCheckBig size={18} color="white"></CircleCheckBig>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];
