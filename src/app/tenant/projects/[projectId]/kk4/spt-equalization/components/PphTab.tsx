'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Search, Filter, AlertCircle } from "lucide-react";
import { pphTabData, inconsistenciesData } from "../data";

export default function PphTab() {
  return (
    <div className="mt-6 space-y-6">
      {/* Card Header */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-[24px]">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              Perbandingan Per Jenis PPh
            </h3>
            <p className="text-sm text-slate-500">
              Detil perbandingan biaya dengan bukti potong per jenis PPh
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Card className="border border-slate-200">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center gap-4 rounded-xl bg-slate-100 p-3">
            <Select defaultValue="20">
              <SelectTrigger className="w-20 border border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-700" />
              <Input
                placeholder="Cari nama user"
                className="border border-slate-300 bg-white pl-10"
              />
            </div>

            <Select defaultValue="all-status">
              <SelectTrigger className="w-32 border border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="matched">Matched</SelectItem>
                <SelectItem value="mismatch">Mismatch</SelectItem>
                <SelectItem value="missing">Missing Bukti</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-type">
              <SelectTrigger className="w-32 border border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-type">All Type</SelectItem>
                <SelectItem value="pph21">PPh 21</SelectItem>
                <SelectItem value="pph23">PPh 23</SelectItem>
                <SelectItem value="pph26">PPh 26</SelectItem>
                <SelectItem value="pph4_2">PPh 4(2)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="border border-slate-300 bg-white">
              <Filter className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" className="border border-slate-300 bg-slate-100">
              <span className="text-lg">⋯</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Jenis PPh
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Nilai Biaya (PPh Badan)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Nilai Bukti Potong (P2PPh)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Selisih
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Jumlah Item
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {pphTabData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-200 ${
                      item.status === "Mismatch"
                        ? "bg-red-50/30"
                        : item.status === "Missing Bukti"
                          ? "bg-amber-50/30"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {item.jenisPph}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-900">
                      {item.nilaiRp}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-900">
                      {item.nilaiRpPotong}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-mono font-bold"
                      style={{ color: item.selisihColor }}
                    >
                      {item.selisih}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <Badge className="bg-slate-100 text-slate-900 border border-slate-300 text-xs">
                          {item.jumlahItem.split(",")[0]}
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-900 border border-slate-300 text-xs">
                          {item.jumlahItem.split(",")[1]}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        style={{
                          backgroundColor: item.statusBg,
                          borderColor: item.statusColor,
                          color: item.statusColor,
                          border: "1px solid",
                        }}
                        className="text-xs font-medium"
                        variant="outline"
                      >
                        {item.status === "Matched" ? "✓" : item.status === "Mismatch" ? "✗" : "⚠"} {item.status}
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
        </CardContent>
      </Card>

      {/* Mismatch Detection Card */}
      <Card className="border-2 border-red-300 bg-white">
        <CardContent className="p-[24px]">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                Mismatch Terdeteksi
              </h4>
              <p className="text-sm text-slate-600">
                Item yang memerlukan perhatian dan tindakan segera
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
                        backgroundColor: issue.badge.includes("Perbedaan") ? "#FFF1F0" : "#FFFBE6",
                        borderColor: issue.badge.includes("Perbedaan") ? "#F5222D" : "#FAAD14",
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
    </div>
  );
}
