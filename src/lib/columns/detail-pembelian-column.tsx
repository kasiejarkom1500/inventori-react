import {ColumnDef} from '@tanstack/react-table';
import { BarangPembelian } from '../types/barang';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Wrench } from 'lucide-react';

export const detailPembelianColumns = ({
  onEdit,
  onDelete,
  onAdjust,
}: {
  onEdit: (row: BarangPembelian) => void;
  onDelete: (row: BarangPembelian) => void;
  onAdjust: (row: BarangPembelian) => void;
}): ColumnDef<BarangPembelian>[] => [
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
  {
    accessorKey: 'catatan',
    header: 'Catatan',
  },
  {
    accessorKey: 'catatan_penyesuaian',
    header: 'Catatan Penyesuaian',
  },
  {
    header: 'Action',
    cell: ({ row }) => {
      const original = row.original;
      return (
        <div className='flex gap-2'>
          <Button size="icon" variant="outline" onClick={() => onEdit(original)} aria-label="Edit">
            <Pencil size={16} />
          </Button>
          <Button size="icon" variant="destructive" onClick={() => onDelete(original)} aria-label="Hapus">
            <Trash2 size={16} />
          </Button>
          <Button size="icon" variant="secondary" onClick={() => onAdjust(original)} aria-label="Penyesuaian">
            <Wrench size={16} />
          </Button>
        </div>
      );
    },
  },
];
