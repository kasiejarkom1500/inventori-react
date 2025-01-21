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
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover';
import {CalendarIcon} from 'lucide-react';
import {Calendar} from './ui/calendar';
import {format} from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const permintaanSchema = z.object({
  tanggal: z.date({
    required_error: 'Jadwal tidak boleh kosong.',
  }),
  kode: z.string().min(1, {message: 'Kode Barang is required'}),
  nama: z.string().min(1, {message: 'Nama Barang is required'}),
  satuan: z.string().min(1, {message: 'Satuan is required'}),
  jumlah: z.number().min(1, {message: 'Jumlah must be at least 1'}),
  ruangan: z.string().min(1, {message: 'Ruangan is required'}),
  status: z.enum(['pending', 'approved', 'rejected'], {
    errorMap: () => ({
      message: "Status must be 'pending', 'approved', or 'rejected'",
    }),
  }),
});

export default function PermintaanEdit() {
  const form = useForm<z.infer<typeof permintaanSchema>>({
    resolver: zodResolver(permintaanSchema),
    defaultValues: {
      tanggal: new Date(),
      kode: 'LPTP-001',
      nama: 'Laptop',
      satuan: 'pcs',
      jumlah: 1,
      ruangan: 'IPDS',
      status: 'pending',
    },
  });

  function onSubmit(values: z.infer<typeof permintaanSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8'>
        <FormField
          control={form.control}
          name='tanggal'
          render={({field}) => (
            <FormItem>
              <FormLabel>Tanggal Permintaan</FormLabel>
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
          name='kode'
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
          name='jumlah'
          render={({field}) => (
            <FormItem>
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <Input placeholder='Jumlah' type='number' {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder='Ruangan' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({field}) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih Status' />
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
  );
}
