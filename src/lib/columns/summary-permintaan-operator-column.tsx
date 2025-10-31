import { ColumnDef } from "@tanstack/react-table";
import { SummaryPermintaan } from "@/lib/types/barang";
import { ArrowUpDown, CircleCheckBig, Eye, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DetailPermintaan from "@/container/operator-ruangan/DetailPermintaan";
import { Button } from "@/components/ui/button";
import { getUser } from "../network/authServices";
import {
  approveGudang,
  approveTransaksi,
} from "@/lib/services/permintaanService";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
          ApproveGudang: row.row.original.ApprovedGudang,
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
        const queryClient = useQueryClient();
        const { toast } = useToast();
        const id_ruangan = row.row.original.id_ruangan;
        const nama_ruangan = row.row.original.ruangan;
        const tanggal = row.row.original.tanggal;
        const id_transaksi = row.row.original.id_transaksi;
        const approve_tim = row.row.original.approve_tim;
        const approve_gudang = row.row.original.approve_gudang;
        const user = getUser();
        const [approved, setApproved] = useState(approve_tim === "1");
        const [approvedGudang, setApprovedGudang] = useState(
          approve_gudang === "1"
        );
        const hasApprovedGudang = row.row.original.ApprovedGudang > 0;
        const hasApproved = row.row.original.Approved > 0;
        const hasPengadaan = row.row.original.Pengadaan > 0;

        const onApproveClick = async () => {
          const newStatus = approved ? "0" : "1";
          try {
            const result = await approveTransaksi(id_transaksi, newStatus);
            setApproved(newStatus === "1");
            queryClient.invalidateQueries({
              queryKey: ["data-permintaan-user"],
            });
            toast({
              title: "Berhasil",
              description: result?.message || "Status berhasil diperbarui.",
            });
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Gagal",
              description: "Status gagal diperbarui.",
            });
          }
        };

        const onApproveGudangClick = async () => {
          const newStatusGudang = approvedGudang ? "0" : "1";
          try {
            const result = await approveGudang(id_transaksi, newStatusGudang);
            setApprovedGudang(newStatusGudang === "1");
            queryClient.invalidateQueries({
              queryKey: ["data-permintaan-user"],
            });
            toast({
              title: "Berhasil",
              description:
                result?.message || "Status gudang berhasil diperbarui.",
            });
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Gagal",
              description: "Status gudang gagal diperbarui.",
            });
          }
        };

        return (
          <div className="flex gap-3 items-center justify-center">
            {/* === Detail === */}
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

            {/* === Approve Tim === */}
            {(user.role === "ketua_tim" || user.role === "admin") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div
                    className={`p-1 rounded-md transition-colors ${
                      !(hasPengadaan || hasApprovedGudang || hasApproved)
                        ? "cursor-pointer " +
                          (approved
                            ? "bg-red-500 hover:bg-red-300"
                            : "bg-purple-500 hover:bg-purple-300")
                        : "bg-purple-300 cursor-not-allowed"
                    }`}
                  >
                    {approved ? (
                      <XCircle size={18} color="white" />
                    ) : (
                      <CircleCheckBig size={18} color="white" />
                    )}
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white text-gray-800 border border-gray-300 shadow-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {approved
                        ? "Batalkan persetujuan?"
                        : "Setujui permintaan ini?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan{" "}
                      {approved
                        ? "membatalkan persetujuan"
                        : "menyetujui permintaan"}{" "}
                      untuk ruangan <b>#{nama_ruangan}</b> di tanggal{" "}
                      <b>{tanggal}</b>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onApproveClick}>
                      Ya, Lanjutkan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* === Approve Gudang === */}
            {(user.role === "ketua_gudang" || user.role === "admin") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div
                    className={`p-1 rounded-md transition-colors ${
                      hasApprovedGudang || hasApproved
                        ? "cursor-pointer " +
                          (approvedGudang
                            ? "bg-red-500 hover:bg-red-300"
                            : "bg-blue-500 hover:bg-blue-300")
                        : "bg-blue-300 cursor-not-allowed"
                    }`}
                    title={
                      !(hasApproved || hasApprovedGudang)
                        ? "Belum disetujui oleh Tim"
                        : ""
                    }
                  >
                    {approvedGudang ? (
                      <XCircle size={18} color="white" />
                    ) : (
                      <CircleCheckBig size={18} color="white" />
                    )}
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white text-gray-800 border border-gray-300 shadow-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {approvedGudang
                        ? "Batalkan persetujuan gudang?"
                        : "Setujui permintaan dari gudang?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan{" "}
                      {approvedGudang
                        ? "membatalkan persetujuan gudang"
                        : "menyetujui permintaan barang dari gudang"}{" "}
                      untuk ruangan <b>#{nama_ruangan}</b> di tanggal{" "}
                      <b>{tanggal}</b>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onApproveGudangClick}>
                      Ya, Lanjutkan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      },
    },
  ];
