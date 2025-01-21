import {laporanPengajuanColumns} from '@/lib/columns/laporan-pengajuan-column';
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
import {format} from 'date-fns';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {CalendarIcon, Printer} from 'lucide-react';
import {Calendar} from '@/components/ui/calendar';
import {Card} from '@/components/ui/card';
import DataTable from '@/components/DataTable';
// import {generateKAK} from '@/lib/services/pengajuanService';
import {base} from '@/lib/network/base';
import {useState} from 'react';
import {generateKAK} from '@/lib/services/pengajuanService';
import {KAKProps, ListBarang} from '@/components/KAK';

const laporanSchema = z.object({
  tgl_mulai: z.date({
    required_error: 'Tanggal Mulai tidak boleh kosong.',
  }),
  tgl_akhir: z.date({
    required_error: 'Tanggal Selesai tidak boleh kosong.',
  }),
});

interface LaporanPengajuanData {
  data: KAKProps;
  status: boolean;
}

export default function LaporanPengajuan() {
  const [dataCetak, setDataCetak] = useState<LaporanPengajuanData | null>(null);
  const [dataTable, setDataTable] = useState<ListBarang[]>([]);

  const form = useForm<z.infer<typeof laporanSchema>>({
    resolver: zodResolver(laporanSchema),
    defaultValues: {
      tgl_mulai: new Date(),
      tgl_akhir: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof laporanSchema>) {
    const formatedValues = {
      tgl_mulai: format(values.tgl_mulai, 'yyyy-MM-dd'),
      tgl_akhir: format(values.tgl_akhir, 'yyyy-MM-dd'),
    };
    const responsePrint = await base.post('/cetak_kak', formatedValues);
    const responseTable = await base.post('/filter_pengajuan', formatedValues)
    setDataTable(responseTable.data.data);
    setDataCetak(responsePrint.data);
  }
  const dataForTable = dataTable ?? [];
  const dataForKAK = dataCetak?.data ?? { total: 0, list_barang: [] };
  console.log('data for table', dataForTable);

  function printKAK() {
    const dataKAK = {dataKAK: dataForKAK } ; // Bungkus data ke dalam objek
    console.log('data for KAK', dataKAK);
    generateKAK(dataKAK);
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
            name='tgl_mulai'
            render={({field}) => (
              <FormItem>
                <FormLabel>Tanggal Mulai</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className='flex justify-start font-normal'
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, 'yyyy-MM-dd')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tgl_akhir'
            render={({field}) => (
              <FormItem>
                <FormLabel>Tanggal Selesai</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className='flex justify-start font-normal'
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, 'yyyy-MM-dd')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2'>
            <Button type='submit'>Submit</Button>
            <Button onClick={printKAK} className='bg-green-500'>
              <Printer />
            </Button>
          </div>
        </form>
      </Form>
      <DataTable columns={laporanPengajuanColumns} data={dataForTable} />
    </Card>
  );
}
