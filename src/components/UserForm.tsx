import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { dataAdmin } from "@/lib/data/admin-dummy";
import { fetchKabupaten } from "@/lib/services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";
// import { useQuery } from "@tanstack/react-query";
// import { fetchPegawai } from "@/lib/network/userService";
// import { LoadingSpinner } from "./ui/loading";

const userSchema = z.object({
  nip_lama: z
    .string()
    .min(1, { message: "NIP Lama tidak boleh kosong." })
    .max(9, { message: "NIP Lama tidak boleh lebih dari 9 karakter." }),
  nama: z
    .string()
    .min(1, { message: "Nama tidak boleh kosong." })
    .max(100, { message: "Nama tidak boleh lebih dari 100 karakter." }),
  id_satker: z
    .string()
    .min(1, { message: "Satker tidak boleh kosong." })
    .max(50, { message: "Satker tidak boleh lebih dari 1500 karakter." }),
  jabatan: z
    .string()
    .min(1, { message: "Jabatan tidak boleh kosong." })
    .max(50, { message: "Jabatan tidak boleh lebih dari 50 karakter." }),
  // ruangan: z
  //   .string()
  //   .min(1, { message: "Ruangan tidak boleh kosong." })
  //   .max(50, { message: "Ruangan tidak boleh lebih dari 50 karakter." }),
  // username: z
  //   .string()
  //   .min(5, { message: "Username harus memiliki minimal 5 karakter." })
  //   .max(20, { message: "Username tidak boleh lebih dari 20 karakter." })
  //   .regex(/^[a-zA-Z0-9._]+$/, {
  //     message:
  //       "Username hanya boleh mengandung huruf, angka, titik, atau underscore.",
  //   }),
  // password: z
  //   .string()
  //   .min(8, { message: "Password harus memiliki minimal 8 karakter." })
  //   .max(50, { message: "Password tidak boleh lebih dari 50 karakter." }),
  // .regex(/[A-Z]/, { message: 'Password harus memiliki setidaknya satu huruf besar.' })
  // .regex(/[a-z]/, { message: 'Password harus memiliki setidaknya satu huruf kecil.' })
  // .regex(/[0-9]/, { message: 'Password harus memiliki setidaknya satu angka.' })
  // .regex(/[@$!%*?&#]/, { message: 'Password harus memiliki setidaknya satu karakter spesial.' }),
});

export default function UserForm({
  id,
  type,
  onSuccess, // ⬅️ tambahkan
}: {
  id?: string;
  type: "edit" | "add";
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama: "",
      jabatan: "",
      id_satker: "",
      // ruangan: "",
      // username: "",
      // password: "",
    },
  });

  const { setValue } = form;
  const toast = useToast();
  const queryClient = useQueryClient();

  // const {
  //     // data: dataAllPegawai,
  //     isLoading,
  //     error
  //   }
  // = useQuery({
  //     queryKey: ['pegawai'],
  //     queryFn: fetchPegawai,
  //   });

  const { data: kabupatenData, isLoading: kabupatenLoading } = useQuery({
    queryKey: ["kabupaten"],
    queryFn: async () => {
      const result = await fetchKabupaten(); // ini tetap pakai fungsi lama
      return result.data; // <-- ambil array dari response di sini saja
    },
  });

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

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      const endpoint = type === "add" ? "/add_user" : `/update_user`;
      const method = type === "add" ? "post" : "put";

      const response = await base[method](endpoint, values);
      toast.toast({
        title: "Berhasil",
        description: response.data.message || "Data berhasil diproses.",
      });

      queryClient.invalidateQueries({ queryKey: ["data-users"] });

      if (onSuccess) onSuccess(); // ⬅️ tutup dialog
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal menyimpan pengguna baru",
      });
      console.error(error);
    }
  }

  // if (isLoading) return <LoadingSpinner className="mx-auto" size={24} />;
  // if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
        <FormField
          control={form.control}
          name="nip_lama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP Lama</FormLabel>
              <FormControl>
                <Input placeholder="NIP Lama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id_satker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kabupaten</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kabupaten" />
                  </SelectTrigger>
                  <SelectContent>
                    {kabupatenLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      kabupatenData?.map((item: any) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.nama_kabupaten}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jabatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <FormControl>
                <Input placeholder="Jabatan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
