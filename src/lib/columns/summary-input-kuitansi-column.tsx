import {ColumnDef} from '@tanstack/react-table';
import {InputKuitansi} from '@/lib/types/barang';
import {ArrowUpDown, Eye} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DetailPembelian from '@/container/admin-pengajuan/DetailPembelian';

export const summaryInputKuitansiColumns: ColumnDef<InputKuitansi>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'tgl_masuk',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost" className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal Input
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'no_kuitansi',
    header: 'No Kuitansi/BAST',
  },
  {
    accessorKey: 'nama_sumber',
    header: 'Sumber',
  },
  {
    header: 'Action',
    cell: (row) => {
      const id_pembelian = row.row.original.id_pembelian;
      return (
        <Dialog>
          <div className='flex space-x-3 justify-center items-center'>
            <DialogTrigger className='bg-green-500 p-1 rounded-md hover:bg-yellow-900/90'>
              <Eye size={18} color='white' />
            </DialogTrigger>
            <DialogContent className='max-w-[70%]'>
              <DialogHeader className='text-2xl font-semibold'>
                Detail Pembelian
              </DialogHeader>
             <DetailPembelian id_pembelian={id_pembelian}/>
            </DialogContent>
          </div>
        </Dialog>
      );
    },
  },
];
