'use client';

import { Card, CardContent } from "@/components/ui/card";
import { summaryCardsData } from "../data";

export default function StatsCard() {
  return (
    <div className="grid grid-cols-4 gap-[20px]">
      {summaryCardsData.map((card) => (
        <Card
          key={card.id}
          className={`border ${
            card.bgColor === "bg-yellow-50"
              ? "border-yellow-300 bg-yellow-50"
              : "border-slate-200"
          }`}
        >
          <CardContent className="p-[24px]">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-slate-500">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-slate-600">
                {card.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
