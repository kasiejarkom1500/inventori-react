import { ColumnDef } from "@tanstack/react-table";
import { BarangPermintaan } from "@/lib/types/barang";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const barangPermintaanColumns = (
  handleDataChange: (
    id_permintaan: number,
    newJumlah: string | undefined,
    newStatus: string | undefined,
    is_buat_pengajuan: boolean | undefined
  ) => void,
  newData: {
    id_permintaan: number;
    jumlah_approved: string;
    status: string;
    is_buat_pengajuan: boolean;
  }[]
): ColumnDef<BarangPermintaan>[] => [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal Permintaan",
  },
  {
    accessorKey: "kd_barang",
    header: "Kode Barang",
  },
  {
    accessorKey: "nama_barang",
    header: "Nama Barang",
  },
  {
    accessorKey: "kategori",
    header: "Jenis Barang",
  },
  {
    accessorKey: "satuan",
    header: "Satuan",
  },
  {
    accessorKey: "stok",
    header: "Stok",
  },
  {
    accessorKey: "jumlah",
    header: "Jumlah Permintaan",
  },
  {
    accessorKey: "jumlah_approved",
    header: "Jumlah Approved",
    cell: (row) => {
      const currentJumlah = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.jumlah_approved;
      console.log('currentJumlah', currentJumlah);
      return (
        <Input
          type="number"
          defaultValue={currentJumlah}
          onBlur={(e) =>
            handleDataChange(
              row.row.original.id_permintaan,
              e.target.value,
              undefined,
              undefined
            )
          }
        />
      );
    },
  },
  {
    accessorKey: "id_ruangan",
    header: "Ruangan",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const status = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.status;
      return (
        <Badge variant={status as "Pending" | "Approved" | "Rejected"}>
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Pilih Status",
    cell: (row) => {
      const currentStatus = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.status;
      return (
        <Select
          value={currentStatus}
          onValueChange={(newStatus) =>
            handleDataChange(
              row.row.original.id_permintaan,
              undefined,
              newStatus,
              undefined
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ubah Status</SelectLabel>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "is_buat_pengajuan",
    header: "Pengajuan Otomatis",
    cell: (row) => {
      // Find the current is_buat_pengajuan value from newData
      const currentIsBuatPengajuan = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.is_buat_pengajuan;
      // console.log("currentIsBuatPengajuan", currentIsBuatPengajuan);
      return (
        <Switch
          checked={currentIsBuatPengajuan} // Convert to boolean
          onCheckedChange={(newIsBuatPengajuan) =>
            handleDataChange(
              row.row.original.id_permintaan,
              undefined,
              undefined,
              newIsBuatPengajuan // Convert boolean to number
            )
          }
        ></Switch>
      );
    },
  },
];
