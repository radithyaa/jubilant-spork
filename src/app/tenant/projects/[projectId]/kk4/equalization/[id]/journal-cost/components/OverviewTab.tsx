'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pphPasalData } from "../data";

export default function OverviewTab() {
  return (
    <div className="mt-6 space-y-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          4.2.3.1 Summary by PPh Pasal
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Overview of withholding compliance across different tax articles
        </p>
      </div>

      <div className="space-y-4">
        {pphPasalData.map((pasal) => (
          <Card key={pasal.id} className="border border-slate-200">
            <CardContent className="pt-6">
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-3">
                    <Badge
                      style={{
                        backgroundColor: pasal.badgeColor,
                        borderColor: pasal.badgeBorderColor,
                        color: pasal.badgeTextColor,
                        border: "1px solid",
                      }}
                      className="font-medium"
                      variant="outline"
                    >
                      {pasal.badge}
                    </Badge>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {pasal.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {pasal.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {pasal.buktiPotong.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {pasal.buktiPotong.value}
                      </p>
                      <p className="text-xs text-slate-500">
                        {pasal.buktiPotong.subText}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {pasal.expected.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {pasal.expected.value}
                      </p>
                      <p className="text-xs text-slate-500">
                        {pasal.expected.subText}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {pasal.variance.label}
                      </p>
                      <p
                        className="mt-1 text-lg font-bold"
                        style={{ color: pasal.variance.color }}
                      >
                        {pasal.variance.value}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-xs text-center text-slate-500">
                      Matched
                    </p>
                    <p className="text-center text-2xl font-bold text-green-600">
                      {pasal.matched}
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-xs text-center text-slate-500">
                      Missing
                    </p>
                    <p className="text-center text-2xl font-bold text-red-600">
                      {pasal.missing}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
