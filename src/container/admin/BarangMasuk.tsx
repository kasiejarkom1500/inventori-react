import DataTable from '@/components/DataTable';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {LoadingSpinner} from '@/components/ui/loading';
import {barangMasukColumns} from '@/lib/columns/barang-masuk-column';
import {fetchBarangMasuk} from '@/lib/services/fetch';
import {useQuery} from '@tanstack/react-query';
import {PlusCircle} from 'lucide-react';

export default function BarangMasuk() {
  const {data, isLoading} = useQuery({
    queryKey: ['barang-masuk'],
    queryFn: fetchBarangMasuk,
  });

  const dataBarangMasuk = data?.data ?? [];

  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;

  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Barang Masuk
      </h1>
      <Dialog>
        <DialogTrigger>
          <Button>
            <PlusCircle /> Tambah Barang
          </Button>
        </DialogTrigger>
        <DialogContent className='max-h-[80%] overflow-auto'>
          <DialogTitle className='text-xl font-semibold'>
            Tambah Barang Masuk
          </DialogTitle>
          <h1>asdsad</h1>
        </DialogContent>
      </Dialog>
      <DataTable columns={barangMasukColumns} data={dataBarangMasuk} />
    </Card>
  );
}
