"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Receipt,
  Package,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  overviewStats,
  issueBreakdown,
  complianceData,
  validationSummaries,
  monthlyTrend,
  validationMetrics,
} from "../data/overviewTabData";

const iconMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="h-6 w-6" />,
  CheckCircle2: <CheckCircle2 className="h-6 w-6" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6" />,
  DollarSign: <DollarSign className="h-6 w-6" />,
  Receipt: <Receipt className="h-6 w-6" />,
  Package: <Package className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
};

function StatCard({ stat }: { stat: typeof overviewStats[0] }) {
  return (
    <Card className="border-slate-200" style={{ backgroundColor: stat.bgColor }}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.subText}</p>
            {stat.progress && (
              <div className="mt-3">
                <Progress value={stat.progress} className="h-2 bg-slate-200" />
              </div>
            )}
          </div>
          <div
            className="ml-3 flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0"
            style={{ backgroundColor: `${stat.iconColor}15` }}
          >
            <div style={{ color: stat.iconColor }}>{iconMap[stat.icon]}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IssueBreakdownChart() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="text-base font-semibold">Issue Breakdown by Module</CardTitle>
        <CardDescription>Discrepancies by validation type</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={issueBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="module" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px",
              }}
              formatter={(value) => [`${value} issues`, "Count"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {issueBreakdown.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ComplianceDonutChart() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="text-base font-semibold">Tax Compliance Status</CardTitle>
        <CardDescription>Overall compliance rate for purchases</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={complianceData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="percentage"
            >
              {complianceData.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-col gap-2">
          {complianceData.map((item) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600">{item.category}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ValidationSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {validationSummaries.map((summary) => (
        <Card key={summary.id} className="border-slate-200">
          <CardHeader className="border-b border-slate-200 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    style={{
                      backgroundColor: summary.badgeBg,
                      color: summary.badgeColor,
                    }}
                  >
                    {summary.badge}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700">{summary.matchRate}</Badge>
                </div>
                <CardTitle className="mt-3 text-base font-semibold">{summary.title}</CardTitle>
                <CardDescription className="mt-1">{summary.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {summary.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{metric.label}</span>
                  <span className="font-semibold text-slate-900">{metric.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-red-600">{summary.unmatched}</span>
                  <span className="text-xs text-slate-500">{summary.issuesCount} issues</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-between text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MonthlyTrendChart() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="text-base font-semibold">Monthly Validation Trend</CardTitle>
        <CardDescription>PPh and PPN match rates over time</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} label={{ value: "Match Rate (%)", angle: -90, position: "insideLeft" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "12px",
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="pph" fill="#FAAD14" radius={[8, 8, 0, 0]} name="PPh Match Rate" />
            <Bar dataKey="ppn" fill="#1890FF" radius={[8, 8, 0, 0]} name="PPN Match Rate" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ValidationMetricsCards() {
  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-slate-900">Validation Summary</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {validationMetrics.map((metric) => (
          <Card key={metric.id} className="border-slate-200 hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.subText}</p>
                </div>
                <div
                  className="ml-3 flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${metric.iconColor}15` }}
                >
                  <div style={{ color: metric.iconColor }}>{iconMap[metric.icon]}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inventory & Purchases Tax Validation</h2>
        <p className="mt-1 text-sm text-slate-500">Comprehensive overview of tax compliance for all purchase transactions</p>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IssueBreakdownChart />
        <ComplianceDonutChart />
      </div>

      {/* Validation Summary Cards */}
      <ValidationSummaryCards />

      {/* Monthly Trend Chart */}
      <MonthlyTrendChart />

      {/* Validation Metrics */}
      <ValidationMetricsCards />
    </div>
  );
}
