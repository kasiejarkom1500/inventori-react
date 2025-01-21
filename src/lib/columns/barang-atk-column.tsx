import {ColumnDef} from '@tanstack/react-table';
import {ArrowUpDown, Pencil} from 'lucide-react';
import {Barang} from '@/lib/types/barang';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {DeleteButton} from '@/components/DeleteButton';
import EditBarangForm from '@/components/EditBarangForm';

export const barangATKColumns: ColumnDef<Barang>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'kd_barang',
    header: ({column}) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kode Barang
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
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
    accessorKey: 'stok',
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
    accessorKey: 'stok_dasar',
    header: ({column}) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stok Dasar
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
      const harga = row.row.original.harga_satuan;
      const format = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(harga);
      return format;
    },
  },
  {
    accessorKey: 'harga_pengajuan',
    header: ({column}) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Harga Pengajuan
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (row) => {
      const harga = row.row.original.harga_pengajuan;
      const format = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(harga);
      return format;
    },
  },
  {
    header: 'Action',
    cell: (row) => {
      const id = row.row.original.id_barang;
      // console.log(id);
      return (
        <Dialog>
          <div className='flex space-x-3 justify-center items-center'>
            <DialogTrigger className='bg-yellow-500 p-1 rounded-md hover:bg-yellow-900/90'>
              <Pencil size={18} color='white' />
            </DialogTrigger>
            <DialogContent className='max-h-[80%] overflow-auto'>
              <DialogTitle className='text-xl font-semibold'>
                Edit Barang
              </DialogTitle>
              <EditBarangForm id={id} />
            </DialogContent>
            <DeleteButton
              url='hapus_barang'
              urlId={id}
              query_key='data-barang-atk'
            />
          </div>
        </Dialog>
      );
    },
  },
];
