import {laporanPermintaanColumns} from '@/lib/columns/laporan-permintaan-column';
import {dataBarangPermintaan} from '@/lib/data/barang';
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
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataTable from '@/components/DataTable';

const laporanSchema = z.object({
  nama: z.string(),
  jenis: z.string(),
  ruangan: z.string(),
});

export default function LaporanStok() {
  const form = useForm<z.infer<typeof laporanSchema>>({
    resolver: zodResolver(laporanSchema),
    defaultValues: {
      nama: '',
      jenis: '',
      ruangan: '',
    },
  });

  function onSubmit(values: z.infer<typeof laporanSchema>) {
    console.log(values);
  }
  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Laporan Pengajuan Barang
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=' flex justify-center space-x-8 items-end w-full mb-4'
        >
          <FormField
            control={form.control}
            name='nama'
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
            name='jenis'
            render={({field}) => (
              <FormItem>
                <FormLabel>Jenis Barang</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih Jenis Barang' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='ATK'>ATK</SelectItem>
                    <SelectItem value='ARK'>ARK</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='ruangan'
            render={({field}) => (
              <FormItem>
                <FormLabel>Ruangan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih Ruangan' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='approved'>Approved</SelectItem>
                    <SelectItem value='rejected'>Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
      <DataTable
        columns={laporanPermintaanColumns}
        data={dataBarangPermintaan}
      />
    </Card>
  );
}
