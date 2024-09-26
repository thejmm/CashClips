import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

// Import the ChartContainer

interface ClipData {
  id: number;
  render_id: string;
  user_id: string;
  status: string;
  response: any;
  payload: any;
  created_at: string;
  updated_at: string;
}

interface ClipHistoryProps {
  clipData: ClipData[] | null;
}

const chartTypes = {
  bar: "Bar Chart",
  line: "Line Chart",
  area: "Area Chart",
};

const ClipHistory: React.FC<ClipHistoryProps> = ({ clipData }) => {
  const [timeRange, setTimeRange] = useState<string>("7");
  const [chartType, setChartType] = useState<string>("area");

  const getDateRange = (days: number) => {
    const today = new Date();
    return [...Array(days)]
      .map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();
  };

  const formatClipData = useMemo(() => {
    if (!clipData) return [];

    const days =
      timeRange === "all"
        ? Math.ceil(
            (new Date().getTime() -
              new Date(
                Math.min(
                  ...clipData.map((clip) =>
                    new Date(clip.created_at).getTime(),
                  ),
                ),
              ).getTime()) /
              (1000 * 3600 * 24),
          )
        : parseInt(timeRange, 10);

    const dateRange = getDateRange(days);

    const countsByDate = clipData.reduce(
      (acc, clip) => {
        const date = new Date(clip.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return dateRange.map((date) => ({
      date,
      clips: countsByDate[date] || 0,
    }));
  }, [clipData, timeRange]);

  const chartConfig = {
    clips: {
      label: "Clips",
      color: "hsl(var(--chart-1))",
    },
  };

  const renderChart = (): React.ReactElement => {
    const commonProps = {
      data: formatClipData,
      margin: { top: 5, right: 10, left: 10, bottom: 5 },
    };

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="clips"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="clips" fill="hsl(var(--chart-1))" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="clips"
              stroke="hsl(var(--chart-1))"
            />
          </LineChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        );
    }
  };

  const hasData = formatClipData.some((data) => data.clips > 0);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle>Clip History</CardTitle>
        <CardDescription>
          View your clipping activity over a selected time period
        </CardDescription>
        <div className="mt-4 flex space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Chart Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(chartTypes).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {hasData ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer config={chartConfig}>
                {renderChart()}
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4">
            <p>No data available</p>
            <Link href="/user/create" passHref>
              <Button
                variant="ringHover"
                className="group w-full justify-start"
              >
                <PlusCircle className="mr-2 size-4 transition-all duration-300 group-hover:-translate-x-1" />
                Generate some clips
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClipHistory;
