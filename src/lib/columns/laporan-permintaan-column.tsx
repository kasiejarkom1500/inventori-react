import {ColumnDef} from '@tanstack/react-table';
import {BarangKarken} from '@/lib/types/barang';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export const laporanPermintaanColumns = (
  printKarkenSatuan: (id_barang: number) => void
): ColumnDef<BarangKarken>[] => [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'nama_barang',
    header: 'Nama Barang',
  },
  {
    accessorKey: 'total_masuk',
    header: 'Jumlah Masuk',
  },
  {
    accessorKey: 'total_keluar',
    header: 'Jumlah Keluar',
  },
  {
    accessorKey: 'stok',
    header: 'Stok Akhir',
  },
  {
    header: 'Action',
    cell: (row) => {
      const id = row.row.original.id_barang;
      // console.log(id);
      return (
        <Button onClick={() => printKarkenSatuan(id)} className='bg-green-500'>
          <Printer />
        </Button>
      );
    },
  },
];
