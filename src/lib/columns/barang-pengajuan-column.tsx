import { ColumnDef } from "@tanstack/react-table";
import { BarangPengajuan } from "@/lib/types/barang";
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
import ProgramKomponenDrawer from "@/components/ProgramKomponenDrawer";

export const barangPengajuanColumns = (
  handleDataChange: (
    id_pengajuan: string,
    newKategori: string | undefined,
    newJumlah: string | undefined,
    newHarga: string | undefined,
    newStatus: string | undefined,
    newKdSubkategori: string | undefined,
    programData?: {
      kd_program?: string;
      kd_kegiatan?: string;
      kd_kro?: string;
      kd_ro?: string;
      kd_komponen?: string;
    } 
  ) => void,
  newData: {
    id_pengajuan: string;
    kategori: string;
    jumlah: string;
    harga_satuan: string;
    status: string;
    kd_subkategori: string;
    kd_program?: string;
    kd_kegiatan?: string;
    kd_kro?: string;
    kd_ro?: string;
    kd_komponen?: string;
  }[],
  subkategoriList: { kd_subkategori: string; sub_kategori: string }[]
): ColumnDef<BarangPengajuan>[] => [
  {
    header: "No",
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal Pengajuan",
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
    header: "Jenis Barang",
    cell: (row) => {
      const currentKategori = newData.find(
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
      )?.kategori;

      return (
        <Select
          value={currentKategori}
          onValueChange={(newKategori) =>
            handleDataChange(
              row.row.original.id_pengajuan,
              newKategori,
              undefined,
              undefined,
              undefined,
              undefined
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis barang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ATK">ATK</SelectItem>
              <SelectItem value="ARK">ARK</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    header: "Sub Kategori",
    cell: (row) => {
      const currentSubKategori = newData.find(
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
      )?.kd_subkategori;

      return (
        <Select
          value={currentSubKategori}
          onValueChange={(newKdSubKategori) => {
            console.log("newSubKategori", newKdSubKategori);
            handleDataChange(
              row.row.original.id_pengajuan,
              undefined,
              undefined,
              undefined,
              undefined,
              newKdSubKategori
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis barang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {subkategoriList.map((sub) => {
                // console.log("sub", sub); // Cek tiap item
                return (
                  <SelectItem
                    key={sub.kd_subkategori}
                    value={sub.kd_subkategori}
                  >
                    {sub.sub_kategori}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "satuan",
    header: "Satuan",
  },
  {
    accessorKey: "harga_satuan",
    header: "Harga",
    cell: (row) => {
      const currentHarga = newData.find(
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
      )?.harga_satuan;
      // console.log("currentHarga", currentHarga);
      return (
        <Input
          defaultValue={currentHarga}
          className="min-w-16"
          onBlur={(e) =>
            handleDataChange(
              row.row.original.id_pengajuan,
              undefined,
              undefined,
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
    accessorKey: "jumlah",
    header: "Jumlah",
    cell: (row) => {
      const currentJumlah = newData.find(
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
      )?.jumlah;
      // console.log('currentJumlah', currentJumlah);
      return (
        <Input
          type="number"
          defaultValue={currentJumlah}
          onBlur={(e) =>
            handleDataChange(
              row.row.original.id_pengajuan,
              undefined,
              e.target.value,
              undefined,
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
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
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
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
      )?.status;
      return (
        <Select
          value={currentStatus}
          onValueChange={(newStatus) =>
            handleDataChange(
              row.row.original.id_pengajuan,
              undefined,
              undefined,
              undefined,
              newStatus,
              undefined
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
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
    header: "Program / Komponen",
    cell: (row) => {
      const currentBarang = newData.find(
        (item) => item.id_pengajuan === row.row.original.id_pengajuan
      );

      return (
        <ProgramKomponenDrawer
          currentBarang={currentBarang}
          onSave={(programData) =>
            handleDataChange(
              row.row.original.id_pengajuan,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              programData
            )
          }
        />
      );
    },
  },
];
