import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle } from 'lucide-react';

interface AlertCardProps {
  priority: 'urgent' | 'medium' | 'low';
  type: string;
  dueDate: string;
  title: string;
  description: string;
}

export function AlertCard({
  priority,
  type,
  dueDate,
  title,
  description,
}: AlertCardProps) {
  const borderColor =
    priority === 'urgent' ? 'border-l-[#C00F0C]' : 'border-l-[#C00F0C]';
  const bgColor = priority === 'urgent' ? 'bg-[#FEF2F2]' : 'bg-[#FFF7ED]';

  return (
    <Card
      className={`flex flex-col items-start gap-4 rounded-[20px] border-l-[5px] ${borderColor} ${bgColor} p-5`}
    >
      <div className="flex flex-col justify-center gap-2.5 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {priority === 'urgent' ? (
              <FileText className="h-9 w-9 text-[#332687]" />
            ) : (
              <CheckCircle className="h-[30px] w-[30px] text-[#332687]" />
            )}
            <Badge className="rounded-[5px] border border-[#CAC4D0] bg-transparent px-3 py-1.5 text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
              {type}
            </Badge>
          </div>
          <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
            Due: {dueDate}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1.25">
          <div className="font-roboto text-base font-bold leading-6 tracking-[0.15px] text-[#2B3674]">
            {title}
          </div>
          <div className="font-roboto text-sm font-normal leading-6 tracking-[0.4px] text-[#2B3674]">
            {description}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 self-stretch">
        {priority === 'urgent' ? (
          <>
            <Button
              variant="outline"
              className="h-[30px] rounded-[5px] border border-[#CAC4D0] bg-white px-[15px]"
            >
              <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
                Detail
              </span>
            </Button>
            <Button className="rounded-[5px] bg-[#08F] px-[15px] text-white hover:bg-[#08F]/90">
              <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px]">
                Upload
              </span>
            </Button>
          </>
        ) : (
          <>
            <Button className="rounded-[5px] bg-[#08F] px-[15px] text-white hover:bg-[#08F]/90">
              <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px]">
                Upload
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-[30px] rounded-[5px] border border-[#CAC4D0] bg-white px-[15px]"
            >
              <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
                Detail
              </span>
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
