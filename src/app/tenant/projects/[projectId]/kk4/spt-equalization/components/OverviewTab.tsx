'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle } from "lucide-react";
import { sptComparisonMatrixData, overviewAnalysisData, inconsistenciesData } from "../data";

export default function OverviewTab() {
  return (
    <div className="mt-6 space-y-6">
      {/* Card Header */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-[24px]">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              SPT Comparison Matrix (Heatmap)
            </h3>
            <p className="text-sm text-slate-500">
              Perbandingan konsistensi data antar berbagai jenis SPT
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Table */}
      <Card className="border border-slate-200">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 bg-slate-50">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-blue-100">
                    SPT PPN
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-green-100">
                    SPT PPh 21
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-yellow-100">
                    SPT PPh 23
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-red-100">
                    SPT PPh 25
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-slate-50">
                    Variance
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-slate-50">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500 bg-slate-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sptComparisonMatrixData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-200"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {row.metric}
                    </td>
                    <td
                      className="px-4 py-3 text-center text-sm font-mono text-slate-900"
                      style={{ backgroundColor: row.sptPpn.bgColor }}
                    >
                      {row.sptPpn.value}
                    </td>
                    <td
                      className="px-4 py-3 text-center text-sm font-mono text-slate-900"
                      style={{ backgroundColor: row.sptPph21.bgColor }}
                    >
                      {row.sptPph21.value}
                    </td>
                    <td
                      className="px-4 py-3 text-center text-sm font-mono text-slate-900"
                      style={{ backgroundColor: row.sptPph23.bgColor }}
                    >
                      {row.sptPph23.value}
                    </td>
                    <td
                      className="px-4 py-3 text-center text-sm font-mono text-slate-900"
                      style={{ backgroundColor: row.sptPph25.bgColor }}
                    >
                      {row.sptPph25.value}
                    </td>
                    <td
                      className="px-4 py-3 text-center text-sm font-mono font-bold"
                      style={{ color: row.varianceColor }}
                    >
                      {row.variance}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        style={{
                          backgroundColor: row.statusColor,
                          borderColor: row.statusBorder,
                          color: row.statusColor === "#FFFBE6" ? "#FAAD14" : "#F5222D",
                          border: "1px solid",
                        }}
                        className="text-xs font-medium"
                        variant="outline"
                      >
                        {row.status === "OK" ? "✓ OK" : row.status === "Warning" ? "⚠ Warning" : "✗ Critical"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4 text-slate-900" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Heatmap Legend */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="mb-3 text-xs font-semibold uppercase text-slate-500">
              Heatmap Legend:
            </p>
            <div className="flex gap-6">
              {overviewAnalysisData.heatmapLegend.map((legend, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-5 w-5 rounded border border-slate-200"
                    style={{ backgroundColor: legend.bgColor }}
                  />
                  <span className="text-xs text-slate-600">{legend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inconsistencies Detection Card */}
      <Card className="border-2 border-amber-300 bg-white">
        <CardContent className="p-[24px]">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                {inconsistenciesData.title}
              </h4>
              <p className="text-sm text-slate-600">
                {inconsistenciesData.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {inconsistenciesData.items.map((issue) => (
              <div key={issue.id} className="flex items-start justify-between gap-4 p-3 border border-slate-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      style={{
                        backgroundColor: "#FFFBE6",
                        borderColor: "#FAAD14",
                        color: issue.badge.includes("Perbedaan") ? "#F5222D" : "#FAAD14",
                        border: "1px solid",
                      }}
                      className="text-xs font-medium"
                      variant="outline"
                    >
                      {issue.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-900 font-medium">
                    {issue.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {issue.id}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-red-600">
                    {issue.impact}
                  </p>
                  <p className="text-xs text-slate-500">
                    dampak
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card className="border border-slate-200">
        <CardContent className="p-[24px]">
          <h4 className="text-lg font-bold text-slate-900 mb-6">
            Analisis Keseluruhan
          </h4>
          <p className="text-sm text-slate-600 mb-6">
            Ringkasan rasio omzet dan status equalisasi
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left side - Main metrics */}
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Rasio Keseluruhan (DPP PPN / Omzet PPh)
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {overviewAnalysisData.ratioKeseluruhan}
                </p>
              </div>
            </div>

            {/* Right side - Status */}
            <div className="flex flex-col justify-end">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-600 font-medium mb-2">
                  Status Equalisasi
                </p>
                <Badge className="bg-green-100 text-green-700 border border-green-300">
                  {overviewAnalysisData.statusEqualisasi}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-600 font-medium mb-2">
                Masa Pajak OK
              </p>
              <p className="text-3xl font-bold text-green-600">
                {overviewAnalysisData.masaPajakOk}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-600 font-medium mb-2">
                Masa Pajak Warning
              </p>
              <p className="text-3xl font-bold text-amber-500">
                {overviewAnalysisData.masaPajakWarning}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-600 font-medium mb-2">
                Masa Pajak Critical
              </p>
              <p className="text-3xl font-bold text-red-600">
                {overviewAnalysisData.masaPajakCritical}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
