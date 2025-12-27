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
import { Eye, Search, Filter } from "lucide-react";
import { periodTabData } from "../data";

export default function PeriodTab() {
  return (
    <div className="mt-6 space-y-6">
      {/* Card Header */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-[24px]">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-900">
              Perbandingan Per Masa Pajak
            </h3>
            <p className="text-sm text-slate-500">
              Detil perbandingan omzet PPh Badan dengan DPP PPN Keluaran per bulan
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
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-type">
              <SelectTrigger className="w-32 border border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-type">All Type</SelectItem>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
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
                    Masa Pajak
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Omzet PPh (SPT 1771)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    DPP PPN Keluaran (SPT 1111)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Selisih
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Rasio
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Justifikasi
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {periodTabData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-200 ${
                      item.status === "Warning"
                        ? "bg-amber-50/30"
                        : item.status === "Critical"
                          ? "bg-red-50/30"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {item.masaPajak}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-900">
                      {item.omzetPph}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-900">
                      {item.dppPpn}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-mono font-bold"
                      style={{ color: item.selisih === "Rp 5.000.000" || item.selisih === "Rp 2.000.000" ? "#52C41A" : "#FAAD14" }}
                    >
                      {item.selisih}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-slate-100 text-slate-900 border border-slate-300">
                        {item.rasio}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        style={{
                          backgroundColor:
                            item.status === "OK"
                              ? "#F6FFED"
                              : item.status === "Warning"
                                ? "#FFFBE6"
                                : "#FFF1F0",
                          borderColor:
                            item.status === "OK"
                              ? "#52C41A"
                              : item.status === "Warning"
                                ? "#FAAD14"
                                : "#F5222D",
                          color:
                            item.status === "OK"
                              ? "#52C41A"
                              : item.status === "Warning"
                                ? "#FAAD14"
                                : "#F5222D",
                          border: "1px solid",
                        }}
                        className="text-xs font-medium"
                        variant="outline"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className="bg-slate-100 text-slate-700 border border-slate-300"
                        variant="outline"
                      >
                        {item.justifikasi}
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
    </div>
  );
}
