"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ProjectProgressTrendsProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    chartData: Array<{
      month: string;
      completed: number;
      inProgress: number;
      planned: number;
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
                {entry.name}: {entry.value}
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

export function ProjectProgressTrends({ data }: ProjectProgressTrendsProps) {
  return (
    <Card className="flex-1 rounded-[20px] border-none bg-white shadow-sm">
      <CardHeader className="p-[30px] pb-5">
        <CardTitle className="text-2xl font-bold text-[#2B3674]">{data.title}</CardTitle>
        <p className="text-sm text-[#2B3674]">{data.subtitle}</p>
      </CardHeader>
      <CardContent className="px-[30px] pb-[30px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9EDF7" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#A3AED0", fontSize: 12 }}
              axisLine={{ stroke: "#E9EDF7" }}
            />
            <YAxis
              tick={{ fill: "#A3AED0", fontSize: 12 }}
              axisLine={{ stroke: "#E9EDF7" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="completed" fill="#16A34A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inProgress" fill="#CB30E0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="planned" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-4 text-sm text-[#2B3674]">{data.description}</p>
      </CardContent>
    </Card>
  );
}
