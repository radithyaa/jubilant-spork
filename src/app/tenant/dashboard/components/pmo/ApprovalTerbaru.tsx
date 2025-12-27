"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, CheckCheck } from "lucide-react";

interface ApprovalItem {
  id: string;
  type: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  title: string;
  client: string;
  assignee: {
    name: string;
    initials: string;
  };
}

interface ApprovalTerbaruProps {
  data: ApprovalItem[];
}

const priorityColors = {
  High: "bg-[#CFF7D3] text-[#4A4459]",
  Medium: "bg-[#CFF7D3] text-[#4A4459]",
  Low: "bg-[#CFF7D3] text-[#4A4459]",
};

const typeColors = {
  "Form 1.0": "bg-[#E8DEF8] text-[#4A4459]",
  KK1: "bg-[#1AE177] text-white",
};

export function ApprovalTerbaru({ data }: ApprovalTerbaruProps) {
  return (
    <Card className="w-[550px] rounded-[30px] border-none bg-white p-[30px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]">
      <div className="flex flex-col gap-[10px]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
              Approval Terbaru
            </h2>
            <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">
              Item menunggu persetujuan Anda
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-[37px] w-[37px] rounded-[10px] bg-[#F4F7FE]">
            <MoreHorizontal className="h-6 w-6 text-[#4318FF]" />
          </Button>
        </div>

        {/* Approval Items */}
        <div className="flex flex-col gap-[10px]">
          {data.map((item) => (
            <Card
              key={item.id}
              className="rounded-[20px] border border-[#D9D9D9] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col gap-[10px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <Badge
                      className={`rounded-full px-3 py-[6px] text-sm font-medium leading-5 tracking-[0.1px] ${typeColors[item.type as keyof typeof typeColors] || "bg-[#E8DEF8] text-[#4A4459]"}`}
                    >
                      {item.type}
                    </Badge>
                    <Badge
                      className={`rounded-full px-3 py-[6px] text-sm font-medium leading-5 tracking-[0.1px] ${priorityColors[item.priority]}`}
                    >
                      {item.priority}
                    </Badge>
                    <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">
                      Due: {item.dueDate}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-[5px] border-[#CAC4D0] bg-white px-3 py-[6px] text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]"
                  >
                    {item.id}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-[5px]">
                  <p className="text-xs font-bold leading-4 tracking-[0.4px] text-[#2B3674]">
                    {item.title}
                  </p>
                  <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">{item.client}</p>
                  <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">
                    Assignee: {item.assignee.name}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-[10px]">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 rounded-[5px] border-[#CAC4D0]"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" className="gap-1 rounded-[5px] bg-[#08F] text-white">
                      <CheckCheck className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" className="rounded-[5px] bg-[#E8B931] text-white">
                      Request Change
                    </Button>
                  </div>
                  <Avatar className="h-[30px] w-[30px] rounded-full bg-[#4F46E5]">
                    <AvatarFallback className="bg-[#4F46E5] text-sm text-white">
                      {item.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
