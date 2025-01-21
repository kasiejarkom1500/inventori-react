import {ColumnDef} from '@tanstack/react-table';
import {SummaryPengajuan} from '@/lib/types/barang';
import {ArrowUpDown, Eye} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import DetailPengajuan from '@/container/operator-ruangan/DetailPengajuan';
import {Button} from '@/components/ui/button';

export const summaryPengajuanOperatorColumns: ColumnDef<SummaryPengajuan>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'tanggal',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ruangan
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'jumlah_pengajuan',
    header: 'Jumlah pengajuan',
  },
  {
    accessorKey: 'ruangan',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ruangan
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'Pending',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (row) => {
      const status = {
        Approved: row.row.original.Approved,
        Pending: row.row.original.Pending,
        Rejected: row.row.original.Rejected,
      };
      return (
        <ul className='list-disc list-inside first:marker:text-green-500 [&:nth-child(2)]:marker:text-yellow-500 last:marker:text-red-500'>
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
    header: 'Action',
    cell: (row) => {
      const id_ruangan = row.row.original.id_ruangan;
      const tanggal = row.row.original.tanggal;
      return (
        <Dialog>
          <div className='flex space-x-3 justify-center items-center'>
            {/* <Link to={'/'} className='bg-green-500 p-1 rounded-md hover:bg-green-900/90'>
          <CirclePlus size={18} color='white' />
        </Link> */}
            <DialogTrigger className='bg-green-500 p-1 rounded-md hover:bg-yellow-900/90'>
              <Eye size={18} color='white' />
            </DialogTrigger>
            <DialogContent className='max-w-[70%]'>
              <DialogHeader className='text-2xl font-semibold'>
                Detail Pengajuan
              </DialogHeader>
              <DetailPengajuan ruanganID={id_ruangan} tanggal={tanggal} />
            </DialogContent>
            {/* <Link to={'/'} className='bg-sky-500 p-1 rounded-md hover:bg-sky-900/90'>
          <Download size={18} color='white' />
        </Link> */}
            {/* <Link
          to={'/'}
          className='bg-red-500 p-1 rounded-md hover:bg-red-900/90'
        >
          <Trash2 size={18} color='white' />
        </Link> */}
          </div>
        </Dialog>
      );
    },
  },
];
