import {ColumnDef} from '@tanstack/react-table';
import {Pencil, Trash2} from 'lucide-react';
import {User} from '@/lib/types/user';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AdminForm from '@/components/AdminForm';
export const adminColumns: ColumnDef<User>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
  },
  {
    accessorKey: 'email',
    header: 'username',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    header: 'Action',
    cell: (row) => {
      const detail = row.row.original.id;
      return (
        <Dialog>
          <div className='flex space-x-3 justify-center items-center'>
            <DialogTrigger className='bg-yellow-500 p-1 rounded-md hover:bg-yellow-900/90'>
              <Pencil size={18} color='white' />
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className='text-xl font-semibold'>
                Edit Admin
              </DialogTitle>
              <AdminForm id={detail} type='edit' />
            </DialogContent>
            <Button className='bg-red-500 p-1 h-fit rounded-md hover:bg-red-900/90'>
              <Trash2 size={18} color='white' />
            </Button>
          </div>
        </Dialog>
      );
    },
  },
];
