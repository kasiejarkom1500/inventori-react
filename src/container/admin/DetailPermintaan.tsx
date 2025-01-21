import DataTable from '@/components/DataTable';
import {Button} from '@/components/ui/button';
import {barangPermintaanColumns} from '@/lib/columns/barang-permintaan-column';
import {useEffect, useState} from 'react';
import {fetchDetailPermintaaan} from '@/lib/services/fetch';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {LoadingSpinner} from '@/components/ui/loading';
import {base} from '@/lib/network/base';
import {useToast} from '@/hooks/use-toast';

export default function DetailPermintaan({
  ruanganID,
  tanggal,
}: {
  ruanganID: string;
  tanggal: string;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const {data, isLoading, error} = useQuery({
    queryKey: ['detail-permintaan', ruanganID, tanggal],
    queryFn: () => fetchDetailPermintaaan(ruanganID, tanggal),
  });

  const [newData, setNewData] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item: any) => ({
        id_permintaan: item.id_permintaan,
        jumlah: item.jumlah,
        status: item.status,
      }));
      // console.log('data:' ,data.data);
      // console.log('formated',formattedData);
      setNewData(formattedData);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
  const dataPermintaanBarang = data?.data ?? [];
  // console.log(dataPermintaanBarang);

  function handleDataChange(
    id: string,
    newJumlah: string | undefined,
    newStatus: string | undefined
  ) {
    setNewData((prev) =>
      prev.map((item) =>
        item.id_permintaan === id
          ? {
              ...item,
              jumlah: newJumlah !== undefined ? newJumlah : item.jumlah,
              status: newStatus !== undefined ? newStatus : item.status,
            }
          : item
      )
    );
    console.log('new data', newData);
  }
  async function submitForm() {
    try {
      const response = await base.put('/update_status', newData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
      toast.toast({
        title: 'Berhasil',
        description: response.data.message || 'Data berhasil diproses.',
      });
      queryClient.invalidateQueries({queryKey: ['data-permintaan']});
    } catch (error) {
      console.log('error', error);
      toast.toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Gagal menyimpan data barang',
      });
    }
  }

  return (
    <>
      <DataTable
        columns={barangPermintaanColumns(handleDataChange, newData)}
        data={dataPermintaanBarang} // Use original data here
        search_placeholder='barang'
        column_name='nama_barang'
      />
      <Button className='w-fit px-8 ml-auto' onClick={submitForm}>
        Submit
      </Button>
    </>
  );
}
