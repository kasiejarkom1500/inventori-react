import {ColumnDef} from '@tanstack/react-table';
import {SummaryPermintaan} from '@/lib/types/barang';
import {ArrowUpDown, Eye, Printer} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import DetailPermintaan from '@/container/admin/DetailPermintaan';
import BlankoForm from '@/components/BlankoForm';
import {Button} from '@/components/ui/button';

export const summaryPermintaanColumns: ColumnDef<SummaryPermintaan>[] = [
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
          Tanggal Permintaan
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'jumlah_permintaan',
    header: 'Jenis Barang',
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
      const hasPending = row.row.original.Pending > 0;
      const id_ruangan = row.row.original.id_ruangan;
      const ruangan = row.row.original.ruangan;
      const tanggal = row.row.original.tanggal;
      const id_permintaan = row.row.original.id_permintaan;
      return (
        <div className='flex space-x-3 justify-center items-center'>
          <Dialog>
            <DialogTrigger className='bg-green-500 p-1 rounded-md hover:bg-yellow-900/90'>
              <Eye size={18} color='white' />
            </DialogTrigger>
            <DialogContent className='max-w-[70%]'>
              <DialogHeader className='text-2xl font-semibold'>
                Detail Pengajuan
              </DialogHeader>
              <DetailPermintaan ruanganID={id_ruangan} tanggal={tanggal} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger
              disabled={hasPending}
              className={`bg-violet-500 p-1 rounded-md hover:bg-yellow-900/90 ${
                hasPending &&
                'cursor-not-allowed bg-violet-500/40 hover:bg-violet-500/40'
              }`}
            >
              <Printer size={18} color='white' />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className='text-2xl font-semibold'>
                Blanko Pengajuan
              </DialogHeader>
              <BlankoForm
                ruanganID={id_ruangan}
                tanggal={tanggal}
                ruangan={ruangan}
                noSurat={id_permintaan}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
