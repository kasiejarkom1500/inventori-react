import DataTable from '@/components/DataTable';
import {Card} from '@/components/ui/card';
import { barangKeluarColumns } from '@/lib/columns/barang-keluar-column';
import { dataBarangKeluar } from '@/lib/data/barang';

export default function BarangKeluar() {
  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Barang Keluar
      </h1>
      <DataTable columns={barangKeluarColumns} data={dataBarangKeluar} />
    </Card>
  );
}
