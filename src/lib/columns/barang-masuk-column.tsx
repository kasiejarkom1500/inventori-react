import {ColumnDef} from '@tanstack/react-table';
import {Pencil} from 'lucide-react';
import {BarangTrans} from '@/lib/types/barang';
import {Link} from 'react-router-dom';

export const barangMasukColumns: ColumnDef<BarangTrans>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal Masuk',
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
  },
  {
    accessorKey: 'ruangan',
    header: 'Ruangan',
  },
  {
    header: 'Action',
    cell: () => (
      <div className='flex space-x-3 justify-center items-center'>
        {/* <Link to={'/'} className='bg-green-500 p-1 rounded-md hover:bg-green-900/90'>
          <CirclePlus size={18} color='white' />
        </Link> */}
        <Link
          to={'/'}
          className='bg-yellow-500 p-1 rounded-md hover:bg-yellow-900/90'
        >
          <Pencil size={18} color='white' />
        </Link>
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
    ),
  },
];
