import {ColumnDef} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import {Button} from '@/components/ui/button';

// Ensure the row type is a single object, not an array
type BarangBASORow = {
  nama_barang: string;
  satuan: string;
  total_persediaan: number;
  harga_satuan: number;
};

export const barangBASOColumns: ColumnDef<BarangBASORow>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'nama_barang',
    header: ({column}) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Barang
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'total_persediaan',
    header: ({column}) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stok
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'satuan',
    header: 'Satuan',
  },
  {
    accessorKey: 'harga_satuan',
    header: ({column}) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Harga Satuan
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (row) => {
      const harga = row.row.original.harga_satuan; // akses dari original data
      const format = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(harga);
      return format;
    },
  },
  {
    accessorKey: 'harga_total',
    header: ({column}) => (
      <Button
        className='p-0'
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Harga Total
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: (row) => {
      const jumlah = row.row.original.total_persediaan; // atau stok_dasar, atau field lain sesuai kebutuhan
      const hargaSatuan = row.row.original.harga_satuan;
      const hargaTotal = Number(jumlah) * Number(hargaSatuan);
      const format = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(hargaTotal);
      return format;
    },
  },
];
