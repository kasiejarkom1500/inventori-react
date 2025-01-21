import DataTable from '@/components/DataTable';
import {Card} from '@/components/ui/card';
import {LoadingSpinner} from '@/components/ui/loading';
import {summaryPengajuanColumns} from '@/lib/columns/summary-pengajuan-column';
import {fetchPengajuan} from '@/lib/services/pengajuanService';
import {useQuery} from '@tanstack/react-query';

export default function PengajuanBarang() {
  const {data, isLoading} = useQuery({
    queryKey: ['data-pengajuan'],
    queryFn: fetchPengajuan,
  });

  if (isLoading) {
    return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  }
  

  const dataSummaryPengajuan = data?.data ?? [];
  console.log(dataSummaryPengajuan);

  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Pengajuan Barang
      </h1>
      <DataTable
        columns={summaryPengajuanColumns}
        data={dataSummaryPengajuan}
        column_name='ruangan'
      />
    </Card>
  );
}
