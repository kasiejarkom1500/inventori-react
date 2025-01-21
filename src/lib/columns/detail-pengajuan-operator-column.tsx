import {ColumnDef} from '@tanstack/react-table';
import {BarangPengajuan} from '@/lib/types/barang';
import {Badge} from '@/components/ui/badge';

export const detailPengajuanOperatorColumns: ColumnDef<BarangPengajuan>[] = [
  {
    header: 'No',
    cell: (row) => row.row.index + 1,
  },
  {
    accessorKey: 'tanggal',
    header: 'Tanggal Pengajuan',
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
    header: 'Jumlah Pengajuan',
  },
  {
    accessorKey: 'id_ruangan',
    header: 'Ruangan',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (row) => {
      const status = row.row.original.status;
      return (
        <Badge variant={status as 'Pending' | 'Approved' | 'Rejected'}>
          {status}
        </Badge>
      );
    },
  },
  
];
