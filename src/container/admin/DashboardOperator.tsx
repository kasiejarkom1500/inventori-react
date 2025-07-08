import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import {
  CircleAlert,
  ListFilter,
  LucideProps,
  Package,
  TicketCheck,
} from "lucide-react";
import { DashboardHampirHabis } from "@/lib/types/dashboard";
import { DataTable } from "@/components/DashboardTable";
import { dashboardPerimntaanColumn } from "@/lib/columns/dashboard-column";
import { fetchBarangStokTersedia } from "@/lib/network/barangServices";
import { fetchPermintaanBulanan } from "@/lib/network/permintaanService";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading";
import React, { useState } from "react";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
// } from "@/components/ui/select";
import { getUser } from "@/lib/network/authServices";
import { MONTHS } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const cuecard = [
  // {
  //   icon: Package,
  //   title: "Total Item",
  //   color: "yellow",
  //   description: "aaaaaaa",
  //   key: "total_item",
  //   fetcher: () => fetchBarangTotal(),
  // },
  {
    icon: Package,
    title: "Total Stok Tersedia",
    color: "violet",
    description: "aaaaaaa",
    key: "total_stok_tersedia",
    fetcher: () => fetchBarangStokTersedia(),
  },
  // {
  //   icon: Package,
  //   title: "Total Stok Hampir Habis",
  //   color: "red",
  //   description: "aaaaaaa",
  //   key: "data",
  //   fetcher: () => fetchBarangStokMinimal(),
  // },
  {
    icon: TicketCheck,
    title: "Permintaan Bulan Ini",
    color: "green",
    description: "aaaaaaa",
    period: "monthly",
    key: "data",
    fetcher: (period: string) => fetchPermintaanBulanan(period),
  },
  // {
  //   icon: ScrollText,
  //   title: "Pembelian Bulan Ini",
  //   color: "sky",
  //   description: "aaaaaaa",
  //   key: "total",
  //   fetcher: () => fetchBarangPembelianBulanan(),
  // },
  // {
  //   icon: Clock,
  //   title: "Permintaan Pending",
  //   color: "yellow",
  //   description: "aaaaaaa",
  //   period: "monthly",
  //   key: "data",
  //   fetcher: (period: string) => fetchPermintaanBulananPending(period),
  // },
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

export default function DashboardOperator() {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear();
  const user = getUser();
  // console.log(user);
  // const periodTahun = year.toString();
  // const periodBulan = `${year}-${month}`;
  // const [periodTahun, setPeriodTahun] = useState(year.toString());
  const [periodTahun, setPeriodTahun] = useState(year.toString());
  const [periodBulanUi, setPeriodBulanUi] = useState(`${month}`);
  const [periodBulan, setPeriodBulan] = useState(`${periodTahun}-${month}`);

  const {
    data: dataPeruangan,
    isLoading: isLoadingPeruangan,
    error: errorPeruangan,
  } = useQuery({
    queryKey: ["permintaan_bulanan_peruangan", periodBulan, user],
    queryFn: async () => {
      return fetchPermintaanBulanan(periodBulan).then((res) => {
        if (!user) {
          return res;
        }
        return {
          ...res,
          status: true,
          data: res.data.filter(
            (item: any) => item.ruangan === user.data_ruangan[0].ruangan
          ),
        }; // return res;
      });
    },
  });
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
                  {/* <SelectItem value="2023-01">Januari 2023</SelectItem>
                  <SelectItem value="2023-02">Februari 2023</SelectItem>
                  <SelectItem value="2023-03">Maret 2023</SelectItem>
                  <SelectItem value="2023-04">April 2023</SelectItem>
                  <SelectItem value="2023-05">Mei 2023</SelectItem>
                  <SelectItem value="2023-06">Juni 2023</SelectItem> */}
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
    </div>
  );
}
