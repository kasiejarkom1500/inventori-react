import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Download, PlusCircle, SlidersHorizontal, Upload} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

import {barangATKColumns} from '@/lib/columns/barang-atk-column';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BarangForm from '@/components/BarangForm';
import useExcel from '@/hooks/use-excel';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import DataTable from '@/components/DataTable';
import {useQuery} from '@tanstack/react-query';
import {fetchBarangATK} from '@/lib/network/barangServices';
import { LoadingSpinner } from '@/components/ui/loading';

const filterSchema = z.object({
  harga_pengajuan: z.number().optional(),
});

export default function DataBarangATK() {
  const {handleExcel} = useExcel();
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      harga_pengajuan: undefined,
    },
  });

  const {data, isLoading, error} = useQuery({
    queryKey: ['data-barang-atk'],
    queryFn: fetchBarangATK,
  });
  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  const dataBarang = data?.data ?? [];
  // console.log(dataBarang);

  function onSubmit(values: z.infer<typeof filterSchema>) {
    console.log(values);
  }

  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1 className='mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md'>
            Data Barang ATK (521811)
          </h1>
          <div className='flex items-center flex-col lg:flex-row gap-2'>
            <Popover>
              <PopoverTrigger>
                <span className='flex items-center gap-2'>
                  <SlidersHorizontal size={18} /> Filter
                </span>
              </PopoverTrigger>
              <PopoverContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                  >
                    <FormField
                      control={form.control}
                      name='harga_pengajuan'
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>Harga Pengajuan</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Harga Pengajuan...'
                              type='number'
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type='submit'>Submit</Button>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={'green'}>
                    <Upload /> Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import Excel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => handleExcel(dataBarang, 'data_barang_atk')}
                    variant={'blue'}
                  >
                    <Download /> Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Format Excel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog>
                    <DialogTrigger>
                      <Button>
                        <PlusCircle /> Tambah Barang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-h-[80%] overflow-auto'>
                      <DialogTitle className='text-xl font-semibold'>
                        Tambah Barang ATK
                      </DialogTitle>
                      <BarangForm type='add' />
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Tambah Barang ATK</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <DataTable
          data={dataBarang}
          columns={barangATKColumns}
          column_name='nama_barang'
          search_placeholder='nama barang'
        />
      </Card>
    </>
  );
}
