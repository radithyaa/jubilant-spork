import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description: string;
  iconBgColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconBgColor = 'bg-[#F4F7FE]',
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-[18px] rounded-[20px] bg-white px-5 py-1.5">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-[28px] ${iconBgColor}`}
      >
        <Icon className="h-[30px] w-[30px] text-[#332687]" strokeWidth={1.5} />
      </div>
      <div className="flex w-[194px] flex-col">
        <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#A3AED0]">
          {label}
        </div>
        <div className="font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#0B1437]">
          {value}
        </div>
        <div className="font-dm-sans text-xs font-normal leading-5 tracking-[-0.24px] text-[#A3AED0]">
          {description}
        </div>
      </div>
    </Card>
  );
}
