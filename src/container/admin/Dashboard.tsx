import {
  Card,
  // CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
// import { dataDashboard } from "@/lib/data/dashboard-dummy";
import {
  ChartBarDashboardAtkArk,
  ChartBarDashboardFavoriteItem,
  ChartBarDashboardPerbidang,
} from "@/components/Chart";
import {
  CircleAlert,
  Clock,
  // ListFilter,
  LucideProps,
  Package,
  ScrollText,
  TicketCheck,
} from "lucide-react";
import { DashboardHampirHabis } from "@/lib/types/dashboard";
import { DataTable } from "@/components/DashboardTable";
import {
  dashboardHampirHabisColumn,
  dashboardPerimntaanColumn,
} from "@/lib/columns/dashboard-column";
import {
  fetchBarangPemakaianBulanan,
  fetchBarangStokMinimal,
  fetchBarangStokTersedia,
  fetchBarangTotal,
} from "@/lib/network/barangServices";
import {
  fetchPermintaanBulanan,
  fetchPermintaanBulananPending,
} from "@/lib/network/permintaanService";
import { fetchBarangPembelianBulanan } from "@/lib/network/pembelianService";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading";
import React, { useState } from "react";

export const cuecard = [
  {
    icon: Package,
    title: "Total Item",
    color: "yellow",
    description: "aaaaaaa",
    key: "total_item",
    fetcher: () => fetchBarangTotal(),
  },
  {
    icon: Package,
    title: "Total Stok Tersedia",
    color: "violet",
    description: "aaaaaaa",
    key: "total_stok_tersedia",
    fetcher: () => fetchBarangStokTersedia(),
  },
  {
    icon: Package,
    title: "Total Stok Hampir Habis",
    color: "red",
    description: "aaaaaaa",
    key: "data",
    fetcher: () => fetchBarangStokMinimal(),
  },
  {
    icon: TicketCheck,
    title: "Permintaan Bulan Ini",
    color: "green",
    description: "aaaaaaa",
    period: "monthly",
    key: "data",
    fetcher: (period: string) => fetchPermintaanBulanan(period),
  },
  {
    icon: ScrollText,
    title: "Pembelian Bulan Ini",
    color: "sky",
    description: "aaaaaaa",
    key: "total",
    fetcher: () => fetchBarangPembelianBulanan(),
  },
  {
    icon: Clock,
    title: "Permintaan Pending",
    color: "yellow",
    description: "aaaaaaa",
    period: "monthly",
    key: "data",
    fetcher: (period: string) => fetchPermintaanBulananPending(period),
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
  d,
}: {
  d: {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    title: string;
    color: string;
    description: string;
    period?: string;
    key: string;
    fetcher: (period: string) => Promise<any>;
  };
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`cuecard-${d.title}`, d.period],
    queryFn: () => {
      let period = "";
      if (d.period) {
        if (d.period === "yearly") {
          period = new Date().getFullYear().toString();
        } else if (d.period === "monthly") {
          const today = new Date();
          const month = (today.getMonth() + 1).toString().padStart(2, "0");
          const year = today.getFullYear();
          period = `${year}-${month}`;
        }
      }
      return d.fetcher(period);
    },
  });
  // default value
  let value = "0";
  if (data) {
    if (data[d.key] && Array.isArray(data[d.key])) {
      value = data[d.key].length;
    } else {
      value = data[d.key];
    }
  }

  return (
    <Card className="flex items-center gap-4 p-3">
      <figure className={`rounded-lg p-1 lg:p-4 bg-${d.color}-200/40 h-fit`}>
        <d.icon
          size={18}
          className={`rounded-lg text-white bg-${d.color}-500 p-1.5 box-content`}
        />
      </figure>
      <div className="w-full">
        <p className="text-xs lg:text-base text-slate-500/70 font-medium ">
          {d.title}
        </p>
        {isLoading ? (
          <LoadingSpinner size={24} className="ml-4" />
        ) : // <p className="text-2xl font-semibold">{data && data.status===true ? JSON.stringify(data) : "0"}{JSON.stringify(data)}</p>
        error ? (
          <div className="text-sm text-red-500 rounded-lg flex gap-2 items-start">
            <CircleAlert size={24} className="text-red-500"></CircleAlert>Gagal
            mengambil data
          </div>
        ) : (
          <p className="text-sm lg:text-2xl font-semibold">{value}</p>
        )}
      </div>
    </Card>
  );
};

export default function Dashboard() {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();
  const [periodTahun, _] = useState(year.toString());
  const [periodBulan, _1] = useState(`${year}-${month}`);

  const {
    data: dataPeruangan,
    isLoading: isLoadingPeruangan,
    error: errorPeruangan,
  } = useQuery({
    queryKey: ["permintaan_bulanan_peruangan", periodBulan],
    queryFn: () => {
      return fetchPermintaanBulanan(periodBulan);
    },
  });

  const {
    data: pemakaianBarangATK,
    isLoading: isLoadingPemakaianBarangATK,
    error: errorPemakaianBarangATK,
  } = useQuery({
    queryKey: ["permintaan_bulanan_peruangan", periodBulan],
    queryFn: () => {
      // untuk sekarang make ini dulu, selanjutnya make endpoint dashboard_permintaan
      return fetchBarangPemakaianBulanan(periodTahun);
    },
  });

  // dummy
  const pemakaianBarangARK: { data: any[] } = {
    data: [
      {
        tanggal: "2023-01-01",
        jumlah_jenis_barang: "10",
      },
    ],
  };
  const pemakaianATKARK = React.useMemo(() => {
    if (isLoadingPemakaianBarangATK) return [];

    let finalRes: { date: string; atk: number; ark: number }[] = [];
    let chartData = [
      ...pemakaianBarangATK.data.map((item: any) => ({ ...item, type: "atk" })),
      ...pemakaianBarangARK.data.map((item: any) => ({ ...item, type: "ark" })),
    ];
    const uniqueDate: string[] = [
      ...new Set(chartData.map((item: { tanggal: string }) => item.tanggal)),
    ];

    uniqueDate.forEach((d) => {
      const atk = chartData
        .filter((item: any) => item.tanggal === d && item.type === "atk")
        .reduce((acc, curr) => acc + Number(curr.jumlah_jenis_barang), 0);
      const ark = chartData
        .filter((item: any) => item.tanggal === d && item.type === "ark")
        .reduce((acc, curr) => acc + Number(curr.jumlah_jenis_barang), 0);
      finalRes.push({ date: d, atk, ark });
    });

    return finalRes;
  }, [isLoadingPemakaianBarangATK, pemakaianBarangATK]);

  const {
    data: pemakaian,
    isLoading: isLoadingPemakaian,
    error: errorPemakaian,
  } = useQuery({
    queryKey: ["permintaan_bulanan_peruangan", periodBulan],
    queryFn: () => {
      return fetchPermintaanBulanan(periodBulan);
    },
  });

  const pemakaianPeruangan = React.useMemo(() => {
    if (isLoadingPemakaian) return [];
    if (!pemakaian) return [];
    const uniqueBidang: any = [
      ...new Set(
        pemakaian.data.map((item: { ruangan: string }) => item.ruangan)
      ),
    ];

    return uniqueBidang.map((bidang: string) => {
      return {
        bidang: bidang,
        pemakaian: pemakaian.data
          .filter((item: any) => item.ruangan === bidang)
          .reduce(
            (acc: any, curr: any) => acc + Number(curr.jumlah_jenis_barang),
            0
          ),
      };
    });
  }, [isLoadingPemakaian, pemakaian]);
  console.log("pemakaian peruangan", pemakaianPeruangan);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4">
        {cuecard.map((data, index) => (
          <Cuecard key={index} d={data} />
        ))}
      </div>
      {/* <Card className="space-y-4 bg-white rounded-lg p-4">
        <div className="space-y-2">
          <CardTitle
            className={`text-base  font-medium flex gap-2 items-center`}
          >
            <ListFilter size={20}></ListFilter>
            Filter periode
          </CardTitle>
        </div>
        <CardContent className="grid">
          <Select
            value={periodBulan}
            onValueChange={(value) => setPeriodBulan(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2023-01">Januari 2023</SelectItem>
                <SelectItem value="2023-02">Februari 2023</SelectItem>
                <SelectItem value="2023-03">Maret 2023</SelectItem>
                <SelectItem value="2023-04">April 2023</SelectItem>
                <SelectItem value="2023-05">Mei 2023</SelectItem>
                <SelectItem value="2023-06">Juni 2023</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card> */}
      <Card className="space-y-4 bg-white rounded-lg p-4">
        <div className="space-y-2">
          <CardTitle
            className={`ml-5 text-base lg:text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Permintaan Bulan Ini
          </CardTitle>
          <CardDescription className="text-xs lg:text-base">
            Jumlah permintaan bulan ini per bidang
          </CardDescription>
        </div>
        {isLoadingPeruangan ? (
          <LoadingSpinner size={24} className="ml-4" />
        ) : errorPeruangan ? (
          <div className="text-sm text-red-500 rounded-lg flex gap-2 items-start">
            <CircleAlert size={24} className="text-red-500"></CircleAlert>Gagal
            mengambil data
          </div>
        ) : (
          <DataTable
            columns={dashboardPerimntaanColumn}
            data={dataPeruangan.data}
          />
        )}
      </Card>

      <ChartBarDashboardAtkArk
        data={pemakaianATKARK}
        loading={isLoadingPemakaianBarangATK}
        error={errorPemakaianBarangATK}
      />
      <ChartBarDashboardPerbidang
        data={pemakaianPeruangan}
        loading={isLoadingPemakaian}
        error={errorPemakaian}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartBarDashboardFavoriteItem />
        <Card className="space-y-4 bg-white rounded-lg p-4">
          <div className="space-y-2">
            <CardTitle
              className={`ml-5 text-base lg:text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-red-500  before:border-0 before:h-full before:rounded-md`}
            >
              Barang Hampir Habis
            </CardTitle>
            <CardDescription className="text-xs lg:text-base">
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
