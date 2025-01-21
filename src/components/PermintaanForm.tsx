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
import {fetchAllBarang} from '@/lib/services/fetch';
import Select from 'react-select';
import {LoadingSpinner} from './ui/loading';
import DataTable from './DataTable';
import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {base} from '@/lib/network/base';

const permintaanSchema = z.object({
  id_user: z.string(),
  nama: z.string().min(1, {message: 'Nama tidak boleh kosong.'}),
  jabatan: z.string().min(1, {message: 'Jabatan tidak boleh kosong.'}),
  id_ruangan: z.string().min(1, {message: 'Ruangan harus dipilih.'}),
  tanggal: z.string().min(1, {message: 'Tanggal harus diisi.'}),
  id_barang: z.string().min(1, {message: 'Barang harus dipilih.'}),
  nama_barang: z.string(),
  kategori: z.string().min(1, {message: 'Jenis barang tidak boleh kosong.'}),
  satuan: z.string().min(1, {message: 'Satuan tidak boleh kosong.'}),
  stok: z.string().min(1, {message: 'Stok tidak boleh kurang dari 0.'}),
  jumlah: z
    .number()
    .positive({message: 'Jumlah permintaan harus lebih dari 0.'}),
});

export default function PermintaanForm() {
  const [batchData, setBatchData] = useState<
    Array<{
      nama_barang: string;
      kategori: string;
      satuan: string;
      stok: number | string;
      jumlah: number;
    }>
  >([]);

  const [requestData, setRequestData] = useState<
    Array<{
      id_barang: string;
      id_user: string;
      id_ruangan: string;
      jumlah: number;
    }>
  >([]);

  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: dataAllBarang,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['barang'],
    queryFn: fetchAllBarang,
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}') as {
    id_user: string;
    username: string;
    jabatan: string;
    data_ruangan: {id_ruangan: string; ruangan: string}[];
  };
  const ruanganUser = user.data_ruangan;
  const ruanganOptions = ruanganUser.map(
    (item: {id_ruangan: string; ruangan: string}) => ({
      value: item.id_ruangan,
      label: item.ruangan,
    })
  );

  const allBarang = dataAllBarang?.data ?? [];
  const barangOptions = allBarang.map(
    (item: {id_barang: string; nama_barang: string}) => ({
      value: item.id_barang,
      label: item.nama_barang,
    })
  );

  const form = useForm<z.infer<typeof permintaanSchema>>({
    resolver: zodResolver(permintaanSchema),
    defaultValues: {
      id_user: user.id_user,
      nama: user.username,
      jabatan: user.jabatan,
      id_ruangan: '',
      tanggal: new Date().toISOString().split('T')[0],
      id_barang: '',
      nama_barang: '',
      kategori: '',
      satuan: '',
      stok: '',
      jumlah: 0,
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
      form.setValue('kategori', selectedBarang.kategori || '');
      form.setValue('satuan', selectedBarang.satuan || '');
      form.setValue('stok', selectedBarang.stok || 0);
    } else {
      form.setValue('nama_barang', '');
      form.setValue('kategori', '');
      form.setValue('satuan', '');
      form.setValue('stok', '');
    }

    // Update nilai barang yang dipilih
    form.setValue('id_barang', selectedOption?.value || '');
  };

  function onSubmit(values: z.infer<typeof permintaanSchema>) {
    const newData = {
      id_barang: values.id_barang,
      id_user: values.id_user,
      id_ruangan: values.id_ruangan,
      jumlah: values.jumlah,
    };

    const newBatchData = {
      nama_barang: values.nama_barang,
      kategori: values.kategori,
      satuan: values.satuan,
      stok: values.stok,
      jumlah: values.jumlah,
    };

    setRequestData((prev) => [...prev, newData]);
    setBatchData((prev) => [...prev, newBatchData]);

    // form.reset({
    //   ...form.getValues(),
    //   id_barang: '',
    //   nama_barang: '',
    //   kategori: '',
    //   satuan: '',
    //   stok: '',
    //   jumlah: 0,
    // });
  }
  const handleSubmitBatch = async () => {
    try {
      console.log('Batch Request Data:', requestData);
      const response = await base.post('/tambah_permintaan', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      toast.toast({
        title: 'Berhasil',
        description: response.data.message,
      });
      queryClient.invalidateQueries({queryKey: 'data-permintaan-user'});
    } catch (error) {
      console.error('Gagal mengupdate data:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Gagal mengupdate data barang',
      });
    }
  };

  if (isLoading) return <LoadingSpinner className='mx-auto' size={24} />;
  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className='flex'>
      <div className='w-2/5 pr-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='nama'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input disabled placeholder='Nama' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='jabatan'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <FormControl>
                    <Input disabled placeholder='Jabatan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='id_ruangan'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Ruangan</FormLabel>
                  <FormControl>
                    <Select
                      options={ruanganOptions}
                      onChange={(selectedOption) =>
                        field.onChange(
                          selectedOption ? selectedOption.value : ''
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tanggal'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Tanggal</FormLabel>
                  <FormControl>
                    <Input disabled type='date' {...field} />
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
              name='kategori'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Kategori Barang</FormLabel>
                  <FormControl>
                    <Input disabled placeholder='Kategori Barang' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='satuan'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Input disabled placeholder='Satuan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stok'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Stok</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type='number'
                      placeholder='Stok'
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
              name='jumlah'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Jumlah Permintaan</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Jumlah Permintaan'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
            {header: 'Kategori', accessorKey: 'kategori'},
            {header: 'Satuan', accessorKey: 'satuan'},
            {header: 'Stok', accessorKey: 'stok'},
            {header: 'Jumlah', accessorKey: 'jumlah'},
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
