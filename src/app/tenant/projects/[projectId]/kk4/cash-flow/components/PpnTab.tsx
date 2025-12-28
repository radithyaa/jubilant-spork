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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  BarChart3,
} from "lucide-react";
import {
  ppnStatCards,
  invoiceRecords,
  agingBuckets,
  cashFlowRatioData,
} from "../data/ppnTabData";

const iconMap: Record<string, React.ReactNode> = {
  DollarSign: <DollarSign className="h-6 w-6" />,
  Receipt: <Receipt className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6" />,
  Clock: <Clock className="h-6 w-6" />,
};

function StatCard({ card }: { card: typeof ppnStatCards[0] }) {
  return (
    <Card
      className={`border-2 transition-all hover:shadow-md ${
        card.borderColor
          ? "border-2"
          : "border-slate-200"
      }`}
      style={{
        backgroundColor: card.bgColor || "#FFFFFF",
        borderColor: card.borderColor || "#E2E8F0",
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.subText}</p>
          </div>
          <div
            className="ml-3 flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${card.iconColor}15` }}
          >
            <div style={{ color: card.iconColor }}>{iconMap[card.icon]}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CashFlowRatioCard() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Cash Flow Realization Ratio</CardTitle>
            <CardDescription>Persentase penerimaan kas terhadap total penyerahan</CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-700">On Target</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Ratio Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Rasio Realisasi</span>
              <span className="text-2xl font-bold text-slate-900">{cashFlowRatioData.rasioRealisasi}</span>
            </div>
            <Progress value={92} className="h-2 bg-slate-200" />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Total Penyerahan</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{cashFlowRatioData.totalPenyerahan}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Kas Diterima</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{cashFlowRatioData.kasDiterima}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Outstanding</p>
              <p className="mt-1 text-lg font-bold text-red-600">{cashFlowRatioData.outstanding}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InvoiceTable() {
  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-200 pb-4">
        <CardTitle className="text-base font-semibold">Daftar Faktur Pajak & Penerimaan Kas</CardTitle>
        <CardDescription>Detail invoice dan status pembayaran</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 bg-slate-50">
                <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  No. Faktur
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Customer
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  DPP
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  PPN
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Kas Masuk
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Selisih
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Realisasi
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Tgl Penyerahan
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Tgl Bayar
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceRecords.map((record) => (
                <TableRow key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="px-4 py-3 text-sm font-medium text-slate-900">
                    {record.fakturnomer}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{record.customer.name}</div>
                    <div className="text-xs text-slate-500">{record.customer.npwp}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{record.dpp}</TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{record.ppn}</TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    {record.total}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm text-slate-700">{record.kasMasuk}</TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                    {record.selisih}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-semibold text-slate-900">{record.realisasi}%</span>
                      <div className="w-12 bg-slate-200 rounded-full overflow-hidden">
                        <Progress value={record.realisasi} className="h-1" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-sm text-slate-700">
                    {record.tglPenyerahan}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center text-sm text-slate-700">
                    {record.tglBayar}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Badge
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: record.statusBg,
                        color: record.statusColor,
                        border: `1px solid ${record.statusColor}40`,
                      }}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
  );
}

function AgingAnalysis() {
  return (
    <div>
      <h3 className="mb-4 text-base font-semibold text-slate-900">Aging Analysis</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {agingBuckets.map((bucket) => (
          <Card
            key={bucket.id}
            className="border-2 transition-all hover:shadow-md"
            style={{
              backgroundColor: bucket.bgColor,
              borderColor: bucket.borderColor,
            }}
          >
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-600">{bucket.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{bucket.value}</p>
              <p className="mt-1 text-xs text-slate-500">faktur</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PpnTab() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">KK 4.4.2 Uji Arus Uang vs PPN Penyerahan</h2>
          <p className="mt-1 text-sm text-slate-500">Validasi aliran kas dengan PPN yang diserahkan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Run Analysis</span>
          </Button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ppnStatCards.map((card) => (
          <StatCard key={card.id} card={card} />
        ))}
      </div>

      {/* Cash Flow Ratio Card */}
      <CashFlowRatioCard />

      {/* Invoice Table */}
      <InvoiceTable />

      {/* Aging Analysis */}
      <AgingAnalysis />
    </div>
  );
}
