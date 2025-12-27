'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summaryStats } from "../data";

export default function SummaryCard() {
  const stats = [
    {
      label: "Total Transactions",
      value: summaryStats.totalTransactions.toString(),
      bgGradient: "from-blue-50 to-cyan-50",
      textColor: "text-slate-900",
      labelColor: "text-slate-500",
    },
    {
      label: "Compliant",
      value: summaryStats.compliant.toString(),
      bgGradient: "from-green-50 to-emerald-50",
      textColor: "text-green-600",
      labelColor: "text-slate-500",
    },
    {
      label: "Missing Bukpot",
      value: summaryStats.missingBukpot.toString(),
      bgGradient: "from-red-50 to-rose-50",
      textColor: "text-red-600",
      labelColor: "text-slate-500",
    },
    {
      label: "Under/Over",
      value: summaryStats.underOver.toString(),
      bgGradient: "from-amber-50 to-yellow-50",
      textColor: "text-orange-600",
      labelColor: "text-slate-500",
    },
    {
      label: "Variance",
      value: summaryStats.variance,
      bgGradient: "from-purple-50 to-violet-50",
      textColor: "text-purple-600",
      labelColor: "text-slate-500",
    },
  ];

  return (
    <div className="flex gap-[30px]">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex-1 rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-4 shadow-sm border border-slate-200/50`}
        >
          <div className="space-y-2">
            <p className={`text-xs font-medium ${stat.labelColor}`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
