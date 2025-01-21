import {ColumnDef} from '@tanstack/react-table';
import {Barang} from '@/lib/types/barang';

export const barangViewColumns: ColumnDef<Barang>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'kd_barang',
    header: 'Kode Barang',
  },
  {
    accessorKey: 'nama_barang',
    header: 'Nama',
  },
  {
    accessorKey: 'satuan',
    header: 'Satuan',
  },
  {
    accessorKey: 'stok',
    header: 'Stok',
  },
  {
    accessorKey: 'stok_dasar',
    header: 'Stok Dasar',
  },
];
