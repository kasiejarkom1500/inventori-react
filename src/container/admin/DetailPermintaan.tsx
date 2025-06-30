import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { barangPermintaanColumns } from "@/lib/columns/barang-permintaan-column";
import { useEffect, useState } from "react";
import { fetchDetailPermintaaan } from "@/lib/services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";

export default function DetailPermintaan({
  ruanganID,
  tanggal,
}: {
  ruanganID: string;
  tanggal: string;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ["detail-permintaan", ruanganID, tanggal],
    queryFn: () => fetchDetailPermintaaan(ruanganID, tanggal),
  });

  const [newData, setNewData] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item: any) => ({
        id_permintaan: item.id_permintaan,
        jumlah_approved: item.jumlah_approved,
        status: item.status,
        is_buat_pengajuan: item.is_buat_pengajuan == 0 ? false : true,
      }));
      // console.log('data:' ,data.data);
      // console.log('formated',formattedData);
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
  const dataPermintaanBarang = data?.data ?? [];
  // console.log(dataPermintaanBarang);

  function handleDataChange(
    id_permintaan: number,
    newJumlah: string | undefined,
    newStatus: string | undefined,
    newIsBuatPengajuan: boolean | undefined
  ) {
    setNewData((prev) =>
      prev.map((item) =>
        item.id_permintaan === id_permintaan
          ? {
              ...item,
              jumlah_approved:
                newJumlah !== undefined ? newJumlah : item.jumlah_approved,
              status: newStatus !== undefined ? newStatus : item.status,
              is_buat_pengajuan:
                newIsBuatPengajuan !== undefined
                  ? newIsBuatPengajuan
                  : item.is_buat_pengajuan,
            }
          : item
      )
    );
    console.log("new data disini", newData);
  }
  async function submitForm() {
    try {
      const dataToSubmit = newData.map((item) => ({
        ...item,
        is_buat_pengajuan: item.is_buat_pengajuan ? 1 : 0,
      }));

      const response = await base.put("/update_status", dataToSubmit, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("response", response);
      if (response.data.status == "Gagal") {
        toast.toast({
          variant: "destructive",
          title: "Gagal",
          description: response.data.message || "Data berhasil diproses.",
        });
      } else {
        toast.toast({
          title: "Berhasil",
          description: response.data.message || "Data berhasil diproses.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["data-permintaan"] });
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
        columns={barangPermintaanColumns(handleDataChange, newData)}
        data={dataPermintaanBarang} // Use original data here
        search_placeholder="barang"
        column_name="nama_barang"
      />
      <Button className="w-fit px-8 ml-auto" onClick={submitForm}>
        Submit
      </Button>
    </>
  );
}
