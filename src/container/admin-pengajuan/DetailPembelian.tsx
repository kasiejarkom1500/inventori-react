import DataTable from '@/components/DataTable';
import { LoadingSpinner } from '@/components/ui/loading';
import { detailPembelianColumns } from '@/lib/columns/detail-pembelian-column';
import { fetchDetailPembelian } from '@/lib/services/pembelianService';
import { useQuery} from '@tanstack/react-query';

export default function DetailPembelian({
  id_pembelian
}: {
  id_pembelian: number;
}) {


  const {data, isLoading, error} = useQuery({
    queryKey: ['detail-pembelian', id_pembelian],
    queryFn: () => fetchDetailPembelian(id_pembelian),
  });

 

  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
  const dataPembelianBarang = data?.data ?? [];
  console.log(dataPembelianBarang);
  


  return (
    <DataTable
      columns={detailPembelianColumns}
      data={dataPembelianBarang}
      column_name='nama_barang'
    />
  );
}
