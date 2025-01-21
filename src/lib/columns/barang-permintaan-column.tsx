import {ColumnDef} from '@tanstack/react-table';
import {BarangPermintaan} from '@/lib/types/barang';
import {Badge} from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';

export const barangPermintaanColumns = (
  handleDataChange: (
    id_permintaan: string,
    newJumlah: string | undefined,
    newStatus: string | undefined
  ) => void,
  newData: {id_permintaan: string; jumlah: string; status: string}[]
): ColumnDef<BarangPermintaan>[] => [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal Permintaan',
  },
  {
    accessorKey: 'kd_barang',
    header: 'Kode Barang',
  },
  {
    accessorKey: 'nama_barang',
    header: 'Nama Barang',
  },
  {
    accessorKey: 'kategori',
    header: 'Jenis Barang',
  },
  {
    accessorKey: 'satuan',
    header: 'Satuan',
  },
  {
    accessorKey: 'jumlah',
    header: 'Jumlah',
    cell: (row) => {
      const currentJumlah = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.jumlah;
      // console.log('currentJumlah', currentJumlah);
      return (
        <Input
          type='number'
          defaultValue={currentJumlah}
          onBlur={(e) =>
            handleDataChange(
              row.row.original.id_permintaan,
              e.target.value,
              undefined
            )
          }
        />
      );
    },
  },
  {
    accessorKey: 'id_ruangan',
    header: 'Ruangan',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (row) => {
      const status = newData.find(
        (item) => item.id_permintaan === row.row.original.id_permintaan
      )?.status;
      return (
        <Badge variant={status as 'Pending' | 'Approved' | 'Rejected'}>
          {status}
        </Badge>
      );
    },
  },
  {
    header: 'Pilih Status',
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
              newStatus
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Pilih status' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ubah Status</SelectLabel>
              <SelectItem value='Approved'>Approved</SelectItem>
              <SelectItem value='Rejected'>Rejected</SelectItem>
              <SelectItem value='Pending'>Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
];
