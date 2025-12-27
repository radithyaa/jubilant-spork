import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <Card className="flex flex-1 items-center gap-[18px] rounded-[20px] bg-white px-5 py-1.5">
      <div className="flex h-14 w-14 items-center justify-center rounded-[28px] bg-[#F4F7FE]">
        <Icon className="h-[35px] w-[35px] text-[#332687]" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col justify-center gap-2.25">
        <div className="font-roboto text-base font-bold leading-6 tracking-[0.15px] text-[#2B3674]">
          {label}
        </div>
        <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
          {value}
        </div>
      </div>
    </Card>
  );
}
