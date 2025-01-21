import DataTable from '@/components/DataTable';
import {Card} from '@/components/ui/card';
import {LoadingSpinner} from '@/components/ui/loading';
import {summaryPermintaanColumns} from '@/lib/columns/summary-permintaan-column';
import {base} from '@/lib/network/base';
import {useQuery} from '@tanstack/react-query';

async function fetchPermintaan() {
  const response = await base.get('/get_transaksi_permintaan');
  return response.data;
}

export default function PermintaanBarang() {
  const {data, isLoading, error} = useQuery({
    queryKey: ['data-permintaan'],
    queryFn: fetchPermintaan,
  });
  if (isLoading) {
    return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  }
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const dataSummaryPermintaan = data?.data ?? [];
  console.log(dataSummaryPermintaan);
  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Permintaan Barang
      </h1>
      <DataTable
        columns={summaryPermintaanColumns}
        data={dataSummaryPermintaan}
        search_placeholder='nama ruangan'
        column_name='ruangan'
      />
    </Card>
  );
}
