// Child Component 2: UnregisteredItemForm
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
import Select from 'react-select';
import {Input} from '@/components/ui/input';
import { BatchData, RequestData } from './PengajuanForm';

const unregisteredPermintaanSchema = z.object({
  id_user_unregistered: z.string(),
  nama_unregistered: z.string().min(1, {message: 'Nama tidak boleh kosong.'}),
  jabatan_unregistered: z
    .string()
    .min(1, {message: 'Jabatan tidak boleh kosong.'}),
  id_ruangan_unregistered: z
    .string()
    .min(1, {message: 'Ruangan harus dipilih.'}),
  tanggal_unregistered: z.string().min(1, {message: 'Tanggal harus diisi.'}),
  id_barang_unregistered: z.string().min(1, {message: 'Barang harus dipilih.'}),
  nama_barang_unregistered: z
    .string()
    .min(1, {message: 'Nama barang tidak boleh kosong.'}),
  kategori_unregistered: z
    .string()
    .min(1, {message: 'Jenis barang tidak boleh kosong.'}),
  satuan_unregistered: z
    .string()
    .min(1, {message: 'Satuan tidak boleh kosong.'}),
  stok_unregistered: z.coerce.number(),
  jumlah_unregistered: z.coerce
    .number()
    .positive({message: 'Jumlah permintaan harus lebih dari 0.'}),
});



export default function UnregisteredItemForm({
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
  const unregisteredItemForm = useForm<
    z.infer<typeof unregisteredPermintaanSchema>
  >({
    resolver: zodResolver(unregisteredPermintaanSchema),
    defaultValues: {
      id_user_unregistered: user.id_user,
      nama_unregistered: user.username,
      jabatan_unregistered: user.jabatan,
      id_ruangan_unregistered: '',
      tanggal_unregistered: new Date().toISOString().split('T')[0],
      id_barang_unregistered: '0',
      nama_barang_unregistered: '',
      kategori_unregistered: '',
      satuan_unregistered: '',
      stok_unregistered: 0,
      jumlah_unregistered: undefined,
    },
  });

  const ruanganUser = user.data_ruangan;
  const ruanganOptions = ruanganUser.map(
    (item: {id_ruangan: string; ruangan: string}) => ({
      value: item.id_ruangan,
      label: item.ruangan,
    })
  );

  function handleSubmit(values: z.infer<typeof unregisteredPermintaanSchema>) {
    console.log('Unregistered Item Form:', values);
    const newData = {
      id_barang: values.id_barang_unregistered,
      nama_barang: values.nama_barang_unregistered,
      kategori: values.kategori_unregistered,
      satuan: values.satuan_unregistered,
      id_user: values.id_user_unregistered,
      id_ruangan: values.id_ruangan_unregistered,
      jumlah: values.jumlah_unregistered,
    };

    const newBatchData = {
      nama_barang: values.nama_barang_unregistered,
      kategori: values.kategori_unregistered,
      satuan: values.satuan_unregistered,
      stok: values.stok_unregistered,
      jumlah: values.jumlah_unregistered,
    };

    onSubmit(newData, newBatchData);
  }

  return (
    <Form {...unregisteredItemForm}>
      <form
        onSubmit={unregisteredItemForm.handleSubmit(handleSubmit)}
        className='space-y-8'
      >
        {/* Add form fields similar to your original form here */}
        <FormField
          control={unregisteredItemForm.control}
          name='nama_unregistered'
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
          control={unregisteredItemForm.control}
          name='jabatan_unregistered'
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
          control={unregisteredItemForm.control}
          name='id_ruangan_unregistered'
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
          control={unregisteredItemForm.control}
          name='tanggal_unregistered'
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
          control={unregisteredItemForm.control}
          name='nama_barang_unregistered'
          render={({field}) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder='Nama Barang' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={unregisteredItemForm.control}
          name='kategori_unregistered'
          render={({field}) => (
            <FormItem>
              <FormLabel>Kategori Barang</FormLabel>
              <FormControl>
                <Select
                  options={[
                    {value: 'ATK', label: 'ATK'},
                    {value: 'ARK', label: 'ARK'},
                  ]}
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
          control={unregisteredItemForm.control}
          name='satuan_unregistered'
          render={({field}) => (
            <FormItem>
              <FormLabel>Satuan</FormLabel>
              <FormControl>
                <Input placeholder='Satuan' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={unregisteredItemForm.control}
          name='jumlah_unregistered'
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
