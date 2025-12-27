"use client";

import { dummyData } from "../data/dummy";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, AlertCircle } from "lucide-react";
import { useState } from "react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Doc OK":
      return "bg-green-100 border-green-500 text-green-700";
    case "Calc OK":
      return "bg-blue-100 border-blue-500 text-blue-700";
    case "Doc Missing":
      return "bg-red-100 border-red-500 text-red-700";
    case "No Match":
      return "bg-red-100 border-red-500 text-red-700";
    case "Doc Incomplete":
      return "bg-yellow-100 border-yellow-500 text-yellow-700";
    default:
      return "bg-gray-100 border-gray-500 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Doc OK":
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 11 11"
        >
          <path
            d="M6.5625 0.875H2.625C2.39294 0.875 2.17038 0.967187 2.00628 1.13128C1.84219 1.29538 1.75 1.51794 1.75 1.75V8.75C1.75 8.98206 1.84219 9.20462 2.00628 9.36872C2.17038 9.53281 2.39294 9.625 2.625 9.625H7.875C8.10706 9.625 8.32962 9.53281 8.49372 9.36872C8.65781 9.20462 8.75 8.98206 8.75 8.75V3.0625L6.5625 0.875Z"
            stroke="#52C41A"
            strokeWidth="0.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.125 0.875V2.625C6.125 2.85706 6.21719 3.07962 6.38128 3.24372C6.54538 3.40781 6.76794 3.5 7 3.5H8.75"
            stroke="#52C41A"
            strokeWidth="0.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.9375 6.5625L4.8125 7.4375L6.5625 5.6875"
            stroke="#52C41A"
            strokeWidth="0.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Calc OK":
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 11 11"
        >
          <path
            d="M7.875 0.875H2.625C2.14175 0.875 1.75 1.26675 1.75 1.75V8.75C1.75 9.23325 2.14175 9.625 2.625 9.625H7.875C8.35825 9.625 8.75 9.23325 8.75 8.75V1.75C8.75 1.26675 8.35825 0.875 7.875 0.875Z"
            stroke="#1890FF"
            strokeWidth="0.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.5 2.625H7"
            stroke="#1890FF"
            strokeWidth="0.875"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function InputTab() {
  const data = dummyData;
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleViewClick = (id: string) => {
    console.log(`[InputTab] View clicked for invoice: ${id}`);
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    console.log(`[InputTab] Row selected: ${id}, Total selected: ${newSelected.size}`);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Table Card */}
      <Card className="border-0 rounded-2xl overflow-hidden">
        <CardHeader className="pb-0">
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-gray-100 p-2.5 rounded-xl gap-2">
              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
                  onClick={() => console.log("[InputTab] Pagination clicked")}
                >
                  20
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </Button>

                <input
                  type="text"
                  placeholder="Cari nama user"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    console.log(`[InputTab] Search: ${e.target.value}`)
                  }
                />

                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
                  onClick={() => console.log("[InputTab] Status filter clicked")}
                >
                  All Status
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 12"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.2884 10.1569L5.63137 4.49994L7.04537 3.08594L11.9954 8.03594L16.9454 3.08594L18.3594 4.49994L12.7024 10.1569C12.5148 10.3444 12.2605 10.4497 11.9954 10.4497C11.7302 10.4497 11.4759 10.3444 11.2884 10.1569Z"
                      fill="#332687"
                    />
                  </svg>
                </Button>

                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
                  onClick={() => console.log("[InputTab] Type filter clicked")}
                >
                  All Type
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 12"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.2884 10.1569L5.63137 4.49994L7.04537 3.08594L11.9954 8.03594L16.9454 3.08594L18.3594 4.49994L12.7024 10.1569C12.5148 10.3444 12.2605 10.4497 11.9954 10.4497C11.7302 10.4497 11.4759 10.3444 11.2884 10.1569Z"
                      fill="#332687"
                    />
                  </svg>
                </Button>

                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-gray-50 h-12 px-3 text-sm"
                  onClick={() => console.log("[InputTab] Filter clicked")}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.25 3.375C2.25 3.07663 2.36853 2.79048 2.5795 2.5795C2.79048 2.36853 3.07663 2.25 3.375 2.25H14.625C14.9234 2.25 15.2095 2.36853 15.4205 2.5795C15.6315 2.79048 15.75 3.07663 15.75 3.375V4.9395C15.7499 5.33729 15.5918 5.71876 15.3105 6L11.25 10.0605V15.6285C11.25 15.7691 11.2141 15.9075 11.1456 16.0303C11.0771 16.1531 10.9784 16.2564 10.8588 16.3304C10.7391 16.4043 10.6026 16.4465 10.4621 16.4528C10.3216 16.4591 10.1818 16.4294 10.056 16.3665L7.26825 14.973C7.11253 14.8951 6.98156 14.7755 6.89003 14.6274C6.79849 14.4793 6.75001 14.3086 6.75 14.1345V10.0605L2.6895 6C2.40818 5.71876 2.25008 5.33729 2.25 4.9395V3.375ZM3.75 3.75V4.9395L7.92 9.1095C8.02459 9.21396 8.10756 9.338 8.16418 9.47454C8.22081 9.61108 8.24997 9.75744 8.25 9.90525V13.7865L9.75 14.5365V9.90525C9.75 9.60675 9.8685 9.32025 10.08 9.11025L14.25 4.93875V3.75H3.75Z"
                      fill="#332687"
                    />
                  </svg>
                  Filter
                </Button>
              </div>

              <Button
                variant="outline"
                className="rounded-lg border-gray-300 bg-blue-50 h-12 px-3"
                onClick={() => console.log("[InputTab] More options clicked")}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 36 36">
                  <g clipPath="url(#clip0_1245_48707)">
                    <path
                      d="M8.75486 14.5938C7.14945 14.5938 5.83594 15.9073 5.83594 17.5127C5.83594 19.1181 7.14945 20.4316 8.75486 20.4316C10.3603 20.4316 11.6738 19.1181 11.6738 17.5127C11.6738 15.9073 10.3603 14.5938 8.75486 14.5938ZM26.2684 14.5938C24.663 14.5938 23.3495 15.9073 23.3495 17.5127C23.3495 19.1181 24.663 20.4316 26.2684 20.4316C27.8738 20.4316 29.1873 19.1181 29.1873 17.5127C29.1873 15.9073 27.8738 14.5938 26.2684 14.5938ZM17.5116 14.5938C15.9062 14.5938 14.5927 15.9073 14.5927 17.5127C14.5927 19.1181 15.9062 20.4316 17.5116 20.4316C19.117 20.4316 20.4305 19.1181 20.4305 17.5127C20.4305 15.9073 19.117 14.5938 17.5116 14.5938Z"
                      fill="#4318FF"
                    />
                  </g>
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(
                            new Set(data.input.map((item) => item.id))
                          );
                          console.log("[InputTab] All rows selected");
                        } else {
                          setSelectedRows(new Set());
                          console.log("[InputTab] All rows deselected");
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Nomor Faktur
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Tanggal
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    NPWP Supplier
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Supplier
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right">
                    DPP
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right">
                    PPN
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.input.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 1 ? "bg-white" : "bg-white"
                    } ${
                      item.docStatus === "missing"
                        ? "bg-red-50"
                        : item.calcStatus === "variance"
                          ? "bg-yellow-50"
                          : ""
                    }`}
                  >
                    <TableCell className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedRows.has(item.id)}
                        onChange={() => toggleSelectRow(item.id)}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-sm text-gray-900">
                      {item.nomorFaktur}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900">
                      {item.tanggal}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs text-gray-900">
                      {item.npwpSupplier}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-sm text-gray-900 font-medium">
                        {item.supplierName}
                      </div>
                      {item.poNumber && (
                        <div className="text-xs text-gray-500">
                          Matched: {item.poNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                      {formatCurrency(item.dpp)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                      {formatCurrency(item.ppn)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          className={`${getStatusBadgeColor(
                            item.status
                          )} border rounded-lg flex items-center gap-1`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status}
                        </Badge>
                        {item.variancePercent && (
                          <Badge className="bg-orange-100 border-orange-500 text-orange-700 border rounded-lg flex items-center gap-1">
                            Variance {item.variancePercent}%
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(item.id)}
                        className="hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
