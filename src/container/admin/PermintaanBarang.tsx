import DataTable from '@/components/DataTable';
import {Card} from '@/components/ui/card';
import {LoadingSpinner} from '@/components/ui/loading';
import {summaryPermintaanColumns} from '@/lib/columns/summary-permintaan-column';
import {base} from '@/lib/network/base';
import {useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

async function fetchPermintaan() {
  const response = await base.get('/get_transaksi_permintaan');
  return response.data;
}



export default function PermintaanBarang() {
  const {data, isLoading, error} = useQuery({
    queryKey: ['data-permintaan'],
    queryFn: fetchPermintaan,
  });

  const dataSummaryPermintaanRaw = data?.data.filter((item: any) => item.approve_tim !== '0') ?? [];

  // Ambil daftar bulan unik
  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    dataSummaryPermintaanRaw.forEach((item: any) => {
      const d = new Date(item.tanggal);
      if (!Number.isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        set.add(key);
      }
    });
    return Array.from(set)
      .sort((a, b) => (a > b ? -1 : 1)) // desc
      .map((key) => {
        const [year, month] = key.split('-');
        const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        });
        return {value: key, label};
      });
  }, [dataSummaryPermintaanRaw]);

  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();

  // Set default bulan ke terbaru saat opsi berubah
  useEffect(() => {
    if (!monthOptions.length) return;
    if (!selectedMonth || !monthOptions.find((m) => m.value === selectedMonth)) {
      setSelectedMonth(monthOptions[0]?.value);
    }
  }, [monthOptions, selectedMonth]);

  // Filter by selected month (default: bulan terbaru)
  const filteredData = useMemo(() => {
    if (!selectedMonth) return dataSummaryPermintaanRaw;
    const [year, month] = selectedMonth.split('-').map((v) => Number(v));
    return dataSummaryPermintaanRaw.filter((item: any) => {
      const d = new Date(item.tanggal);
      return d.getFullYear() === year && d.getMonth() === month - 1;
    });
  }, [dataSummaryPermintaanRaw, selectedMonth]);

  if (isLoading) {
    return <LoadingSpinner size={50} className='mx-auto mt-[25%]' />;
  }
  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  // console.log(dataSummaryPermintaan);
  return (
    <Card className='p-6'>
      <h1
        className={`mb-6 ml-5 text-2xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
      >
        Data Permintaan Barang
      </h1>
      <DataTable
        columns={summaryPermintaanColumns}
        data={filteredData}
        search_placeholder='nama ruangan'
        column_name='ruangan'
      />
      <div className='mt-4 flex gap-3 items-center'>
        <span className='text-sm text-slate-600'>Filter bulan:</span>
        <Select
          value={selectedMonth}
          onValueChange={(val) => setSelectedMonth(val)}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Pilih bulan' />
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
