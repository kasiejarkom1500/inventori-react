import {ColumnDef} from '@tanstack/react-table';
import { BarangPembelian } from '../types/barang';

export const detailPembelianColumns: ColumnDef<BarangPembelian>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'nama_barang',
    header: 'Nama Barang',
  },
  {
    accessorKey: 'jumlah',
    header: 'Jumlah Pembelian',
  },
  {
    accessorKey: 'harga',
    header: 'Harga Satuan Pembelian',
  },
];
