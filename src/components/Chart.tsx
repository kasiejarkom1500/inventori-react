"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CircleAlert } from "lucide-react";
import { LoadingSpinner } from "./ui/loading";

export const description = "An interactive bar chart";

const chartData = [
  { date: "2024-04-01", atk: 222, ark: 150 },
  { date: "2024-04-02", atk: 97, ark: 180 },
  { date: "2024-04-03", atk: 167, ark: 120 },
  { date: "2024-04-04", atk: 242, ark: 260 },
  { date: "2024-04-05", atk: 373, ark: 290 },
  { date: "2024-04-06", atk: 301, ark: 340 },
  { date: "2024-04-07", atk: 245, ark: 180 },
  { date: "2024-04-08", atk: 409, ark: 320 },
  { date: "2024-04-09", atk: 59, ark: 110 },
  { date: "2024-04-10", atk: 261, ark: 190 },
  { date: "2024-04-11", atk: 327, ark: 350 },
];

// const chartData: any[] | undefined = [];

const chartConfig = {
  views: {
    label: "Pemakaian Barang",
  },
  atk: {
    label: "ATK",
    color: "var(--chart-4)",
  },
  ark: {
    label: "ARK",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("atk");

  const total = React.useMemo(
    () => ({
      atk: chartData.reduce((acc, curr) => acc + curr.atk, 0),
      ark: chartData.reduce((acc, curr) => acc + curr.ark, 0),
    }),
    []
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["atk", "ark"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ChartBarDashboardAtkArk({
  data,
  loading,
  error,
}: {
  data: { date: string; atk: number; ark: number }[];
  loading: boolean;
  error?: Error | null;
}) {
  const chartData = data;
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("atk");

  const total = React.useMemo(
    () => ({
      atk: data.reduce((acc, curr) => acc + curr.atk, 0),
      ark: data.reduce((acc, curr) => acc + curr.ark, 0),
    }),
    [data]
  );
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-4 pt-4 pb-3 sm:!py-0">
          <CardTitle
            className={`ml-5 text-base lg:text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Pemakaian Barang
          </CardTitle>
          <CardDescription className="text-xs lg:text-base">
            Jumlah barang yang digunakan per bulan. Data yang ditampilkan adalah
            jumlah jenis barang yang diajukan
          </CardDescription>
        </div>
        <div className="flex">
          {["atk", "ark"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                {loading ? (
                  <LoadingSpinner size={24} className="ml-4" />
                ) : error ? (
                  <div className="text-sm text-red-500 rounded-lg flex gap-2 items-start">
                    <CircleAlert
                      size={24}
                      className="text-red-500"
                    ></CircleAlert>
                    Gagal mengambil data
                  </div>
                ) : (
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <LoadingSpinner size={24} className="ml-4" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="pemakaian"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={`var(--color-${activeChart})`}
                strokeWidth={2}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

// const chartDataPerBidang = [
//   {
//     ruangan: "Pengolahan_IPDS",
//     pemakaian: 187,
//     fill: "var(--color-Pengolahan_IPDS)",
//   },
//   { ruangan: "Distribusi", pemakaian: 200, fill: "var(--color-Distribusi)" },
//   { ruangan: "Neraca", pemakaian: 275, fill: "var(--color-Neraca)" },
//   { ruangan: "Sosial", pemakaian: 173, fill: "var(--color-Sosial)" },
//   { ruangan: "Produksi", pemakaian: 90, fill: "var(--color-Produksi)" },
// ];

const chartConfigPerbidang = {
  visitors: {
    label: "Pemakaian Barang",
  },
  Pengolahan_IPDS: {
    label: "Pengolahan IPDS",
    color: "var(--chart-1)",
  },
  Distribusi: {
    label: "Distribusi",
    color: "var(--chart-2)",
  },
  Neraca: {
    label: "Neraca",
    color: "var(--chart-3)",
  },
  Sosial: {
    label: "Sosial",
    color: "var(--chart-4)",
  },
  Produksi: {
    label: "Produksi",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartBarDashboardPerbidang({
  data,
  loading,
  error,
}: {
  data: { bidang: string; pemakaian: number }[];
  loading: boolean;
  error?: Error | null;
}) {
  const chartData = data.map((item) => ({
    bidang: item.bidang.split(" ").join("_"),
    pemakaian: item.pemakaian,
    fill: `var(--color-${item.bidang.split(" ").join("_")})`,
  }));
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b px-2 py-2 lg:py-6 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-2 pt-4 pb-3 sm:!py-0">
          <CardTitle
            className={`ml-5 text-base lg:text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-violet-500  before:border-0 before:h-full before:rounded-md`}
          >
            Pemakaian Barang Per Bidang
          </CardTitle>
          <CardDescription className="text-xs lg:text-base">
            Jumlah barang yang digunakan per bulan. Data yang ditampilkan adalah
            jumlah jenis barang yang diajukan
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <LoadingSpinner size={24} className="ml-4" />
        ) : error ? (
          <div className="text-sm text-red-500 rounded-lg flex gap-2 items-start">
            <CircleAlert size={24} className="text-red-500"></CircleAlert>
            Gagal mengambil data
          </div>
        ) : (
          <ChartContainer
            config={chartConfigPerbidang}
            className="aspect-auto h-[250px]"
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="bidang"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfigPerbidang[
                    value as keyof typeof chartConfigPerbidang
                  ]?.label
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="pemakaian"
                strokeWidth={2}
                radius={4}
                activeIndex={2}
                // activeBar={({ ...props }) => {
                //   return (
                //     <Rectangle
                //       {...props}
                //       fillOpacity={0.8}
                //       stroke={props.payload.fill}
                //       strokeDasharray={4}
                //       strokeDashoffset={4}
                //     />
                //   );
                // }}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const chartDataFavoriteItem = [
  { jenis: "Pensil", value: 275, fill: "var(--color-Pensil)" },
  { jenis: "Kertas_A4", value: 200, fill: "var(--color-Kertas_A4)" },
  { jenis: "Map", value: 187, fill: "var(--color-Map)" },
  { jenis: "Penggaris", value: 173, fill: "var(--color-Penggaris)" },
];

const chartConfigFavoriteItem = {
  value: {
    label: "Pemakaian Barang",
  },
  Pensil: {
    label: "Pensil",
    color: "var(--chart-1)",
  },
  Kertas_A4: {
    label: "Kertas_A4",
    color: "var(--chart-2)",
  },
  Map: {
    label: "Map",
    color: "var(--chart-3)",
  },
  Penggaris: {
    label: "Penggaris",
    color: "var(--chart-4)",
  },
  label: {
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function ChartBarDashboardFavoriteItem() {
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b px-2 py-6 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-2 pt-4 pb-3 sm:!py-0">
          <CardTitle
            className={`ml-5 text-base lg:text-xl font-semibold relative before:absolute before:-left-5 before:w-1 before:bg-teal-500  before:border-0 before:h-full before:rounded-md`}
          >
            Barang yang Paling Sering Diminta
          </CardTitle>
          <CardDescription className="text-xs md:text-base">
            Jumlah barang yang digunakan per bulan
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfigFavoriteItem}>
          <BarChart
            accessibilityLayer
            data={chartDataFavoriteItem}
            layout="vertical"
            margin={{
              right: 24,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="jenis"
              type="category"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickSize={6}
              tickFormatter={(value) => value.slice(0, 3)}

              // hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="value"
              layout="vertical"
              fill="var(--color-value)"
              radius={4}
            >
              <LabelList
                dataKey="jenis"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
