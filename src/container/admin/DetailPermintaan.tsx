import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { barangPermintaanColumns } from "@/lib/columns/barang-permintaan-column";
import { useEffect, useState } from "react";
import {
  fetchAllBarang,
  fetchDetailPermintaaan,
  fetchSubkategori,
} from "@/lib/services/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";

type EditedPermintaan = {
  id_permintaan: number;
  id_barang: string;
  kd_barang?: string;
  nama_barang?: string;
  kategori?: string;
  satuan?: string;
  stok?: number | string;
  jumlah_approved: string | number;
  status: string;
  is_buat_pengajuan: boolean;
  kd_subkategori?: string;
};

export default function DetailPermintaan({
  ruanganID,
  tanggal,
  id_transaksi,
}: {
  ruanganID: string;
  tanggal: string;
  id_transaksi: string;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ["detail-permintaan", ruanganID, tanggal, id_transaksi],
    queryFn: () => fetchDetailPermintaaan(ruanganID, tanggal, id_transaksi),
  });

  const { data: subkategoriList = [], isLoading: subkategoriLoading } =
    useQuery({
      queryKey: ["subkategori"],
      queryFn: fetchSubkategori,
      select: (res) => res.data,
    });

  const { data: barangAll, isLoading: barangLoading } = useQuery({
    queryKey: ["barang-all"],
    queryFn: fetchAllBarang,
  });

  const [newData, setNewData] = useState<EditedPermintaan[]>([]);

  useEffect(() => {
    if (data?.data) {
      const formattedData = data.data.map((item: any) => ({
        id_permintaan: item.id_permintaan,
        id_barang: String(item.id_barang),
        kd_barang: item.kd_barang,
        nama_barang: item.nama_barang,
        kategori: item.kategori,
        satuan: item.satuan,
        stok: item.stok,
        jumlah_approved: item.jumlah_approved,
        status: item.status,
        is_buat_pengajuan: item.is_buat_pengajuan == 0 ? false : true,
        kd_subkategori: item.kd_subkategori,
      }));

      setNewData(formattedData);
    }
  }, [data]);

  if (isLoading || barangLoading)
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

  if (subkategoriLoading)
    return <LoadingSpinner size={40} className="mx-auto mt-10" />;

  function handleDataChange(
    id_permintaan: number,
    changes: Partial<EditedPermintaan>
  ) {
    setNewData((prev) =>
      prev.map((item) =>
        item.id_permintaan === id_permintaan
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );
  }
  async function submitForm() {
    try {
      const dataPermintaanBarang = data?.data ?? [];

      const dataToSubmit = dataPermintaanBarang.map((row: any) => {
        const edited = newData.find(
          (item) => item.id_permintaan === row.id_permintaan
        );

        const idBarangFinal = edited?.id_barang ?? row.id_barang;

        return {
          id_permintaan: row.id_permintaan,
          id_barang: Number(idBarangFinal),
          kd_subkategori: edited?.kd_subkategori ?? row.kd_subkategori,
          jumlah_approved: edited?.jumlah_approved ?? row.jumlah_approved,
          status: edited?.status ?? row.status,
          is_buat_pengajuan: edited
            ? edited.is_buat_pengajuan
              ? 1
              : 0
            : row.is_buat_pengajuan,
        };
      });

      const response = await base.put("/update_status_admin", dataToSubmit, {
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
      <div className="max-h-[70vh] overflow-auto">
        <div className="overflow-x-auto">
          <DataTable
            columns={barangPermintaanColumns(
              handleDataChange,
              newData,
              subkategoriList,
              barangAll?.data ?? []
            )}
            data={dataPermintaanBarang} // Use original data here
            search_placeholder="barang"
            column_name="nama_barang"
            hiddenColumns={["tanggal", "kd_barang", "kategori", "sub_kategori"]}
          />
        </div>
      </div>
      <Button className="w-fit px-8 ml-auto" onClick={submitForm}>
        Submit
      </Button>
    </>
  );
}
