import DataTable from '@/components/DataTable';
import { LoadingSpinner } from '@/components/ui/loading';
import { detailPermintaanOperatorColumns } from '@/lib/columns/detail-permintaan-operator-column';
import { fetchDetailPermintaaan } from '@/lib/services/fetch';
import { useQuery} from '@tanstack/react-query';

export default function DetailPermintaan({
  ruanganID,
  tanggal,
  id_transaksi
}: {
  ruanganID: string;
  tanggal: string;
  id_transaksi: string;
}) {


  const {data, isLoading, error} = useQuery({
    queryKey: ['detail-permintaan', ruanganID, tanggal, id_transaksi],
    queryFn: () => fetchDetailPermintaaan(ruanganID, tanggal, id_transaksi),
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
    <div className="max-h-[70vh] overflow-auto">
      <div className="overflow-x-auto">
        <DataTable
          columns={detailPermintaanOperatorColumns}
          data={dataPermintaanBarang}
          hiddenColumns={["tanggal", "kategori"]}
        />
      </div>
    </div>
  );
}
