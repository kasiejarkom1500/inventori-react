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
import ReactSelect from "react-select";

type EditedRow = {
  id_permintaan: number;
  id_barang: string;
  kd_barang?: string;
  nama_barang?: string;
  kategori?: string;
  satuan?: string;
  stok?: number | string;
  jumlah_approved: string | number;
  status: string;
  is_buat_pengajuan: boolean;
  kd_subkategori?: string;
};

export const barangPermintaanColumns = (
  handleDataChange: (
    id_permintaan: number,
    changes: Partial<EditedRow>
  ) => void,
  newData: EditedRow[],
  subkategoriList: { kd_subkategori: string; sub_kategori: string }[],
  barangList: any[],
  portalTarget?: HTMLElement
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
    cell: (row) => {
      const current = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      );
      return current?.kd_barang || row.row.original.kd_barang;
    },
  },
  {
    accessorKey: "nama_barang",
    header: "Nama Barang",
    cell: (row) => {
      const current = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      );
      const barangOptions = barangList.map((item: any) => ({
        value: String(item.id_barang),
        label: item.nama_barang,
        kd_barang: item.kd_barang,
        nama_barang: item.nama_barang,
        kategori: item.kategori,
        satuan: item.satuan,
        stok: item.stok,
      }));

      const selectedValue =
        current?.id_barang || String(row.row.original.id_barang);
      const selectedOption = barangOptions.find(
        (opt) => opt.value === selectedValue
      );
      const portalTargetFinal =
        portalTarget ||
        (typeof document !== "undefined" ? document.body : undefined);

      return (
        <div
          className="min-w-[220px]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          data-permintaan-portal={row.row.original.id_permintaan}
        >
          <ReactSelect
            classNamePrefix="select"
            options={barangOptions}
            value={selectedOption}
            isSearchable
            isDisabled={(current?.status || row.row.original.status) === "Approved"}
            menuPortalTarget={portalTargetFinal}
            menuPosition="fixed"
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 99999,
                pointerEvents: "auto",
              }),
              control: (base) => ({ ...base, minHeight: "38px" }),
            }}
            onChange={(selected) => {
              if (!selected) return;
              handleDataChange(row.row.original.id_permintaan, {
                id_barang: selected.value,
                kd_barang: selected.kd_barang,
                nama_barang: selected.nama_barang,
                kategori: selected.kategori,
                satuan: selected.satuan,
                stok: selected.stok,
              });
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "kategori",
    header: "Jenis Barang",
    cell: (row) => {
      const current = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      );
      return current?.kategori || row.row.original.kategori;
    },
  },
  {
    id: "sub_kategori",
    header: "Sub Kategori",
    cell: (row) => {
      const currentSubKategori = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.kd_subkategori ?? row.row.original.kd_subkategori;

      return (
            <Select
              value={currentSubKategori}
              onValueChange={(newKdSubKategori) => {
                console.log("newSubKategori", newKdSubKategori);
                handleDataChange(
                  row.row.original.id_permintaan,
                  { kd_subkategori: newKdSubKategori }
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
    cell: (row) => {
      const current = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      );
      return current?.satuan || row.row.original.satuan;
    },
  },
  {
    accessorKey: "stok",
    header: "Stok",
    cell: (row) => {
      const current = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      );
      return current?.stok ?? row.row.original.stok;
    },
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
      )?.jumlah_approved ?? row.row.original.jumlah_approved;
      console.log('currentJumlah', currentJumlah);
      return (
        <Input
          type="number"
          defaultValue={currentJumlah}
          onBlur={(e) =>
            handleDataChange(
              row.row.original.id_permintaan,
              { jumlah_approved: Number(e.target.value) }
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
        <Badge variant={status as "Pending" | "Approved" | "Rejected" | "Pengadaan" | "Approved Gudang"}>
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
      )?.status ?? row.row.original.status;
      return (
        <Select
          value={currentStatus}
          onValueChange={(newStatus) =>
            handleDataChange(
              row.row.original.id_permintaan,
              { status: newStatus }
            )
          }
          disabled={currentStatus === "Approved"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ubah Status</SelectLabel>
              {/* <SelectItem value="Approved">Approved</SelectItem> */}
              <SelectItem value="Approved Gudang">Approved Gudang</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              {/* <SelectItem value="Pengadaan">Pengadaan</SelectItem> */}
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
      )?.is_buat_pengajuan ?? row.row.original.is_buat_pengajuan;
      // console.log("currentIsBuatPengajuan", currentIsBuatPengajuan);
      return (
        <Switch
          checked={currentIsBuatPengajuan} // Convert to boolean
          onCheckedChange={(newIsBuatPengajuan) =>
            handleDataChange(
              row.row.original.id_permintaan,
              { is_buat_pengajuan: newIsBuatPengajuan }
            )
          }
        ></Switch>
      );
    },
  },
];
