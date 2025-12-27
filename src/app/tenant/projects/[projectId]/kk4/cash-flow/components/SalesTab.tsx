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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { overviewStatsData, overviewTransactionsData, agingAnalysisData } from "../cashFlowData";

export default function SalesTab() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">KK 4.4.1 - Uji Arus Uang vs Penjualan</h2>
            <p className="text-sm text-slate-500">Validasi kesesuaian penerimaan kas dengan realisasi kas per invoice</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Run Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {overviewStatsData.map((stat) => (
          <Card key={stat.id} className="border-slate-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Daftar Transaksi Penjualan & Penerimaan Kas</CardTitle>
            <CardDescription>Daftar pertandingan nilai penjualan dengan realisasi kas per invoice</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200 bg-slate-50">
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    No. Invoice
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Customer
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Nilai Penjualan
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
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Tgl Invoice
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Tgl Bayar
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Jatuh Tempo
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overviewTransactionsData.map((transaction) => (
                  <TableRow key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="px-4 py-3 text-sm font-mono text-slate-900">{transaction.invoice}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700">{transaction.customer}</TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                      {transaction.salesAmount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                      {transaction.cashIn}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                      {transaction.difference}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-sm font-medium text-slate-900">
                      {transaction.realization}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700">{transaction.invoiceDate}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700">{transaction.paymentDate}</TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-700">{transaction.dueDate}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: transaction.statusBg,
                          color: transaction.statusColor,
                          border: `1px solid ${transaction.statusColor}20`,
                        }}
                      >
                        {transaction.status}
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

      {/* Aging Analysis Chart */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle className="text-base font-semibold">Analisis Aging Penerimaan Kas</CardTitle>
          <CardDescription>Distribusi umur penerimaan kas berdasarkan periode</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={agingAnalysisData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="bucket" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
