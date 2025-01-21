import {Card} from '@/components/ui/card';
import DataTable from '@/components/DataTable';
import {barangViewColumns} from '@/lib/columns/barang-column-view';
import { fetchBarangATK } from '@/lib/network/barangServices';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading';

export default function DataBarangATK() {
  const {data, isLoading, error} = useQuery({
    queryKey: ['data-barang-atk'],
    queryFn: fetchBarangATK,
  });
  console.log(data);
  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  const dataBarang = data?.data ?? [];
  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1
            className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Data Barang ATK
          </h1>
        </div>
        <DataTable data={dataBarang} columns={barangViewColumns} />
      </Card>
    </>
  );
}
