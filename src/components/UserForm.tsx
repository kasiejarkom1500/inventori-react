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
import { dataAdmin } from '@/lib/data/admin-dummy';

const userSchema = z.object({
  nama: z
    .string()
    .min(1, {message: 'Nama tidak boleh kosong.'})
    .max(100, {message: 'Nama tidak boleh lebih dari 100 karakter.'}),
  jabatan: z
    .string()
    .min(1, {message: 'Jabatan tidak boleh kosong.'})
    .max(50, {message: 'Jabatan tidak boleh lebih dari 50 karakter.'}),
  ruangan: z
    .string()
    .min(1, {message: 'Ruangan tidak boleh kosong.'})
    .max(50, {message: 'Ruangan tidak boleh lebih dari 50 karakter.'}),
  username: z
    .string()
    .min(5, {message: 'Username harus memiliki minimal 5 karakter.'})
    .max(20, {message: 'Username tidak boleh lebih dari 20 karakter.'})
    .regex(/^[a-zA-Z0-9._]+$/, {
      message:
        'Username hanya boleh mengandung huruf, angka, titik, atau underscore.',
    }),
  password: z
    .string()
    .min(8, {message: 'Password harus memiliki minimal 8 karakter.'})
    .max(50, {message: 'Password tidak boleh lebih dari 50 karakter.'}),
  // .regex(/[A-Z]/, { message: 'Password harus memiliki setidaknya satu huruf besar.' })
  // .regex(/[a-z]/, { message: 'Password harus memiliki setidaknya satu huruf kecil.' })
  // .regex(/[0-9]/, { message: 'Password harus memiliki setidaknya satu angka.' })
  // .regex(/[@$!%*?&#]/, { message: 'Password harus memiliki setidaknya satu karakter spesial.' }),
});

export default function UserForm({id, type}: {id?: string; type: 'edit' | 'add'}) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama: '',
      jabatan: '',
      ruangan: '',
      username: '',
      password: '',
    },
  });

  const {setValue} = form;

  useEffect(() => {
      if (id) {
        const detailAdmin = dataAdmin.find((admin) => admin.id === id);
        if (detailAdmin) {
          Object.entries(detailAdmin).forEach(([key, value]) => {
            setValue(key as keyof z.infer<typeof userSchema>, value);
          });
        }
      }
    }, [id, setValue]);

  function onSubmit(values: z.infer<typeof userSchema>) {
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
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder='Nama' {...field} />
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
          name='username'
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='Password' {...field} />
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
