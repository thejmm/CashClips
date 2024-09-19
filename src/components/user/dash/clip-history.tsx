// src/components/user/dash/clip-history.tsx

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

const chartConfig = {
  bar: {
    label: "Bar Chart",
    color: "hsl(var(--chart-1))",
  },
  line: {
    label: "Line Chart",
    color: "hsl(var(--chart-2))",
  },
  area: {
    label: "Area Chart",
    color: "hsl(var(--chart-3))",
  },
};

const ClipHistory: React.FC<ClipHistoryProps> = ({ clipData }) => {
  const [timeRange, setTimeRange] = useState<string>("7");
  const [chartType, setChartType] = useState<string>("bar");

  const getDateRange = (days: number) => {
    if (!Number.isFinite(days) || days <= 0) {
      return [];
    }
    const today = new Date();
    const dateRange = [...Array(days)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().split("T")[0];
    });
    return dateRange.reverse();
  };

  const formatClipData = (data: ClipData[], range: string) => {
    let dateRange: string[] = [];

    if (!data || data.length === 0) {
      dateRange = getDateRange(7); // Default to last 7 days
      return dateRange.map((date) => ({ date, clips: 0 }));
    }

    if (range === "all") {
      const timestamps = data.map((clip) =>
        new Date(clip.created_at).getTime(),
      );
      const minTimestamp = Math.min(...timestamps);

      if (!Number.isFinite(minTimestamp)) {
        dateRange = getDateRange(7); // Default to last 7 days
      } else {
        const minDate = new Date(minTimestamp);
        const daysDifference = Math.ceil(
          (new Date().getTime() - minDate.getTime()) / (1000 * 3600 * 24),
        );
        dateRange = getDateRange(daysDifference);
      }
    } else {
      const days = parseInt(range, 10);
      if (!Number.isFinite(days) || days <= 0) {
        dateRange = getDateRange(7); // Default to last 7 days
      } else {
        dateRange = getDateRange(days);
      }
    }

    const countsByDate = data.reduce(
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
  };

  const filteredClipData = useMemo(() => {
    return formatClipData(clipData || [], timeRange);
  }, [clipData, timeRange]);

  const renderChart = (): React.ReactElement | null => {
    if (!filteredClipData || filteredClipData.length === 0) return null;

    switch (chartType) {
      case "bar":
        return (
          <BarChart data={filteredClipData}>
            {/* ... existing code ... */}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={filteredClipData}>
            {/* ... existing code ... */}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={filteredClipData}>
            {/* ... existing code ... */}
          </AreaChart>
        );
      default:
        return null;
    }
  };

  const chart = renderChart();
  const hasData = filteredClipData.some((data) => data.clips > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clip History</CardTitle>
        <CardDescription>
          View your clipping activity over a selected time period
        </CardDescription>
        <div className="mt-4 flex space-x-4">
          {/* Time Range Selector */}
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

          {/* Chart Type Selector */}
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
        {hasData && chart ? (
          <ChartContainer className="h-[300px] w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              {chart}
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] w-full flex flex-col gap-4 justify-center items-center">
            <p>No data available</p>
            <Link href="/user/create" passHref>
              <Button
                variant="ringHover"
                className="w-full group justify-start"
              >
                <PlusCircle className="mr-2 size-4 group-hover:-translate-x-1 transition-all duration-300" />
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
