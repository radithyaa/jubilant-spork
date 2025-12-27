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
import { journalExpensesData } from "../data";

export default function ExpensesTab() {
  return (
    <div className="mt-6 space-y-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          4.2.3.2 Journal Expenses Requiring Withholding
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Transactions that trigger PPh withholding obligations
        </p>
      </div>

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
                <SelectItem value="under">Under Withholding</SelectItem>
                <SelectItem value="missing">Missing Bukpot</SelectItem>
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
                    Journal Ref
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Account
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Pasal
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Expected PPh
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Actual PPh
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {journalExpensesData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-200 ${
                      item.status === "Under Withholding"
                        ? "bg-orange-50/30"
                        : item.status === "Missing Bukpot"
                          ? "bg-red-50/30"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-slate-900">
                      {item.journalRef}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {item.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-sm font-mono text-slate-900">
                          {item.account}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.accountName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-900">
                      {item.amount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        style={{
                          backgroundColor: item.pasalColor,
                          borderColor: item.pasalBorder,
                          color: item.pasalText,
                          border: "1px solid",
                        }}
                        className="text-xs font-medium"
                        variant="outline"
                      >
                        {item.pasal}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-900">
                      {item.expectedPph}
                    </td>
                    <td
                      className="px-4 py-3 text-right text-sm font-mono font-bold"
                      style={{ color: item.actualPphColor }}
                    >
                      {item.actualPph}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        style={{
                          backgroundColor: item.statusColor,
                          borderColor: item.statusBorder,
                          border: "1px solid",
                        }}
                        className="text-xs font-medium text-slate-700"
                        variant="outline"
                      >
                        {item.statusIcon} {item.status}
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
