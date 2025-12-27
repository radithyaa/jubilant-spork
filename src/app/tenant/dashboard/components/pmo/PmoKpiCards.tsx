import { Card } from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BellRing,
  CheckCircle2,
} from "lucide-react";

const iconMap = {
  project: LayoutDashboard,
  users: Users,
  trending: TrendingUp,
  bell: BellRing,
  check: CheckCircle2,
};

interface KpiCardData {
  icon: keyof typeof iconMap;
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  changeColor: string;
}

interface PmoKpiCardsProps {
  data: KpiCardData[];
}

export function PmoKpiCards({ data }: PmoKpiCardsProps) {
  return (
    <div className="flex gap-[30px]">
      {data.map((card, idx) => {
        const Icon = iconMap[card.icon];
        return (
          <Card
            key={idx}
            className="flex h-[97px] flex-1 items-center gap-[18px] rounded-[20px] border-none bg-white p-6 shadow-sm"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[28px] bg-[#F4F7FE]">
              <Icon className="h-[30px] w-[30px] text-[#332687]" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-6 tracking-[-0.28px] text-[#A3AED0]">
                {card.label}
              </p>
              <p className="text-2xl font-bold leading-8 tracking-[-0.48px] text-[#0B1437]">
                {card.value}
              </p>
              <div className="flex items-center gap-1 text-xs leading-5 tracking-[-0.24px]">
                <span className={`font-bold ${card.changeColor}`}>{card.change}</span>
                <span className="font-normal text-[#A3AED0]">{card.changeLabel}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
