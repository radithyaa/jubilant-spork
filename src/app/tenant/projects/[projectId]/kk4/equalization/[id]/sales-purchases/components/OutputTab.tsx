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
import {
  ShoppingCart,
  Trash2,
  AlertCircle,
  Eye,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calculator,
  Star,
} from "lucide-react";
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
      return <FileText className="w-4 h-4" />;
    case "Calc OK":
      return <Calculator className="w-4 h-4" />;
    case "Doc Missing":
      return <AlertCircle className="w-4 h-4" />;
    case "No Match":
      return <AlertTriangle className="w-4 h-4" />;
    case "Doc Incomplete":
      return <FileText className="w-4 h-4" />;
    default:
      return null;
  }
};

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  stats: {
    complete: number;
    partial: number;
    missing: number;
    matchCount: number;
    varianceCount: number;
    mismatchCount: number;
    fullyMatched: number;
    totalRecords: number;
    aiSuggestions: number;
  };
  gradient: string;
  textColor: string;
  badgeColor: string;
}

function SummaryCard({
  title,
  amount,
  icon,
  stats,
  gradient,
  textColor,
  badgeColor,
}: SummaryCardProps) {
  return (
    <Card
      className={`${gradient} border-0 rounded-2xl`}
      style={{
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center`}
              style={{
                backgroundColor: textColor === "#007A55" ? "#D0FAE5" : "#FFE2E2",
              }}
            >
              {icon}
            </div>
            <Badge className={`${badgeColor} border-0 text-xs font-medium`}>
              {title}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total PPN {title}</p>
            <p className={`text-xl font-bold`} style={{ color: textColor }}>
              {formatCurrency(amount)}
            </p>
          </div>

          <div className="pt-2 border-t border-white/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">Document Status</p>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Complete:</span>
                    <span className="text-xs font-semibold">{stats.complete}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Partial:</span>
                    <span className="text-xs font-semibold text-orange-600">
                      {stats.partial}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Missing:</span>
                    <span className="text-xs font-semibold text-red-600">
                      {stats.missing}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-medium">Calculation Status</p>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Match:</span>
                    <span className="text-xs font-semibold">{stats.matchCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Variance:</span>
                    <span className="text-xs font-semibold text-orange-600">
                      {stats.varianceCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Mismatch:</span>
                    <span className="text-xs font-semibold text-red-600">
                      {stats.mismatchCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/30">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-medium">Fully Matched:</span>
              <span
                className="text-xs font-bold"
                style={{ color: textColor }}
              >
                {stats.fullyMatched}/{stats.totalRecords}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-3 h-3" style={{ color: textColor }} />
              <span className="text-xs text-gray-600 font-medium">AI Suggestions:</span>
              <span className="text-xs font-semibold text-purple-600">
                {stats.aiSuggestions}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OutputTab() {
  const data = dummyData;
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleViewClick = (id: string) => {
    console.log(`[OutputTab] View clicked for invoice: ${id}`);
  };

  const handleResolveClick = (id: string) => {
    console.log(`[OutputTab] Resolve clicked for invoice: ${id}`);
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    console.log(`[OutputTab] Row selected: ${id}, Total selected: ${newSelected.size}`);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6">
        <SummaryCard
          title="Keluaran"
          amount={data.summary.totalPpnKeluaran}
          icon={<ShoppingCart className="w-4 h-4" style={{ color: "#009966" }} />}
          stats={data.summary.outputStats}
          gradient="bg-gradient-to-br from-green-50 to-green-100"
          textColor="#007A55"
          badgeColor="bg-green-200 text-green-800"
        />
        <SummaryCard
          title="Masukan"
          amount={data.summary.totalPpnMasukan}
          icon={<Trash2 className="w-4 h-4" style={{ color: "#E7000B" }} />}
          stats={data.summary.inputStats}
          gradient="bg-gradient-to-br from-red-50 to-red-100"
          textColor="#C10007"
          badgeColor="bg-red-200 text-red-800"
        />
      </div>

      {/* Table Header Card */}
      <Card className="border-0 rounded-2xl overflow-hidden">
        <CardHeader className="pb-0">
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-gray-100 p-2.5 rounded-xl gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
                  onClick={() => console.log("[OutputTab] Pagination clicked")}
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
                    console.log(`[OutputTab] Search: ${e.target.value}`)
                  }
                />

                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
                  onClick={() => console.log("[OutputTab] Status filter clicked")}
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
                  onClick={() => console.log("[OutputTab] Type filter clicked")}
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
                  onClick={() => console.log("[OutputTab] Filter clicked")}
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
                onClick={() => console.log("[OutputTab] More options clicked")}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 36 36"
                >
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
                            new Set(data.output.map((item) => item.id))
                          );
                          console.log("[OutputTab] All rows selected");
                        } else {
                          setSelectedRows(new Set());
                          console.log("[OutputTab] All rows deselected");
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
                {data.output.map((item, index) => (
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
                      {item.isImported && (
                        <Badge className="ml-2 bg-purple-100 text-purple-700 border-0">
                          Import
                        </Badge>
                      )}
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
                          {item.poNumber}
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

      {/* Require Action Section */}
      <Card className="border-orange-300 bg-orange-50 rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">
                {data.requireAction.length} Faktur Require Action
              </h3>
              <p className="text-sm text-orange-700">
                Review items with document or calculation issues • 2 have AI
                suggestions
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.requireAction.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {item.nomorFaktur}
                  </span>
                  <span className="text-sm text-gray-600">{item.supplierName}</span>
                  {item.aiReady && (
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                      AI Ready
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    className={`${getStatusBadgeColor(
                      item.status
                    )} border rounded-md text-xs`}
                  >
                    {getStatusIcon(item.status)}
                    {item.status}
                  </Badge>
                  {item.docStatus === "complete" && (
                    <Badge className="bg-green-100 border-green-500 text-green-700 border rounded-md text-xs">
                      Doc OK
                    </Badge>
                  )}
                  {item.docStatus === "partial" && (
                    <Badge className="bg-yellow-100 border-yellow-500 text-yellow-700 border rounded-md text-xs">
                      Doc Incomplete
                    </Badge>
                  )}
                  {item.docStatus === "missing" && (
                    <Badge className="bg-red-100 border-red-500 text-red-700 border rounded-md text-xs">
                      Doc Missing
                    </Badge>
                  )}
                  {item.calcStatus === "variance" && (
                    <Badge className="bg-orange-100 border-orange-500 text-orange-700 border rounded-md text-xs">
                      Variance {item.variancePercent}%
                    </Badge>
                  )}
                </div>
                {item.notes && (
                  <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.ppn)}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => handleResolveClick(item.id)}
                >
                  Resolve
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
