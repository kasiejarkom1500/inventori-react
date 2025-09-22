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

export default function InputBarangMasuk() {
  const { data, isLoading } = useQuery({
    queryKey: ["data-pembelian"],
    queryFn: fetchPembelian,
  });

  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  const toast = useToast();
  const queryClient = useQueryClient();

  if (isLoading) {
    return <LoadingSpinner size={50} className="mx-auto mt-[25%]" />;
  }

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
  console.log(dataSummaryPembelian);

  return (
    <Card className="p-6">
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Barang Masuk
      </h1>
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
        data={dataSummaryPembelian}
        column_name="no_kuitansi"
      />
    </Card>
  );
}
