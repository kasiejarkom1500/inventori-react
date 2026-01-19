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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "./ui/loading";
import { fetchKabupaten, fetchSubkategori } from "@/lib/services/fetch";

async function fetchBarangbyID(id: string) {
  const response = await base.get(`/get_barang_id/${id}`);
  return response.data;
}

const barangSchema = z.object({
  kd_subkategori: z
    .string()
    .nonempty({ message: "Sub Kategori barang tidak boleh kosong." }),
  kd_barang: z.string().optional(),
  kabupaten_id: z
    .string()
    .nonempty({ message: "Kabupaten tidak boleh kosong." }),
  nama_barang: z
    .string()
    .min(1, { message: "Nama barang tidak boleh kosong." })
    .max(100, { message: "Nama barang tidak boleh lebih dari 100 karakter." }),
  kategori: z
    .string()
    .nonempty({ message: "Kategori barang tidak boleh kosong." }),
  satuan: z.string().nonempty({ message: "Satuan barang tidak boleh kosong." }),
  stok: z
    .number()
    .int({ message: "Stok barang harus berupa bilangan bulat." })
    .nonnegative({ message: "Stok barang tidak boleh kurang dari 0." }),
  stok_dasar: z
    .number()
    .int({ message: "Stok barang harus berupa bilangan bulat." })
    .nonnegative({ message: "Stok barang tidak boleh kurang dari 0." }),
  harga_satuan: z
    .number()
    .positive({ message: "Harga barang harus lebih dari 0." }),
});

export default function BarangForm({
  id,
  type,
}: {
  id?: string;
  type: "edit" | "add";
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["barang-by-id", id],
    queryFn: () =>
      id ? fetchBarangbyID(id) : Promise.reject("ID is undefined"),
    enabled: Boolean(id),
  });

  const { data: subkategoriData, isLoading: subkategoriLoading } = useQuery({
    queryKey: ["subkategori"],
    queryFn: async () => {
      const result = await fetchSubkategori(); // ini tetap pakai fungsi lama
      return result.data; // <-- ambil array dari response di sini saja
    },
  });

  const { data: kabupatenData, isLoading: kabupatenLoading } = useQuery({
    queryKey: ["kabupaten"],
    queryFn: async () => {
      const result = await fetchKabupaten(); // ini tetap pakai fungsi lama
      return result.data; // <-- ambil array dari response di sini saja
    },
  });

  const form = useForm<z.infer<typeof barangSchema>>({
    resolver: zodResolver(barangSchema),
    defaultValues: {
      kd_subkategori: "",
      kabupaten_id: "",
      kd_barang: "",
      nama_barang: "",
      satuan: "",
      kategori: "",
      stok: 0,
      stok_dasar: 0,
      harga_satuan: 0,
    },
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  const { setValue } = form;

  useEffect(() => {
    if (data?.data) {
      Object.entries(data.data).forEach(([key, value]) => {
        const convertedValue =
          ["stok", "stok_dasar", "harga_satuan"].includes(key) &&
          typeof value === "string"
            ? Number(value)
            : value;
        setValue(
          key as keyof z.infer<typeof barangSchema>,
          convertedValue as string | number
        );
      });
    }
  }, [data, setValue]);

  if (isLoading) return <LoadingSpinner className="mx-auto" size={24} />;
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  async function onSubmit(values: z.infer<typeof barangSchema>) {
    try {
      const endpoint = type === "add" ? "/insert_barang" : `/ubah_barang/${id}`;
      const method = type === "add" ? "post" : "put";
      console.log(endpoint, method);
      console.log(values);
      const response = await base[method](endpoint, values);
      toast.toast({
        title: "Berhasil",
        description: response.data.message || "Data berhasil diproses.",
      });

      queryClient.invalidateQueries({ queryKey: ["data-barang"] });
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal menyimpan data barang",
      });
      console.error(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
        <FormField
          control={form.control}
          name="kd_subkategori"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Barang</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Sub Kategori Barang" />
                  </SelectTrigger>
                  <SelectContent>
                    {subkategoriLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      subkategoriData?.map((item: any) => (
                        <SelectItem key={item.id} value={item.kd_subkategori}>
                          {item.sub_kategori}
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
        {type === "edit" && (
          <FormField
            control={form.control}
            name="kd_barang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Barang (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Kode Barang" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {type === "add" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground cursor-help">
                  Kode barang akan dibuat otomatis berdasarkan sub kategori.
                </p>
              </TooltipTrigger>
              <TooltipContent>
                Kode akan di-generate saat simpan, jadi tidak perlu diisi di sini.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <FormField
          control={form.control}
          name="kabupaten_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Barang</FormLabel>
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
          name="nama_barang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder="Nama Barang" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kategori"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Barang</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori Barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATK">ATK</SelectItem>
                    <SelectItem value="ARK">ARK</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="satuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satuan</FormLabel>
              <FormControl>
                <Input placeholder="Satuan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stok</FormLabel>
              <FormControl>
                <Input
                  placeholder="Stok"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stok_dasar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stok Dasar</FormLabel>
              <FormControl>
                <Input
                  placeholder="Stok Dasar"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="harga_satuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input
                  placeholder="Harga"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
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
