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
import {useEffect, useState} from 'react';
import {generateBASO} from '@/lib/services/pengajuanService';
import { Barang, BarangBASO } from '@/lib/types/barang';
import { BASOProps } from '@/components/BASO';
import { fetchAllBASO } from '@/lib/services/fetch';
import { barangBASOColumns } from '@/lib/columns/barang-baso-column';

const laporanSchema = z.object({
  tgl_cetak: z.date({
    required_error: 'Tanggal Mulai tidak boleh kosong.',
  }),
});



export default function LaporanStok() {
  const [dataTable, setDataTable] = useState<BASOProps>({ rows: [] });

  // const form = useForm<z.infer<typeof laporanSchema>>({
  //   resolver: zodResolver(laporanSchema),
  //   defaultValues: {
  //     tgl_cetak: new Date()
  //   },
  // });

  // async function onSubmit() {
  //   const responseTable = await fetchAllBASO();
  //   console.log('responseTable', responseTable);
  //   //filter data where stok is not 0
  //   const filteredData = responseTable.data.filter((item: BarangBASO) => item.stok != 0);
  //   console.log('filteredData', filteredData);
  //   //map data to BASOProps
  //   const dataForTable: BASOProps = {
  //     rows: filteredData.map((item: BarangBASO) => ({
  //       nama_barang: item.nama_barang,
  //       satuan: item.satuan,
  //       total_persediaan: item.stok,
  //       harga_satuan: item.harga_satuan,
  //       total_harga: item.total_harga
  //     })),
  //   };
  //   setDataTable(dataForTable);
  // }
  // console.log('data for table', dataForTable);

  useEffect(() => {
  async function fetchDataAndSetTable() {
    const responseTable = await fetchAllBASO();
    // console.log('responseTable', responseTable);

    const filteredData = responseTable.data.filter((item: BarangBASO) => item.stok !== 0);
    // console.log('filteredData', filteredData);

    const dataForTable: BASOProps = {
      rows: filteredData.map((item: BarangBASO) => ({
        nama_barang: item.nama_barang,
        satuan: item.satuan,
        total_persediaan: item.stok,
        harga_satuan: item.harga_satuan,
        total_harga: item.total_harga,
      })),
    };

    setDataTable(dataForTable);
  }

  fetchDataAndSetTable(); // jalankan saat komponen muncul
}, []);

  function printBASO() {
    // console.log(dataTable);
    generateBASO(dataTable);
  }

  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Daftar Stok Barang
      </h1>
      {/* <Form {...form}>
        <form
          className=' flex justify-center space-x-8 items-end w-full mb-4'
        > */}
          {/* <FormField
            control={form.control}
            name='tgl_cetak'
            render={({field}) => (
              <FormItem>
                <FormLabel>Tanggal Cetak</FormLabel>
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
          /> */}
          <div className='flex gap-2'>
            {/* <Button type='submit'>Submit</Button> */}
            <Button onClick={printBASO} className='bg-green-500'>
              <Printer />
            </Button>
          </div>
        {/* </form> */}
      {/* </Form> */}
      <DataTable columns={barangBASOColumns} data={dataTable.rows} column_name='nama_barang'/>
    </Card>
  );
}
