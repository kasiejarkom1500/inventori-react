import DataTable from '@/components/DataTable';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {LoadingSpinner} from '@/components/ui/loading';
import {barangMasukColumns} from '@/lib/columns/barang-masuk-column';
import {fetchBarangMasuk} from '@/lib/services/fetch';
import {useQuery} from '@tanstack/react-query';
import {PlusCircle} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';

export default function BarangMasuk() {
  const {data, isLoading} = useQuery({
    queryKey: ['barang-masuk'],
    queryFn: fetchBarangMasuk,
  });

  const dataBarangMasuk = data?.data ?? [];
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    dataBarangMasuk.forEach((item: {tanggal?: string}) => {
      if (!item?.tanggal) return;
      const d = new Date(item.tanggal);
      if (Number.isNaN(d.getTime())) return;
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    const arr = Array.from(months).sort();
    return arr.map((m) => ({
      value: m,
      label: new Date(`${m}-01`).toLocaleDateString('id-ID', {
        month: 'short',
        year: 'numeric',
      }),
    }));
  }, [dataBarangMasuk]);

  // Default ke bulan terbaru bila belum dipilih
  useEffect(() => {
    if (!selectedMonth && monthOptions.length > 0) {
      setSelectedMonth(monthOptions[monthOptions.length - 1].value);
    }
  }, [monthOptions, selectedMonth]);

  const filteredData = useMemo(() => {
    if (!selectedMonth) return dataBarangMasuk;
    return dataBarangMasuk.filter((item: {tanggal?: string}) => {
      if (!item?.tanggal) return false;
      const d = new Date(item.tanggal);
      if (Number.isNaN(d.getTime())) return false;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [dataBarangMasuk, selectedMonth]);

  if (isLoading) return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;

  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Barang Masuk
      </h1>
      <div className='mb-4 flex items-center gap-3'>
        <label className='text-sm text-muted-foreground'>Filter Bulan</label>
        <select
          className='border rounded-md px-3 py-1 text-sm'
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
      <Dialog>
        <DialogTrigger>
          <Button>
            <PlusCircle /> Tambah Barang
          </Button>
        </DialogTrigger>
        <DialogContent className='max-h-[80%] overflow-auto'>
          <DialogTitle className='text-xl font-semibold'>
            Tambah Barang Masuk
          </DialogTitle>
          <h1>asdsad</h1>
        </DialogContent>
      </Dialog>
      <DataTable columns={barangMasukColumns()} data={filteredData} />
    </Card>
  );
}
