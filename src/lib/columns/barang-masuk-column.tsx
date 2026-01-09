import {ColumnDef} from '@tanstack/react-table';
import {BarangTrans} from '@/lib/types/barang';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Wrench } from 'lucide-react';

const formatDate = (value?: string) => {
  if (!value) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const barangMasukColumns = (
  handlers?: {
    onEdit?: (row: BarangTrans) => void;
    onDelete?: (row: BarangTrans) => void;
    onAdjust?: (row: BarangTrans) => void;
  }
): ColumnDef<BarangTrans>[] => [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal Masuk',
    cell: ({getValue}) => formatDate(getValue() as string),
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
    accessorKey: 'catatan',
    header: 'Catatan',
  },
  {
    header: 'Action',
    cell: ({ row }) => {
      const original = row.original;
      const onEdit = handlers?.onEdit || (() => {});
      const onDelete = handlers?.onDelete || (() => {});
      const onAdjust = handlers?.onAdjust || (() => {});
      return (
        <div className='flex space-x-2'>
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
