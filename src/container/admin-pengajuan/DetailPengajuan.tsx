import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";
import { barangPengajuanColumns } from "@/lib/columns/barang-pengajuan-column";
import { fetchDetailPengajuan } from "@/lib/services/pengajuanService";
import { fetchSubkategori } from "@/lib/services/fetch";

export default function DetailPengajuan({
  ruanganID,
  tanggal,
}: {
  ruanganID: string;
  tanggal: string;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ["detail-pengajuan", ruanganID, tanggal],
    queryFn: () => fetchDetailPengajuan(ruanganID, tanggal),
  });

  const { data: subkategoriList = [], isLoading: subkategoriLoading } =
    useQuery({
      queryKey: ["subkategori"],
      queryFn: fetchSubkategori,
      select: (res) => res.data,
    });

  const [newData, setNewData] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item: any) => ({
        id_pengajuan: item.id_pengajuan,
        kategori: item.kategori,
        jumlah: item.jumlah,
        harga_satuan: item.harga_satuan,
        status: item.status,
        kd_subkategori: item.kd_subkategori,
      }));
      // console.log('data:' ,data.data);
      // console.log("formated", formattedData);
      setNewData(formattedData);
    }
  }, [data]);

  if (isLoading)
    return <LoadingSpinner size={50} className="mx-auto mt-[25%]" />;
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (subkategoriLoading)
    return <LoadingSpinner size={40} className="mx-auto mt-10" />;

  const dataPengajuanBarang = data?.data ?? [];
  // console.log(dataPengajuanBarang);

  function handleDataChange(
    id: string,
    newKategori: string | undefined,
    newJumlah: string | undefined,
    newHarga: string | undefined,
    newStatus: string | undefined,
    newKdSubkategori: string | undefined,
    programData?: {
      kd_program?: string;
      kd_kegiatan?: string;
      kd_kro?: string;
      kd_ro?: string;
      kd_komponen?: string;
    }
  ) {
    console.log("program data handledatachange", programData);
    const temp = newData.map((item) =>
      item.id_pengajuan === id
        ? {
            ...item,
            kategori: newKategori !== undefined ? newKategori : item.kategori,
            jumlah: newJumlah !== undefined ? newJumlah : item.jumlah,
            harga_satuan: newHarga != undefined ? newHarga : item.harga_satuan,
            status: newStatus !== undefined ? newStatus : item.status,
            kd_subkategori:
              newKdSubkategori !== undefined
                ? newKdSubkategori
                : item.kd_subkategori,
            ...programData,
          }
        : item
    );
    console.log("temp", temp);
    console.log("programData", programData);
    setNewData((prev) =>
      prev.map((item) =>
        item.id_pengajuan === id
          ? {
              ...item,
              kategori: newKategori !== undefined ? newKategori : item.kategori,
              jumlah: newJumlah !== undefined ? newJumlah : item.jumlah,
              harga_satuan:
                newHarga != undefined ? newHarga : item.harga_satuan,
              status: newStatus !== undefined ? newStatus : item.status,
              kd_subkategori:
                newKdSubkategori !== undefined
                  ? newKdSubkategori
                  : item.kd_subkategori,
              programData,
            }
          : item
      )
    );
  }
  async function submitForm() {
    try {
      console.log("Data post", newData);
      const response = await base.put("/update_status_pengajuan", newData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      toast.toast({
        title: "Berhasil",
        description: response.data.message || "Data berhasil diproses.",
      });
      queryClient.invalidateQueries({ queryKey: ["data-pengajuan"] });
      // console.log('newData', newData);
    } catch (error) {
      console.log("error", error);
      toast.toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal menyimpan data barang",
      });
    }
  }

  return (
    <>
      <DataTable
        columns={barangPengajuanColumns(
          handleDataChange,
          newData,
          subkategoriList
        )}
        data={dataPengajuanBarang} // Use original data here
        search_placeholder="barang"
        column_name="nama_barang"
      />
      <Button className="w-fit px-8 ml-auto" onClick={submitForm}>
        Submit
      </Button>
    </>
  );
}
