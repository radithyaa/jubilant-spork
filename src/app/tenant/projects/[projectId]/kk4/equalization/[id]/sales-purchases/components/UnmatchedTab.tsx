"use client";

import { dummyData } from "../data/dummy";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function UnmatchedTab() {
  const data = dummyData;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleViewClick = (id: string) => {
    console.log(`[UnmatchedTab] View clicked for invoice: ${id}`);
  };

  const handleGenerateFaktur = (id: string) => {
    console.log(`[UnmatchedTab] Generate Faktur clicked for invoice: ${id}`);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
    console.log(`[UnmatchedTab] Item expanded: ${id}`);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Header Card */}
      <Card className="border-0 rounded-2xl bg-gray-50">
        <CardHeader>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Invoices Without Faktur Pajak
            </h2>
            <p className="text-sm text-gray-600">
              Transactions that need faktur pajak to be created or attached
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-gray-100 p-2.5 rounded-xl gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="outline"
            className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
            onClick={() => console.log("[UnmatchedTab] Pagination clicked")}
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
              console.log(`[UnmatchedTab] Search: ${e.target.value}`)
            }
          />

          <Button
            variant="outline"
            className="rounded-lg border-gray-300 bg-white h-12 px-3 text-sm"
            onClick={() =>
              console.log("[UnmatchedTab] Status filter clicked")
            }
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
            onClick={() => console.log("[UnmatchedTab] Type filter clicked")}
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
            onClick={() => console.log("[UnmatchedTab] Filter clicked")}
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
          onClick={() => console.log("[UnmatchedTab] More options clicked")}
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

      {/* Unmatched Items List */}
      <div className="space-y-3">
        {data.unmatched.map((item) => (
          <Card
            key={item.id}
            className="border-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="flex items-stretch">
                {/* Left colored indicator */}
                <div
                  className={`w-2 ${
                    item.status === "pending" ? "bg-green-500" : "bg-blue-500"
                  }`}
                />

                {/* Main content */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-green-100 text-green-800 border-0 text-xs font-medium">
                        {item.invoiceNumber.split(" - ")[0]}
                      </Badge>
                      <h3 className="font-semibold text-gray-900">
                        {item.supplierName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{item.tanggal}</span>
                      <span className="text-xs">
                        {item.invoiceNumber.split(" - ")[1]}
                      </span>
                      <span className="text-xs">
                        Amount: {formatCurrency(item.totalAmount)}
                      </span>
                      {item.ppnAmount > 0 && (
                        <span className="text-xs">
                          PPN: {formatCurrency(item.ppnAmount)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {/* Amount */}
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.invoiceAmount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.invoiceAmount === "Rp 127.650.000"
                          ? "0.000.000"
                          : "0.000.000"}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs"
                        onClick={() => handleViewClick(item.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => handleGenerateFaktur(item.id)}
                      >
                        Generate FP
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable details section */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full px-4 py-2 bg-gray-50 border-t hover:bg-gray-100 transition-colors text-xs text-gray-600 text-left"
              >
                {expandedItems.has(item.id) ? "Hide details" : "Show details"}
                <svg
                  className={`w-4 h-4 float-right transition-transform ${
                    expandedItems.has(item.id) ? "rotate-180" : ""
                  }`}
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
              </button>

              {expandedItems.has(item.id) && (
                <div className="px-4 py-3 bg-gray-50 text-xs text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Invoice Number:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {item.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      className={`${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      } border-0 text-xs`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
