import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface DeliverableItemProps {
  id: string;
  title: string;
  subtitle: string;
}

export function DeliverableItem({ id, title, subtitle }: DeliverableItemProps) {
  return (
    <div className="flex items-center justify-between rounded-[20px] bg-[#F4F7FE] p-2.5">
      <div className="flex items-center gap-2.5 py-2.5">
        <FileText className="h-12 w-12 text-[#332687]" strokeWidth={1.5} />
        <div className="flex flex-col justify-center">
          <div className="font-roboto text-[22px] font-bold leading-7 tracking-0 text-[#2B3674]">
            {id}
          </div>
          <div className="flex flex-col items-start">
            <div className="w-28 font-roboto text-base font-semibold leading-6 tracking-[0.15px] text-[#4A4459]">
              {title}
            </div>
            <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        className="h-[42px] gap-1 rounded-[5px] border border-[#CAC4D0] bg-white px-3 py-1.5"
      >
        <Download className="h-6 w-6 text-[#404040]" />
        <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
          Download
        </span>
      </Button>
    </div>
  );
}
