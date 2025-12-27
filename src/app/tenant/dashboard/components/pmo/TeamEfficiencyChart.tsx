"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface TeamEfficiencyChartProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    chartData: Array<{
      month: string;
      onTimeRate: number;
      teamEfficiency: number;
    }>;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border border-[rgba(145,158,171,0.2)] bg-white p-2 shadow-lg">
        <CardContent className="flex flex-col gap-2 p-2">
          <p className="text-sm font-normal text-[#0A0A0A]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-[#0A0A0A]">
                {entry.name}: {entry.value}%
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-center gap-6 pt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-[#0A0A0A]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function TeamEfficiencyChart({ data }: TeamEfficiencyChartProps) {
  return (
    <Card className="flex-1 rounded-[20px] border-none bg-white shadow-sm">
      <CardHeader className="p-[30px] pb-5">
        <CardTitle className="text-2xl font-bold text-[#2B3674]">{data.title}</CardTitle>
        <p className="text-sm text-[#2B3674]">{data.subtitle}</p>
      </CardHeader>
      <CardContent className="px-[30px] pb-[30px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#A3AED0", fontSize: 12 }}
              axisLine={{ stroke: "#E9EDF7" }}
            />
            <YAxis
              tick={{ fill: "#A3AED0", fontSize: 12 }}
              axisLine={{ stroke: "#E9EDF7" }}
              domain={[70, 95]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="onTimeRate"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ fill: "#4F46E5", r: 5 }}
              activeDot={{ r: 7 }}
              name="On-time rate"
            />
            <Line
              type="monotone"
              dataKey="teamEfficiency"
              stroke="#16A34A"
              strokeWidth={3}
              dot={{ fill: "#16A34A", r: 5 }}
              activeDot={{ r: 7 }}
              name="Team Efficiency"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-[#2B3674]">{data.description}</p>
      </CardContent>
    </Card>
  );
}
