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
import { useEffect } from 'react';
import { dataRuangan } from '@/lib/data/ruangan-dummy';

const ruanganSchema = z.object({
  nama: z
    .string()
    .min(1, {message: 'Nama ruangan tidak boleh kosong.'})
    .max(100, {message: 'Nama ruangan tidak boleh lebih dari 100 karakter.'}),
  pj: z
    .string()
    .min(1, {message: 'Penanggung jawab tidak boleh kosong.'})
    .max(100, {
      message: 'Nama penanggung jawab tidak boleh lebih dari 100 karakter.',
    }),
  jabatan: z
    .string()
    .min(1, {message: 'Jabatan tidak boleh kosong.'})
    .max(50, {message: 'Jabatan tidak boleh lebih dari 50 karakter.'}),
});

export default function RuanganForm({id, type}: {id?: string; type: 'edit' | 'add'}) {
  const form = useForm<z.infer<typeof ruanganSchema>>({
    resolver: zodResolver(ruanganSchema),
    defaultValues: {
      nama: '',
      pj: '',
      jabatan: '',
    },
  });

  const {setValue} = form;

  useEffect(() => {
    if (id) {
      const detailRuangan = dataRuangan.find((admin) => admin.id === id);
      if (detailRuangan) {
        Object.entries(detailRuangan).forEach(([key, value]) => {
          setValue(key as keyof z.infer<typeof ruanganSchema>, value);
        });
      }
    }
  }, [id, setValue]);
  function onSubmit(values: z.infer<typeof ruanganSchema>) {
    if (type === 'add') {
      console.log('add', values);
    }
    if (type === 'edit') {
      console.log('edit', values);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8'>
        <FormField
          control={form.control}
          name='nama'
          render={({field}) => (
            <FormItem>
              <FormLabel>Nama Ruangan</FormLabel>
              <FormControl>
                <Input placeholder='Nama Ruangan' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='pj'
          render={({field}) => (
            <FormItem>
              <FormLabel>Penanggung Jawab</FormLabel>
              <FormControl>
                <Input placeholder='Penanggung Jawab' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='jabatan'
          render={({field}) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <FormControl>
                <Input placeholder='Jabatan' {...field} />
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
