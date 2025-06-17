// Parent Component: PengajuanForm
import {Button} from './ui/button';
import RegisteredItemForm from './RegisteredItemForm';
import UnregisteredItemForm from './UnregisteredItemForm';
import DataTable from './DataTable';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {base} from '@/lib/network/base';
import {useQueryClient} from '@tanstack/react-query';
import { useDialog } from '@/context/dialog';

export interface BatchData {
  nama_barang: string;
  kategori: string;
  satuan: string;
  stok: number;
  jumlah: number;
}

export interface RequestData {
  id_barang: string;
  nama_barang: string;
  kategori: string;
  satuan: string;
  id_user: string;
  id_ruangan: string;
  jumlah: number;
}

export default function PengajuanForm() {
  const { closeDialog } = useDialog();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [batchData, setBatchData] = useState<BatchData[]>([]);
  const [requestData, setRequestData] = useState<RequestData[]>([]);

  const handleRegisteredSubmit = (
    newData: RequestData,
    newBatchData: BatchData
  ) => {
    setRequestData((prev) => [...prev, newData]);
    setBatchData((prev) => [...prev, newBatchData]);
  };

  const handleUnregisteredSubmit = (
    newData: RequestData,
    newBatchData: BatchData
  ) => {
    setRequestData((prev) => [...prev, newData]);
    setBatchData((prev) => [...prev, newBatchData]);
  };

  const handleSubmitBatch = async () => {
    try {
      console.log('Batch Request Data:', requestData);
      const response = await base.post('/tambah_pengajuan', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      toast.toast({
        title: 'Berhasil',
        description: response.data.message,
      });
      queryClient.invalidateQueries({queryKey: 'data-pengajuan-user'});
      closeDialog();
    } catch (error) {
      console.error('Gagal mengupdate data:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Gagal mengupdate data barang',
      });
    }
  };

  const handleDelete = (indexToDelete: number) => {
    setBatchData((prevBatchData) =>
      prevBatchData.filter((_, index) => index !== indexToDelete)
    );

    setRequestData((prevRequestData) =>
      prevRequestData.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div className='flex'>
      <div className='w-2/5 pr-4'>
        <Tabs defaultValue='0'>
          <TabsList>
            <TabsTrigger value='0'>Form Barang Terdaftar</TabsTrigger>
            <TabsTrigger value='1'>Form Barang Baru</TabsTrigger>
          </TabsList>
          <TabsContent value='0'>
            <RegisteredItemForm onSubmit={handleRegisteredSubmit} />
          </TabsContent>
          <TabsContent value='1'>
            <UnregisteredItemForm onSubmit={handleUnregisteredSubmit} />
          </TabsContent>
        </Tabs>
      </div>
      <div className='w-3/5 pl-4 border-l'>
        <DataTable
          columns={[
            {header: 'Nama Barang', accessorKey: 'nama_barang'},
            {header: 'Kategori', accessorKey: 'kategori'},
            {header: 'Satuan', accessorKey: 'satuan'},
            {header: 'Stok', accessorKey: 'stok'},
            {header: 'Jumlah', accessorKey: 'jumlah'},
            {
              header: 'Aksi',
              cell: ({ row }) => (
                <button
                  onClick={() => handleDelete(row.index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
              ),
            },
          ]}
          data={batchData}
          column_name='nama_barang'
        />
        <Button className='mt-4' onClick={handleSubmitBatch}>
          Submit Batch
        </Button>
      </div>
    </div>
  );
}
