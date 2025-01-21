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
import {useEffect} from 'react';
import {base} from '@/lib/network/base';
import {useToast} from '@/hooks/use-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {LoadingSpinner} from './ui/loading';

async function fetchBarangbyID(id: string) {
  const response = await base.get(`/get_barang_id/${id}`);
  return response.data;
}

const barangSchema = z.object({
  kd_barang: z.string().nonempty({message: 'Kode barang tidak boleh kosong.'}),
  nama_barang: z
    .string()
    .min(1, {message: 'Nama barang tidak boleh kosong.'})
    .max(100, {message: 'Nama barang tidak boleh lebih dari 100 karakter.'}),
  kategori: z
    .string()
    .nonempty({message: 'Kategori barang tidak boleh kosong.'}),
  satuan: z.string().nonempty({message: 'Satuan barang tidak boleh kosong.'}),
  stok: z
    .number()
    .int({message: 'Stok barang harus berupa bilangan bulat.'})
    .nonnegative({message: 'Stok barang tidak boleh kurang dari 0.'}),
  stok_dasar: z
    .number()
    .int({message: 'Stok barang harus berupa bilangan bulat.'})
    .nonnegative({message: 'Stok barang tidak boleh kurang dari 0.'}),
  harga_satuan: z
    .number()
    .positive({message: 'Harga barang harus lebih dari 0.'}),
});

export default function BarangForm({
  id,
  type,
}: {
  id?: string;
  type: 'edit' | 'add';
}) {
  const {data, isLoading, error} = useQuery({
    queryKey: ['barang-by-id', id],
    queryFn: () =>
      id ? fetchBarangbyID(id) : Promise.reject('ID is undefined'),
    enabled: Boolean(id),
  });
  const form = useForm<z.infer<typeof barangSchema>>({
    resolver: zodResolver(barangSchema),
    defaultValues: {
      kd_barang: '',
      nama_barang: '',
      satuan: '',
      kategori: '',
      stok: 0,
      stok_dasar: 0,
      harga_satuan: 0,
    },
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  const {setValue} = form;

  useEffect(() => {
    if (data?.data) {
      Object.entries(data.data).forEach(([key, value]) => {
        const convertedValue =
          ['stok', 'stok_dasar', 'harga_satuan'].includes(key) &&
          typeof value === 'string'
            ? Number(value)
            : value;
        setValue(
          key as keyof z.infer<typeof barangSchema>,
          convertedValue as string | number
        );
      });
    }
  }, [data, setValue]);

  if (isLoading) return <LoadingSpinner className='mx-auto' size={24} />;
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  async function onSubmit(values: z.infer<typeof barangSchema>) {
    try {
      const endpoint = type === 'add' ? '/insert_barang' : `/ubah_barang/${id}`;
      const method = type === 'add' ? 'post' : 'put';
      console.log(endpoint, method);
      console.log(values);
      const response = await base[method](endpoint, values);
      toast.toast({
        title: 'Berhasil',
        description: response.data.message || 'Data berhasil diproses.',
      });

      queryClient.invalidateQueries({queryKey: ['data-barang']});
    } catch (error) {
      toast.toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Gagal menyimpan data barang',
      });
      console.error(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8'>
        <FormField
          control={form.control}
          name='kd_barang'
          render={({field}) => (
            <FormItem>
              <FormLabel>Kode Barang</FormLabel>
              <FormControl>
                <Input placeholder='Kode Barang' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nama_barang'
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
          control={form.control}
          name='kategori'
          render={({field}) => (
            <FormItem>
              <FormLabel>Kategori Barang</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Kategori Barang' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ATK'>ATK</SelectItem>
                    <SelectItem value='ARK'>ARK</SelectItem>
                  </SelectContent>
                </Select>
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
                <Input placeholder='Satuan' {...field} />
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
                  placeholder='Stok'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='stok_dasar'
          render={({field}) => (
            <FormItem>
              <FormLabel>Stok Dasar</FormLabel>
              <FormControl>
                <Input
                  placeholder='Stok Dasar'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='harga_satuan'
          render={({field}) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input
                  placeholder='Harga'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
