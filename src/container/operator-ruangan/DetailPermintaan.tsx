import DataTable from '@/components/DataTable';
import { LoadingSpinner } from '@/components/ui/loading';
import { detailPermintaanOperatorColumns } from '@/lib/columns/detail-permintaan-operator-column';
import { fetchDetailPermintaaan } from '@/lib/services/fetch';
import { useQuery} from '@tanstack/react-query';

export default function DetailPermintaan({
  ruanganID,
  tanggal,
}: {
  ruanganID: string;
  tanggal: string;
}) {


  const {data, isLoading, error} = useQuery({
    queryKey: ['detail-permintaan', ruanganID, tanggal],
    queryFn: () => fetchDetailPermintaaan(ruanganID, tanggal),
  });

 

  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
  const dataPermintaanBarang = data?.data ?? [];
  console.log(dataPermintaanBarang);
  


  return (
    <DataTable
      columns={detailPermintaanOperatorColumns}
      data={dataPermintaanBarang}
    />
  );
}
