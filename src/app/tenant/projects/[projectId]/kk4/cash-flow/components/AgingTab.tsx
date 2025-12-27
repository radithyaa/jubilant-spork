"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  agingSummaryData,
  agingDetailData,
  actionRequiredAlerts,
} from "../cashFlowData";

export default function AgingTab() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "error":
        return {
          bg: "#FFF1F0",
          border: "#F5222D",
          text: "#C10007",
        };
      case "warning":
        return {
          bg: "#FFFBE6",
          border: "#FAAD14",
          text: "#CA3500",
        };
      default:
        return {
          bg: "#E6F4FF",
          border: "#1890FF",
          text: "#0050B3",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Aging Analysis</h2>
          <p className="text-sm text-slate-500">Distribution of receivables by aging bucket</p>
        </div>
      </div>

      {/* Aging Summary Chart */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-base font-semibold">Aging Summary</CardTitle>
          <CardDescription>Distribution of receivables by aging bucket</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={agingSummaryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="bucket"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
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
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Aging Detail by Customer Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-base font-semibold">Aging Detail by Customer</CardTitle>
          <CardDescription>Breakdown of receivables aging per customer</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50">
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Customer
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Current
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    1-30
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    31-60
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    61-90
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    +90
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Total
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agingDetailData.map((row) => (
                  <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="px-4 py-3 text-sm font-medium text-slate-900">{row.customer}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{row.current}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{row.days130}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{row.days3160}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{row.days6190}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                      {row.days90Plus}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm font-bold text-slate-900">{row.total}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: row.statusBg,
                          color: row.statusColor,
                          border: `1px solid ${row.statusColor}20`,
                        }}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Required Alerts */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">Action Required</h3>
        {actionRequiredAlerts.map((alert) => {
          const style = getAlertStyle(alert.type);
          return (
            <div
              key={alert.id}
              className="flex gap-3 rounded-lg border-2 p-4"
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
              }}
            >
              <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: style.text }}>
                  {alert.title}
                </p>
                <p className="text-sm" style={{ color: style.text }}>
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
