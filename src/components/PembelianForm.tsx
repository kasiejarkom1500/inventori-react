import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchAllBarang, fetchAllSumber} from '@/lib/services/fetch';
import Select from 'react-select';
import {LoadingSpinner} from './ui/loading';
import DataTable from './DataTable';
import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {base} from '@/lib/network/base';
import { useDialog } from '@/context/dialog';

const pembelianSchema = z.object({
  no_kuitansi: z.string().min(1, {message: 'No Kuitansi/BAST harus diisi.'}),
  id_barang: z.string().min(1, {message: 'Barang harus dipilih.'}),
  nama_barang: z.string(),
  id_sumber: z.string().min(1, {message: 'Sumber harus dipilih.'}),
  nama_sumber: z.string(),
  jumlah: z
    .number()
    .positive({message: 'Jumlah permintaan harus lebih dari 0.'}),
  harga: z
    .number()
    .positive({message: 'Harga barang harus lebih dari 0.'}),
  tgl_masuk: z.string(),
});

export default function PembelianForm() {
  const { closeDialog } = useDialog();

  const [batchData, setBatchData] = useState<
    Array<{
      nama_barang: string;
      nama_sumber: string;
      jumlah: number;
    }>
  >([]);

  const [requestData, setRequestData] = useState<
    Array<{
      // no_kuitansi: string;
      // id_sumber:string;
      // tgl_masuk:string;
        id_barang: string;
        jumlah: number;
        harga:number;
    }>
  >([]);

  const [mainData, setMainData] = useState<{
    no_kuitansi: string;
    id_sumber:string;
    tgl_masuk:string;}>
    ({no_kuitansi : '',id_sumber : '',tgl_masuk : '',});
    

  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: dataAllBarang,
    isLoading : isLoadingBarang,
    error : errorBarang,
  } = useQuery({
    queryKey: ['barang'],
    queryFn: fetchAllBarang,
  });

  const {
    data: dataAllSumber,
    isLoading : isLoadingSumber,
    error : errorSumber,
  } = useQuery({
    queryKey: ['sumber'],
    queryFn: fetchAllSumber,
  });

  // const user = JSON.parse(localStorage.getItem('user') || '{}') as {
  //   id_user: string;
  //   username: string;
  //   jabatan: string;
  //   data_ruangan: {id_ruangan: string; ruangan: string}[];
  // };
  // const ruanganUser = user.data_ruangan;
  // const ruanganOptions = ruanganUser.map(
  //   (item: {id_ruangan: string; ruangan: string}) => ({
  //     value: item.id_ruangan,
  //     label: item.ruangan,
  //   })
  // );

  const allBarang = dataAllBarang?.data ?? [];
  const barangOptions = allBarang.map(
    (item: {id_barang: string; nama_barang: string}) => ({
      value: item.id_barang,
      label: item.nama_barang,
    })
  );

  const allSumber = dataAllSumber?.data ?? [];
  const sumberOptions = allSumber.map(
    (item: {id_sumber: string; nama_sumber: string}) => ({
      value: item.id_sumber,
      label: item.nama_sumber,
    })
  );

  const form = useForm<z.infer<typeof pembelianSchema>>({
    resolver: zodResolver(pembelianSchema),
    defaultValues: {
      no_kuitansi: '',
      id_barang: '',
      nama_barang: '',
      id_sumber: '',
      nama_sumber: '',
    },
  });

  // Fungsi untuk menangani perubahan barang yang dipilih
  const handleBarangChange = (
    selectedOption: {value: string; label: string} | null
  ) => {
    const barangId = selectedOption?.value;
    const selectedBarang = allBarang.find(
      (item: {id_barang: string}) => item.id_barang === barangId
    );

    // Jika barang ditemukan, update kategori, satuan, dan stok
    if (selectedBarang) {
      form.setValue('nama_barang', selectedBarang.nama_barang || '');
    } else {
      form.setValue('nama_barang', '');
    }

    // Update nilai barang yang dipilih
    form.setValue('id_barang', selectedOption?.value || '');
  };

  const handleSumberChange = (
    selectedOption: {value: string; label: string} | null
  ) => {
    const sumberId = selectedOption?.value;
    const selectedSumber = allSumber.find(
      (item: {id_sumber: string}) => item.id_sumber === sumberId
    );

    // Jika barang ditemukan, update kategori, satuan, dan stok
    if (selectedSumber) {
      form.setValue('nama_sumber', selectedSumber.nama_sumber || '');
    } else {
      form.setValue('nama_sumber', '');
    }

    // Update nilai barang yang dipilih
    form.setValue('id_sumber', selectedOption?.value || '');
  };

  function onSubmit(values: z.infer<typeof pembelianSchema>) {
    const isDuplicate = batchData.some(
      (item) => item.nama_barang === values.nama_barang
    );
  
    if (isDuplicate) {
      toast.toast({
        variant: 'destructive',
        title: 'Duplikasi Data',
        description: 'Barang ini sudah ada di tabel.',
      });
      return; // Jangan tambahkan data jika duplikat
    }
    const newData = {
        id_barang: values.id_barang,
        jumlah: values.jumlah,
        harga: values.harga, 
    };

    const mainData = {
      no_kuitansi : values.no_kuitansi,
      id_sumber : values.id_sumber,
      tgl_masuk : values.tgl_masuk
    };

    const newBatchData = {
      id_barang:values.id_barang,
      nama_barang: values.nama_barang,
      nama_sumber: values.nama_sumber,
      jumlah: values.jumlah,
      harga:values.harga
    };
    console.log("Batch Data", newBatchData);

    setRequestData((prev) => [...prev, newData]);
    setBatchData((prev) => [...prev, newBatchData]);
    setMainData(mainData);

  }
  const handleSubmitBatch = async () => {
    try {
      console.log('Batch Request Data:', requestData);
      console.log('Batch Main Data:', mainData);
      const sendData = [{
        no_kuitansi:mainData.no_kuitansi,
        id_sumber:mainData.id_sumber,
        tgl_masuk:mainData.tgl_masuk,
        barang:requestData
      }];
      console.log('Batch Send Data:', sendData);
  
      return;
      const response = await base.post('/tambah_pembelian', sendData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      toast.toast({
        title: response.data.status,
        description: response.data.message,
      });
      queryClient.invalidateQueries({queryKey: 'data-pembelian'});
      
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



  

  if (isLoadingBarang) return <LoadingSpinner className='mx-auto' size={24} />;
  if (errorBarang) return <div>An error has occurred: {errorBarang.message}</div>;

  
  if (isLoadingSumber) return <LoadingSpinner className='mx-auto' size={24} />;
  if (errorSumber) return <div>An error has occurred: {errorSumber.message}</div>;

  return (
    <div className='flex'>
      <div className='w-2/5 pr-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit , (errors) => {
  console.log("Validasi gagal:", errors);
})} className='space-y-8'>
            <FormField
              control={form.control}
              name='no_kuitansi'
              render={({field}) => (
                <FormItem>
                  <FormLabel>No Kuitansi/BAST</FormLabel>
                  <FormControl>
                    <Input placeholder='No Kuitansi/BAST' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tgl_masuk'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='id_barang'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Barang</FormLabel>
                  <FormControl>
                    <Select
                      options={barangOptions}
                      onChange={handleBarangChange}
                      value={barangOptions.find(
                        (item: {value: string; label: string}) =>
                          item.value === field.value
                      )}
                    />
                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name='id_sumber'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Sumber</FormLabel>
                  <FormControl>
                    <Select
                      options={sumberOptions}
                      onChange={handleSumberChange}
                      value={sumberOptions.find(
                        (item: {value: string; label: string}) =>
                          item.value === field.value
                      )}
                    />
                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='jumlah'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Jumlah Pembelian</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Jumlah Pembelian'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='harga'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Harga Satuan</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Harga' {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Tambahkan</Button>
          </form>
        </Form>
      </div>
      <div className='w-3/5 pl-4 border-l'>
        <DataTable
          columns={[
            {header: 'Nama Barang', accessorKey: 'nama_barang'},
            {header: 'Jumlah', accessorKey: 'jumlah'},
            {header: 'Harga', accessorKey: 'harga'},
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
