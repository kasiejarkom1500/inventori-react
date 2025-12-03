import DataTable from "@/components/DataTable";
import { Card } from "@/components/ui/card";
import { summaryPermintaanOperatorColumns } from "@/lib/columns/summary-permintaan-operator-column";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PermintaanForm from "@/components/PermintaanForm";
import { LoadingSpinner } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { fetchPermintaanByUser } from "@/lib/services/permintaanService";
import { useDialog } from "@/context/dialog";
import {getUser} from '@/lib/network/authServices';
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PermintaanBarang() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["data-permintaan-user"],
    queryFn: fetchPermintaanByUser,
  });
  const user = getUser();

  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  const dataSummaryPermintaan = data?.data ?? [];

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    dataSummaryPermintaan.forEach((item: any) => {
      const d = new Date(item.tanggal);
      if (!Number.isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        set.add(key);
      }
    });
    return Array.from(set)
      .sort((a, b) => (a > b ? -1 : 1))
      .map((key) => {
        const [year, month] = key.split("-");
        const label = new Date(
          Number(year),
          Number(month) - 1,
          1
        ).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        });
        return { value: key, label };
      });
  }, [dataSummaryPermintaan]);

  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();

  // Set default bulan ke terbaru saat opsi berubah
  useEffect(() => {
    if (!monthOptions.length) return;
    if (!selectedMonth || !monthOptions.find((m) => m.value === selectedMonth)) {
      setSelectedMonth(monthOptions[0]?.value);
    }
  }, [monthOptions, selectedMonth]);

  const filteredData = useMemo(() => {
    if (!selectedMonth) return dataSummaryPermintaan;
    const [year, month] = selectedMonth.split("-").map((v) => Number(v));
    return dataSummaryPermintaan.filter((item: any) => {
      const d = new Date(item.tanggal);
      return d.getFullYear() === year && d.getMonth() === month - 1;
    });
  }, [dataSummaryPermintaan, selectedMonth]);

  if (isLoading) {
    return <LoadingSpinner size={50} className="mx-auto mt-[25%]" />;
  }
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  console.log(dataSummaryPermintaan);
  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <h1
          className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
        >
          Data Permintaan Barang
        </h1>
        {["user", "admin"].includes(user.role) && <TooltipProvider>
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
                  <Button>
                    <PlusCircle /> Buat Permintaan Barang
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80%] max-w-[90%] overflow-auto">
                  <DialogHeader className="text-xl font-semibold">
                    Permintaan Barang
                  </DialogHeader>
                  <PermintaanForm />
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
            <TooltipContent>Buat Permintaan Barang</TooltipContent>
          </Tooltip>
        </TooltipProvider>}

      </div>
      <DataTable
        columns={summaryPermintaanOperatorColumns}
        data={filteredData}
        search_placeholder="nama ruangan"
        column_name="ruangan"
      />
      <div className="mt-4 flex gap-3 items-center">
        <span className="text-sm text-slate-600">Filter bulan:</span>
        <Select
          value={selectedMonth}
          onValueChange={(val) => setSelectedMonth(val)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih bulan" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
