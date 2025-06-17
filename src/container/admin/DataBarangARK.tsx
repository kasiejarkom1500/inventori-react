import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Download, PlusCircle, SlidersHorizontal, Upload} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {barangARKColumns} from '@/lib/columns/barang-ark-column';
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
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchBarangARK} from '@/lib/network/barangServices';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { base } from '@/lib/network/base';

const filterSchema = z.object({
  harga_pengajuan: z.number().optional(),
});


export default function DataBarangARK() {
  const {handleExcel} = useExcel();
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      harga_pengajuan: undefined,
    },
  });

  const {data, isLoading, error} = useQuery({
    queryKey: ['data-barang-ark'],
    queryFn: fetchBarangARK,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [file, setFile] = useState<File | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  console.log(data);
  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  const dataBarang = data?.data ?? [];

  function onSubmit(values: z.infer<typeof filterSchema>) {
    console.log(values);
  }

  // Fungsi untuk mengirim file Excel ke API
  const handleImportExcel = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // Tambahkan file ke FormData

    try {
      const response = await base.post('/import_excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set header untuk file upload
        },
      });
      console.log('File imported successfully:', response.data);

      toast.toast({
        title: 'Berhasil',
        description: response.data.message,
      });
      // Optional: Refetch data setelah import berhasil
      queryClient.invalidateQueries({queryKey: 'data-barang-atk'});
    } catch (error) {
      console.error('Error importing file:', error);
      toast.toast({
        variant: 'destructive',
        title: 'Gagal Import Data',
        description: 'Tidak berhasil mengimport data',
      });
    }
  };

  // Fungsi untuk menangani perubahan file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // setFile(selectedFile);
      handleImportExcel(selectedFile); // Langsung kirim file ke API
    }
  };


  return (
    <>
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <h1 className='mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md'>
            Data Barang ARK (521811)
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
                  <Button variant={'green'} onClick={() => document.getElementById('fileInput')?.click()}>
                    <Upload /> Import
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    accept='.xlsx, .xls'
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </TooltipTrigger>
                <TooltipContent>Import Excel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => handleExcel(dataBarang, 'data_barang_ark')}
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
                        Tambah Barang ARK
                      </DialogTitle>
                      <BarangForm type='add' />
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent>Tambah Barang ARK</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <DataTable
          data={dataBarang}
          columns={barangARKColumns}
          column_name='nama_barang'
          search_placeholder='nama barang'
        />
      </Card>
    </>
  );
}
