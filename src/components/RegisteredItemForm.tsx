// Child Component 1: RegisteredItemForm
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
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
import Select from 'react-select';
import {useQuery} from '@tanstack/react-query';
import {fetchAllBarang} from '@/lib/services/fetch';
import { BatchData, RequestData } from './PengajuanForm';

const registeredPermintaanSchema = z.object({
  id_user_registered: z.string(),
  nama_registered: z.string().min(1, {message: 'Nama tidak boleh kosong.'}),
  jabatan_registered: z
    .string()
    .min(1, {message: 'Jabatan tidak boleh kosong.'}),
  id_ruangan_registered: z.string().min(1, {message: 'Ruangan harus dipilih.'}),
  tanggal_registered: z.string().min(1, {message: 'Tanggal harus diisi.'}),
  id_barang_registered: z.string().min(1, {message: 'Barang harus dipilih.'}),
  nama_barang_registered: z.string(),
  kategori_registered: z
    .string()
    .min(1, {message: 'Jenis barang tidak boleh kosong.'}),
  satuan_registered: z.string().min(1, {message: 'Satuan tidak boleh kosong.'}),
  stok_registered: z.coerce
    .number()
    .nonnegative({message: 'Stok tidak boleh kosong.'}),
  jumlah_registered: z.coerce
    .number()
    .positive({message: 'Jumlah permintaan harus lebih dari 0.'}),
});



export default function RegisteredItemForm({
  onSubmit,
}: {
  onSubmit: (newData: RequestData, newBatchData: BatchData) => void;
}) {
  const user = JSON.parse(localStorage.getItem('user') || '{}') as {
    id_user: string;
    username: string;
    jabatan: string;
    data_ruangan: {id_ruangan: string; ruangan: string}[];
  };
  const registeredItemForm = useForm<
    z.infer<typeof registeredPermintaanSchema>
  >({
    resolver: zodResolver(registeredPermintaanSchema),
    defaultValues: {
      id_user_registered: user.id_user,
      nama_registered: user.username,
      jabatan_registered: user.jabatan,
      id_ruangan_registered: '',
      tanggal_registered: new Date().toISOString().split('T')[0],
      id_barang_registered: '0',
      nama_barang_registered: '',
      kategori_registered: '',
      satuan_registered: '',
      stok_registered: 0,
      jumlah_registered: undefined,
    },
  });

  const {data: dataAllBarang} = useQuery({
    queryKey: ['barang'],
    queryFn: fetchAllBarang,
  });

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

  const handleBarangChange = (
    selectedOption: {value: string; label: string} | null
  ) => {
    const barangId = selectedOption?.value;
    const selectedBarang = allBarang.find(
      (item: {id_barang: string}) => item.id_barang === barangId
    );

    // Jika barang ditemukan, update kategori, satuan, dan stok
    if (selectedBarang) {
      registeredItemForm.setValue(
        'nama_barang_registered',
        selectedBarang.nama_barang || ''
      );
      registeredItemForm.setValue(
        'kategori_registered',
        selectedBarang.kategori || ''
      );
      registeredItemForm.setValue(
        'satuan_registered',
        selectedBarang.satuan || ''
      );
      registeredItemForm.setValue('stok_registered', selectedBarang.stok || 0);
    } else {
      registeredItemForm.setValue('nama_barang_registered', '');
      registeredItemForm.setValue('kategori_registered', '');
      registeredItemForm.setValue('satuan_registered', '');
      registeredItemForm.setValue('stok_registered', 0);
    }

    // Update nilai barang yang dipilih
    registeredItemForm.setValue(
      'id_barang_registered',
      selectedOption?.value || ''
    );
  };

  function handleSubmit(values: z.infer<typeof registeredPermintaanSchema>) {
    console.log('Registered Item Form:', values);
    const newData = {
      id_barang: values.id_barang_registered,
      nama_barang: values.nama_barang_registered,
      kategori: values.kategori_registered,
      satuan: values.satuan_registered,
      id_user: values.id_user_registered,
      id_ruangan: values.id_ruangan_registered,
      jumlah: values.jumlah_registered,
    };

    const newBatchData = {
      nama_barang: values.nama_barang_registered,
      kategori: values.kategori_registered,
      satuan: values.satuan_registered,
      stok: values.stok_registered,
      jumlah: values.jumlah_registered,
    };

    onSubmit(newData, newBatchData);
  }

  return (
    <Form {...registeredItemForm}>
      <form
        onSubmit={registeredItemForm.handleSubmit(handleSubmit)}
        className='space-y-8'
      >
        {/* Add form fields similar to your original form here */}
        <FormField
          control={registeredItemForm.control}
          name='nama_registered'
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
          control={registeredItemForm.control}
          name='jabatan_registered'
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
          control={registeredItemForm.control}
          name='id_ruangan_registered'
          render={({field}) => (
            <FormItem>
              <FormLabel>Ruangan</FormLabel>
              <FormControl>
                <Select
                  options={ruanganOptions}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption ? selectedOption.value : '')
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registeredItemForm.control}
          name='tanggal_registered'
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
          control={registeredItemForm.control}
          name='id_barang_registered'
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
          control={registeredItemForm.control}
          name='kategori_registered'
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
          control={registeredItemForm.control}
          name='satuan_registered'
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
          control={registeredItemForm.control}
          name='stok_registered'
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
          control={registeredItemForm.control}
          name='jumlah_registered'
          render={({field}) => (
            <FormItem>
              <FormLabel>Jumlah Pengajuan</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Jumlah Pengajuan'
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
  );
}
