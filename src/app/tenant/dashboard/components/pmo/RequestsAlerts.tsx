"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCheck } from "lucide-react";

interface AlertItem {
  count: number;
  label: string;
  action: string;
  actionColor: string;
}

interface RequestsAlertsProps {
  data: AlertItem[];
}

const actionColors = {
  blue: "bg-[#08F]",
  red: "bg-[#C00F0C]",
  green: "bg-[#009951]",
  purple: "bg-[#332687]",
};

export function RequestsAlerts({ data }: RequestsAlertsProps) {
  return (
    <Card className="w-[550px] rounded-[30px] border-none bg-white p-[30px]">
      <div className="flex flex-col gap-[10px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
              Requests & Alerts
            </h2>
            <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">
              Item menunggu respon Anda
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-[37px] w-[37px] rounded-[10px] bg-[#F4F7FE]">
            <MoreHorizontal className="h-6 w-6 text-[#4318FF]" />
          </Button>
        </div>

        {/* Alert Items */}
        <div className="flex flex-col gap-[21px]">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-[20px] bg-[#F9FAFB] p-[10px]"
            >
              <div className="flex items-center gap-[10px] py-[10px]">
                <span className="w-[25px] text-center text-[32px] font-semibold leading-[120%] tracking-[-0.64px] text-[#4A4459]">
                  {item.count}
                </span>
                <span className="w-[112px] text-sm font-medium leading-5 tracking-[0.1px] text-[#4A4459]">
                  {item.label}
                </span>
              </div>
              <Button
                size="sm"
                className={`h-[42px] rounded-[5px] text-white ${actionColors[item.actionColor as keyof typeof actionColors]}`}
              >
                {item.action === "Approve" && <CheckCheck className="mr-1 h-4 w-4" />}
                {item.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
