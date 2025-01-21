import DataTable from '@/components/DataTable';
import {LoadingSpinner} from '@/components/ui/loading';
import {detailPengajuanOperatorColumns} from '@/lib/columns/detail-pengajuan-operator-column';
import {fetchDetailPengajuan} from '@/lib/services/pengajuanService';
import {useQuery} from '@tanstack/react-query';

export default function DetailPengajuan({
  ruanganID,
  tanggal,
}: {
  ruanganID: string;
  tanggal: string;
}) {
  const {data, isLoading, error} = useQuery({
    queryKey: ['detail-pengajuan', ruanganID, tanggal],
    queryFn: () => fetchDetailPengajuan(ruanganID, tanggal),
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

  const dataDetailPengajuan = data?.data ?? [];
  return (
    <DataTable
      columns={detailPengajuanOperatorColumns}
      data={dataDetailPengajuan}
    />
  );
}
