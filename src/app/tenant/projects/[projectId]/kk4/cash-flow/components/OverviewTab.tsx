"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FileText, CheckCircle, Download } from "lucide-react";
import {
  salesStatsData,
  monthlyCashFlowData,
  flowReconciliationData,
  reportsExportData,
} from "../cashFlowData";

export default function OverviewTab() {
  const iconMap: Record<string, any> = {
    FileText,
    CheckCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">A/R Overview</h2>
            <p className="text-sm text-slate-500">Summary of accounts receivable and cash flow trends</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {salesStatsData.map((stat) => (
          <Card key={stat.id} className="border-slate-200" style={{ backgroundColor: stat.bgColor }}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                <p className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales - Cash - A/R Flow Chart */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-base font-semibold">Sales - Cash - A/R Flow</CardTitle>
          <CardDescription>Monthly trend showing sales, cash collection, and outstanding receivables</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={monthlyCashFlowData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")} M`}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" name="Sales" radius={[8, 8, 0, 0]} />
              <Bar dataKey="cash" fill="#10B981" name="Cash Collected" radius={[8, 8, 0, 0]} />
              <Bar dataKey="arOutstanding" fill="#F59E0B" name="A/R Outstanding" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Flow Reconciliation and Reports Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Flow Reconciliation */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="border-b border-slate-200 pb-4">
            <CardTitle className="text-base font-semibold">Flow Reconciliation - September 2025</CardTitle>
            <CardDescription>Reconciliation of sales, cash collection, and A/R movements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {flowReconciliationData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <span
                  className="text-sm font-bold"
                  style={{
                    color: item.label === "Cash Collected" ? "#10B981" : "#1F2937",
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <span className="font-semibold text-slate-900">Beginning A/R + Sales - Collections</span>
              <span className="text-lg font-bold text-blue-600">Rp 2.756.000.000</span>
            </div>
          </CardContent>
        </Card>

        {/* Reports & Export */}
        <Card className="border-slate-200">
          <CardHeader className="border-b border-slate-200 pb-4">
            <CardTitle className="text-base font-semibold">Reports & Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {reportsExportData.map((report) => {
              const Icon = iconMap[report.icon];
              return (
                <Button
                  key={report.id}
                  variant="outline"
                  className="w-full justify-start gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                  <span>{report.title}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
