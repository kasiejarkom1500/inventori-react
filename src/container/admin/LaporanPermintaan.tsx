import {laporanPermintaanColumns} from '@/lib/columns/laporan-permintaan-column';
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
import { useState } from 'react';
import { generateKarken } from '@/lib/services/pengajuanService';
import { KarkenProps} from '@/components/Karken';
import { base } from '@/lib/network/base';
import { BarangKarken } from '@/lib/types/barang';

const laporanSchema = z.object({
  tgl_mulai: z.date({
    required_error: 'Tanggal Mulai tidak boleh kosong.',
  }),
  tgl_selesai: z.date({
    required_error: 'Tanggal Selesai tidak boleh kosong.',
  }),
});

interface KartuKendaliData {
  download_url: KarkenProps[];
  message: string;
  status: boolean;
}


export default function LaporanPermintaan() {
  const form = useForm<z.infer<typeof laporanSchema>>({
    resolver: zodResolver(laporanSchema),
    defaultValues: {
      tgl_mulai: new Date(),
      tgl_selesai: new Date(),
    },
  });

  const [dataCetak, setDataCetak] = useState<KartuKendaliData['download_url'] | null>(null);
  const [dataTable, setDataTable] = useState<BarangKarken[]>([]);

  const dataForKarken = dataCetak ?? [{
    id_barang: 0,
    nama_barang: '',
    kd_barang:'',
    satuan: '',
    kategori:'ATK',
    rows: [],
  }];

  function printKarken() {
    const dataKarken = {dataKarken: dataForKarken } ; // Bungkus data ke dalam objek
    // console.log('data for KAK', dataKarken);
    generateKarken(dataKarken);
  }

  function printKarkenSatuan(id_barang : number) {
    // const dataKarken = {dataKarken: dataForKarken } ; // Bungkus data ke dalam objek
    // console.log('barang',id_barang)
    

    const filteredData = dataForKarken.filter(item => item.id_barang === id_barang);
    console.log('satuan',filteredData);
    const dataKarken = { dataKarken: filteredData };

    // console.log('satuan',dataKarken)
    generateKarken(dataKarken);
  }
  
  


  async function onSubmit(values: z.infer<typeof laporanSchema>) {
    // console.log(responsePrint);

    const formatedValues = {
      tgl_mulai: format(values.tgl_mulai, 'yyyy-MM-dd'),
      tgl_selesai: format(values.tgl_selesai, 'yyyy-MM-dd'),
    };
    const responsePrint = await base.post('/generate',formatedValues);
    const responseTable = await base.post('/summary_karken',formatedValues);
    // setDataTable(responseTable.data.data);

    setDataCetak(responsePrint.data.download_url);
    setDataTable(responseTable.data.data);
    // console.log('cek',dataTable);
    // console.log('karken',responsePrint.data.download_url);
    
  }

  const dataForTable = dataTable ?? [];

  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Kartu Kendali
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
                          format(field.value, 'PPP')
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
            name='tgl_selesai'
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
                          format(field.value, 'PPP')
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
            <Button onClick={printKarken} className='bg-green-500'> <Printer /> </Button>
          </div>
        </form>
      </Form>
      <DataTable
        columns={laporanPermintaanColumns(printKarkenSatuan)}
        data={dataForTable}
      />
    </Card>
  );
}

