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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchDetailPermintaaan } from "@/lib/services/fetch";
import { LoadingSpinner } from "./ui/loading";
import { generateBlanko } from "@/lib/services/blankoServices";

const blankoSchema = z.object({
  tanggal: z.date(),
});

export default function BlankoForm({
  ruanganID,
  tanggal,
  ruangan,
  id_transaksi,
  noSurat,
}: {
  ruanganID: string;
  tanggal: string;
  ruangan: string;
  id_transaksi: string;
  noSurat: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["detail-permintaan", ruanganID, tanggal, id_transaksi],
    queryFn: () => fetchDetailPermintaaan(ruanganID, tanggal,id_transaksi),
  });
  const form = useForm<z.infer<typeof blankoSchema>>({
    resolver: zodResolver(blankoSchema),
    defaultValues: {
      tanggal: new Date(), // Tanggal sekarang sebagai default value
    },
  });

  if (isLoading) return <LoadingSpinner className="mx-auto" size={24} />;
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
  const dataDetailPermintaan = data?.data ?? [];
  const signerGudang = data?.signerGudang ?? { jabatan: "", nama: "", nip_baru: "" };
  const signerApprover = data?.signerApprover ?? { jabatan: "", nama: "", nip_baru: "" };
  function onSubmit(values: z.infer<typeof blankoSchema>) {
    const formattedData = {
      ...values,
      tanggal: format(values.tanggal, "dd MMMM yyyy", { locale: id }),
      ruangan: ruangan,
      noSurat: noSurat,
    };
    const filteredDetail = dataDetailPermintaan.filter(
      (item: { status: string, jumlah_approved: number }) => item.status === "Approved" && item.jumlah_approved > 0
    );
    // console.log('Formatted Data:', formattedData);
    // console.log('Detail Permintaan:', filteredDetail);
    generateBlanko({ letterData: filteredDetail, letterDesc: formattedData, signerGudang, signerApprover });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="tanggal"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d MMMM yyyy", { locale: id })
                      ) : (
                        <span>Pilih Tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Cetak</Button>
      </form>
    </Form>
  );
}
