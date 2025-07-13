import { Card, CardDescription, CardTitle } from "@/components/ui/card";
// import { dataDashboard } from "@/lib/data/dashboard-dummy";
import {
  ChartBarDashboardAtkArk,
  ChartBarDashboardFavoriteItem,
  ChartBarDashboardPerbidang,
} from "@/components/Chart";
import {
  CircleAlert,
  Clock,
  ListFilter,
  // ListFilter,
  LucideProps,
  Package,
  ScrollText,
  TicketCheck,
} from "lucide-react";
import { DataTable } from "@/components/DashboardTable";
import {
  dashboardHampirHabisColumn,
  dashboardPerimntaanColumn,
} from "@/lib/columns/dashboard-column";
import {
  fetchBarangPemakaianBulanan,
  fetchBarangPemakaianRuangan,
  fetchBarangStokMinimal,
  fetchBarangStokTersedia,
  fetchBarangTotal,
} from "@/lib/network/barangServices";
import {
  fetchPermintaanBulanan,
  fetchPermintaanBulananPending,
} from "@/lib/network/permintaanService";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading";
import React, { useState } from "react";
import { fetchPembelianByBulan } from "@/lib/services/pembelianService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MONTHS } from "@/lib/utils";

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
    period: "monthly",
    key: "total_pembelian",
    fetcher: (period: string) => fetchPembelianByBulan(period),
  },
  {
    icon: Clock,
    title: "Permintaan Diproses",
    color: "yellow",
    description: "aaaaaaa",
    period: "monthly",
    key: "data",
    fetcher: (period: string) => fetchPermintaanBulananPending(period),
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
  const [periodTahun, setPeriodTahun] = useState(year.toString());
  const [periodBulanUi, setPeriodBulanUi] = useState(`${month}`);
  const [periodBulan, setPeriodBulan] = useState(`${periodTahun}-${month}`);

  const {
    data: barangHampirHabisData,
    isLoading: isLoadingHampirHabis,
    error: errorHampirHabis,
  } = useQuery({
    queryKey: ["barang_hampir_habis"],
    queryFn: fetchBarangStokMinimal,
  });

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
    queryKey: ["pemakaian_barang_atk", periodTahun],
    queryFn: () => {
      // untuk sekarang make ini dulu, selanjutnya make endpoint dashboard_permintaan
      return fetchBarangPemakaianBulanan(periodTahun);
    },
  });

  // dummy
  const pemakaianBarangARK: { data: any[] } = {
    data: [
      {
        bulan_tahun: "2024-01",
        total_pemakaian: "10",
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
    const uniqueMonth: string[] = [
      ...new Set(
        chartData.map((item: { bulan_tahun: string }) => item.bulan_tahun)
      ),
    ];
    uniqueMonth.forEach((d) => {
      const atk = chartData
        .filter((item: any) => item.bulan_tahun === d && item.type === "atk")
        .reduce((acc, curr) => acc + Number(curr.total_pemakaian), 0);
      const ark = chartData
        .filter((item: any) => item.bulan_tahun === d && item.type === "ark")
        .reduce((acc, curr) => acc + Number(curr.total_pemakaian), 0);
      finalRes.push({ date: d, atk, ark });
    });

    return finalRes.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [isLoadingPemakaianBarangATK, pemakaianBarangATK]);

  const {
    data: pemakaian,
    isLoading: isLoadingPemakaian,
    error: errorPemakaian,
  } = useQuery({
    queryKey: ["pemakaian_bulanan_peruangan", periodTahun],
    queryFn: () => {
      return fetchBarangPemakaianRuangan(periodTahun);
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
            (acc: any, curr: any) => acc + Number(curr.total_pemakaian),
            0
          ),
      };
    });
  }, [isLoadingPemakaian, pemakaian]);

  const years = React.useMemo(() => {
    let x = [];
    for (let i = year; i >= year - 10; i--) {
      x.push(i);
    }
    return x;
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4">
        {cuecard.map((data, index) => (
          <Cuecard key={index} d={data} />
        ))}
      </div>
      <Card className="space-y-4 bg-white rounded-lg p-4">
        <div className="space-y-2">
          <CardTitle
            className={`text-base  font-medium flex gap-2 items-center`}
          >
            <ListFilter size={20}></ListFilter>
            Filter periode
          </CardTitle>
        </div>
        <div className="grid grid-cols-2 gap-4 w-fit">
          <div className="w-full lg:w-48">
            <Label>Tahun</Label>
            <Select
              value={periodTahun}
              onValueChange={(value) => {
                setPeriodTahun(value);
                setPeriodBulan(`${value}-${periodBulanUi}`);
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Pilih Periode"
                  defaultValue={periodTahun}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-48">
            <Label>Bulan</Label>
            <Select
              value={periodBulanUi}
              onValueChange={(value) => {
                setPeriodBulan(`${periodTahun}-${value}`);
                setPeriodBulanUi(value);
              }}
              defaultValue={MONTHS[month as keyof typeof MONTHS]}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Pilih Periode"
                  defaultValue={MONTHS[month as keyof typeof MONTHS]}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(MONTHS)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((m, i) => (
                      <SelectItem key={i} value={m}>
                        {MONTHS[m as keyof typeof MONTHS]}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      <Card className="space-y-4 bg-white rounded-lg p-4">
        <div className="space-y-2">
          <CardTitle
            className={`ml-5 text-base lg:text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Permintaan Bulanan
          </CardTitle>
          <CardDescription className="text-xs lg:text-base">
            Jumlah permintaan bulan{" "}
            {MONTHS[periodBulanUi as keyof typeof MONTHS] + " " + periodTahun}{" "}
            per bidang
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
              Barang Hampir Habis{" "}
            </CardTitle>
          </div>

          {isLoadingHampirHabis ? (
            <LoadingSpinner size={24} className="ml-4" />
          ) : errorHampirHabis ? (
            <div className="text-sm text-red-500 rounded-lg flex gap-2 items-start">
              <CircleAlert size={24} className="text-red-500" />
              Gagal mengambil data
            </div>
          ) : (
            <DataTable
              columns={dashboardHampirHabisColumn}
              data={
                barangHampirHabisData?.data.map((item: any) => ({
                  id: item.id_barang,
                  barang: item.nama_barang,
                  sisa_stok: item.stok,
                  stok_minimum: item.stok_minimum, // perhatikan key dengan spasi
                })) ?? []
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
}
