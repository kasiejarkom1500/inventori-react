import { Card, CardDescription, CardTitle } from "@/components/ui/card";
// import { dataDashboard } from "@/lib/data/dashboard-dummy";
import {
  ChartBarDashboardAtkArk,
  ChartBarDashboardFavoriteItem,
  ChartBarDashboardPerbidang,
} from "@/components/Chart";
import {
  Clock,
  LucideIcon,
  LucideProps,
  Package,
  ScrollText,
  TicketCheck,
} from "lucide-react";
import {
  DashboardHampirHabis,
  DashboardPermintaan,
} from "@/lib/types/dashboard";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { DataTable } from "@/components/DashboardTable";
import {
  dashboardHampirHabisColumn,
  dashboardPerimntaanColumn,
} from "@/lib/columns/dashboard-column";

export const cuecard = [
  {
    icon: Package,
    title: "Total Item",
    color: "yellow",
    value: "526",
    description: "aaaaaaa",
  },
  {
    icon: Package,
    title: "Total Stok Tersedia",
    color: "violet",
    value: "229",
    description: "aaaaaaa",
  },
  {
    icon: Package,
    title: "Total Stok Hampir Habis",
    color: "red",
    value: "10",
    description: "aaaaaaa",
  },
  {
    icon: TicketCheck,
    title: "Permintaan Bulan Ini",
    color: "lime",
    value: "5",
    description: "aaaaaaa",
  },
  {
    icon: ScrollText,
    title: "Pembelian Bulan Ini",
    color: "sky",
    value: "6",
    description: "aaaaaaa",
  },
  {
    icon: Clock,
    title: "Permintaan Pending",
    color: "amber",
    value: "6",
    description: "aaaaaaa",
  },
];

export const permintaan: DashboardPermintaan[] = [
  {
    id: "1",
    ruangan: "IPDS",
    tanggal: "2023-08-01",
    jumlah_jenis_barang: "8",
    status: "Pending",
  },
  {
    id: "2",
    ruangan: "Neraca",
    tanggal: "2023-08-01",
    jumlah_jenis_barang: "12",
    status: "Disetujui",
  },
  {
    id: "3",
    ruangan: "Distribusi",
    tanggal: "2023-08-01",
    jumlah_jenis_barang: "16",
    status: "Ditolak",
  },
  {
    id: "4",
    ruangan: "Sosial",
    tanggal: "2023-08-01",
    jumlah_jenis_barang: "3",
    status: "Disetujui",
  },
  {
    id: "5",
    ruangan: "IPDS",
    tanggal: "2023-08-01",
    jumlah_jenis_barang: "15",
    status: "Disetujui",
  },
];

export const barangHampirHabis: DashboardHampirHabis[] = [
  {
    id: "1",
    barang: "Buku",
    sisa_stok: "10",
    stok_minimum: "5",
  },
  {
    id: "2",
    barang: "Pensil",
    sisa_stok: "5",
    stok_minimum: "3",
  },
  {
    id: "3",
    barang: "Tinta Printer",
    sisa_stok: "5",
    stok_minimum: "3",
  },
  {
    id: "4",
    barang: "Kertas A4",
    sisa_stok: "5",
    stok_minimum: "3",
  },
];

export const Cuecard = ({
  data,
}: {
  data: {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    title: string;
    color: string;
    value: string;
    description: string;
  };
}) => {
  return (
    <Card className="flex items-center gap-4 p-3">
      <figure className={`rounded-lg p-4 bg-${data.color}-200/40 h-fit`}>
        <data.icon
          size={18}
          className={`rounded-lg text-white bg-${data.color}-500 p-1.5 box-content`}
        />
      </figure>
      <div className="">
        <p className="text-base text-slate-500/70 font-medium ">{data.title}</p>
        <p className="text-2xl font-semibold">{data.value}</p>
      </div>
    </Card>
  );
};
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {cuecard.map((data, index) => (
          <Cuecard key={index} data={data} />
        ))}
      </div>
      <Card className="space-y-4 bg-white rounded-lg p-4">
        <div className="space-y-2">
          <CardTitle
            className={`ml-5 text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Permintaan Bulan Ini
          </CardTitle>
          <CardDescription>
            Jumlah permintaan bulan ini per bidang
          </CardDescription>
        </div>

        <DataTable columns={dashboardPerimntaanColumn} data={permintaan} />
      </Card>
      <ChartBarDashboardAtkArk />
      <ChartBarDashboardPerbidang />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartBarDashboardFavoriteItem />
        <Card className="space-y-4 bg-white rounded-lg p-4">
          <div className="space-y-2">
            <CardTitle
              className={`ml-5 text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-red-500  before:border-0 before:h-full before:rounded-md`}
            >
              Barang Hampir Habis
            </CardTitle>
            <CardDescription>
              Jumlah permintaan bulan ini per bidang
            </CardDescription>
          </div>

          <DataTable
            columns={dashboardHampirHabisColumn}
            data={barangHampirHabis}
          />
        </Card>
      </div>
    </div>
  );
}

import {Card} from '@/components/ui/card';
import {Chart} from './tes';
import {dataDashboard} from '@/lib/data/dashboard-dummy';

export default function Dashboard() {
  return (
    <>
      <div className='grid lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
        {dataDashboard.map((data, index) => (
          <Card key={index} className='flex items-center gap-4 p-3'>
            <figure className={`rounded-lg p-4 bg-${data.color}-200/40 h-fit`}>
              <data.icon
                size={18}
                className={`rounded-lg text-white bg-${data.color}-500 p-1.5 box-content`}
              />
            </figure>
            <div className=''>
              <p className='text-base text-slate-500/70 font-medium '>
                {data.title}
              </p>
              <p className='text-2xl font-semibold'>{data.value}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className='w-2/3 mt-6'>
        <Chart />
      </div>

      
    </>
  );
}
