"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  { date: "2024-04-12", atk: 292, ark: 210 },
  { date: "2024-04-13", atk: 342, ark: 380 },
  { date: "2024-04-14", atk: 137, ark: 220 },
  { date: "2024-04-15", atk: 120, ark: 170 },
  { date: "2024-04-16", atk: 138, ark: 190 },
  { date: "2024-04-17", atk: 446, ark: 360 },
  { date: "2024-04-18", atk: 364, ark: 410 },
  { date: "2024-04-19", atk: 243, ark: 180 },
  { date: "2024-04-20", atk: 89, ark: 150 },
  { date: "2024-04-21", atk: 137, ark: 200 },
  { date: "2024-04-22", atk: 224, ark: 170 },
  { date: "2024-04-23", atk: 138, ark: 230 },
  { date: "2024-04-24", atk: 387, ark: 290 },
  { date: "2024-04-25", atk: 215, ark: 250 },
  { date: "2024-04-26", atk: 75, ark: 130 },
  { date: "2024-04-27", atk: 383, ark: 420 },
  { date: "2024-04-28", atk: 122, ark: 180 },
  { date: "2024-04-29", atk: 315, ark: 240 },
  { date: "2024-04-30", atk: 454, ark: 380 },
  { date: "2024-05-01", atk: 165, ark: 220 },
  { date: "2024-05-02", atk: 293, ark: 310 },
  { date: "2024-05-03", atk: 247, ark: 190 },
  { date: "2024-05-04", atk: 385, ark: 420 },
  { date: "2024-05-05", atk: 481, ark: 390 },
  { date: "2024-05-06", atk: 498, ark: 520 },
  { date: "2024-05-07", atk: 388, ark: 300 },
  { date: "2024-05-08", atk: 149, ark: 210 },
  { date: "2024-05-09", atk: 227, ark: 180 },
  { date: "2024-05-10", atk: 293, ark: 330 },
  { date: "2024-05-11", atk: 335, ark: 270 },
  { date: "2024-05-12", atk: 197, ark: 240 },
  { date: "2024-05-13", atk: 197, ark: 160 },
  { date: "2024-05-14", atk: 448, ark: 490 },
  { date: "2024-05-15", atk: 473, ark: 380 },
  { date: "2024-05-16", atk: 338, ark: 400 },
  { date: "2024-05-17", atk: 499, ark: 420 },
  { date: "2024-05-18", atk: 315, ark: 350 },
  { date: "2024-05-19", atk: 235, ark: 180 },
  { date: "2024-05-20", atk: 177, ark: 230 },
  { date: "2024-05-21", atk: 82, ark: 140 },
  { date: "2024-05-22", atk: 81, ark: 120 },
  { date: "2024-05-23", atk: 252, ark: 290 },
  { date: "2024-05-24", atk: 294, ark: 220 },
  { date: "2024-05-25", atk: 201, ark: 250 },
  { date: "2024-05-26", atk: 213, ark: 170 },
  { date: "2024-05-27", atk: 420, ark: 460 },
  { date: "2024-05-28", atk: 233, ark: 190 },
  { date: "2024-05-29", atk: 78, ark: 130 },
  { date: "2024-05-30", atk: 340, ark: 280 },
  { date: "2024-05-31", atk: 178, ark: 230 },
  { date: "2024-06-01", atk: 178, ark: 200 },
  { date: "2024-06-02", atk: 470, ark: 410 },
  { date: "2024-06-03", atk: 103, ark: 160 },
  { date: "2024-06-04", atk: 439, ark: 380 },
  { date: "2024-06-05", atk: 88, ark: 140 },
  { date: "2024-06-06", atk: 294, ark: 250 },
  { date: "2024-06-07", atk: 323, ark: 370 },
  { date: "2024-06-08", atk: 385, ark: 320 },
  { date: "2024-06-09", atk: 438, ark: 480 },
  { date: "2024-06-10", atk: 155, ark: 200 },
  { date: "2024-06-11", atk: 92, ark: 150 },
  { date: "2024-06-12", atk: 492, ark: 420 },
  { date: "2024-06-13", atk: 81, ark: 130 },
  { date: "2024-06-14", atk: 426, ark: 380 },
  { date: "2024-06-15", atk: 307, ark: 350 },
  { date: "2024-06-16", atk: 371, ark: 310 },
  { date: "2024-06-17", atk: 475, ark: 520 },
  { date: "2024-06-18", atk: 107, ark: 170 },
  { date: "2024-06-19", atk: 341, ark: 290 },
  { date: "2024-06-20", atk: 408, ark: 450 },
  { date: "2024-06-21", atk: 169, ark: 210 },
  { date: "2024-06-22", atk: 317, ark: 270 },
  { date: "2024-06-23", atk: 480, ark: 530 },
  { date: "2024-06-24", atk: 132, ark: 180 },
  { date: "2024-06-25", atk: 141, ark: 190 },
  { date: "2024-06-26", atk: 434, ark: 380 },
  { date: "2024-06-27", atk: 448, ark: 490 },
  { date: "2024-06-28", atk: 149, ark: 200 },
  { date: "2024-06-29", atk: 103, ark: 160 },
  { date: "2024-06-30", atk: 446, ark: 400 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  atk: {
    label: "ATK",
    color: "var(--chart-2)",
  },
  ark: {
    label: "ARK",
    color: "var(--chart-1)",
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

export function ChartBarDashboardAtkArk() {
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
