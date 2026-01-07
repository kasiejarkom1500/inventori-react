import DataTable from "@/components/DataTable";
import PembelianForm from "@/components/PembelianForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDialog } from "@/context/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { summaryInputKuitansiColumns } from "@/lib/columns/summary-input-kuitansi-column";
import { fetchPembelian } from "@/lib/services/pembelianService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Upload } from "lucide-react";
import { base } from "@/lib/network/base";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo, useState } from "react";

export default function InputBarangMasuk() {
  const { data, isLoading } = useQuery({
    queryKey: ["data-pembelian"],
    queryFn: fetchPembelian,
  });

  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  const toast = useToast();
  const queryClient = useQueryClient();

  const handleImportExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Tambahkan file ke FormData

    try {
      const response = await base.post("/import_excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set header untuk file upload
        },
      });
      console.log("File imported successfully:", response.data);

      toast.toast({
        title: "Berhasil",
        description: response.data.message,
      });
      // Optional: Refetch data setelah import berhasil
      queryClient.invalidateQueries({ queryKey: "data-pembelian" });
    } catch (error) {
      console.error("Error importing file:", error);
      toast.toast({
        variant: "destructive",
        title: "Gagal Import Data",
        description: "Tidak berhasil mengimport data",
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

  const dataSummaryPembelian = data?.data ?? [];

  // Filter bulan (default bulan terbaru)
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    dataSummaryPembelian.forEach((item: { tgl_masuk?: string }) => {
      if (!item?.tgl_masuk) return;
      const d = new Date(item.tgl_masuk);
      if (Number.isNaN(d.getTime())) return;
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    const arr = Array.from(months).sort();
    return arr.map((m) => ({
      value: m,
      label: new Date(`${m}-01`).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      }),
    }));
  }, [dataSummaryPembelian]);

  useEffect(() => {
    if (!selectedMonth && monthOptions.length > 0) {
      setSelectedMonth(monthOptions[monthOptions.length - 1].value);
    }
  }, [monthOptions, selectedMonth]);

  const filteredData = useMemo(() => {
    if (!selectedMonth) return dataSummaryPembelian;
    return dataSummaryPembelian.filter((item: { tgl_masuk?: string }) => {
      if (!item?.tgl_masuk) return false;
      const d = new Date(item.tgl_masuk);
      if (Number.isNaN(d.getTime())) return false;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return key === selectedMonth;
    });
  }, [dataSummaryPembelian, selectedMonth]);

  if (isLoading) {
    return <LoadingSpinner size={50} className="mx-auto mt-[25%]" />;
  }

  return (
    <Card className="p-6">
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Barang Masuk
      </h1>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Filter Bulan</label>
        <select
          className="border rounded-md px-3 py-1 text-sm"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="mr-auto lg:mr-0">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (open) openDialog();
                else closeDialog();
              }}
            >
              <DialogTrigger>
                <Button onClick={openDialog}>
                  <PlusCircle /> Tambahkan Barang Masuk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80%] max-w-[90%] overflow-auto">
                <DialogHeader className="text-xl font-semibold">
                  Barang Masuk
                </DialogHeader>
                <PembelianForm />
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>Input Barang Masuk</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant={"green"}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <Upload /> Import
            </Button>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </TooltipTrigger>
          <TooltipContent>Import Excel</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DataTable
        columns={summaryInputKuitansiColumns}
        data={filteredData}
        column_name="no_kuitansi"
      />
    </Card>
  );
}
