import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, CheckCheck } from 'lucide-react';

interface ApprovalQueueItemProps {
  id: string;
  formType: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  title: string;
  company: string;
  assignee: string;
  assigneeInitials: string;
}

export function ApprovalQueueItem({
  id,
  formType,
  priority,
  dueDate,
  title,
  company,
  assignee,
  assigneeInitials,
}: ApprovalQueueItemProps) {
  const getPriorityColor = () => {
    if (priority === 'high') return 'bg-[#CFF7D3] text-[#4A4459]';
    if (priority === 'medium') return 'bg-[#CFF7D3] text-[#4A4459]';
    return 'bg-gray-200 text-gray-800';
  };

  const getFormTypeBg = () => {
    if (formType === 'Form 1.0') return 'bg-[#E8DEF8] text-[#4A4459]';
    if (formType === 'KK1') return 'bg-[#1AE177] text-white';
    return 'bg-[#E8DEF8] text-[#4A4459]';
  };

  return (
    <Card className="flex flex-col justify-center gap-2.5 rounded-[20px] border border-[#D9D9D9] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Badge
            className={`rounded-[50px] px-3 py-1.5 text-sm font-medium leading-5 tracking-[0.1px] ${getFormTypeBg()}`}
          >
            {formType}
          </Badge>
          <Badge
            className={`rounded-[50px] px-3 py-1.5 text-sm font-medium leading-5 tracking-[0.1px] ${getPriorityColor()}`}
          >
            {priority === 'high' && 'High'}
            {priority === 'medium' && 'Medium'}
            {priority === 'low' && 'Low'}
          </Badge>
          <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
            Due: {dueDate}
          </div>
        </div>
        <div className="flex items-center justify-center rounded-[5px] border border-[#CAC4D0] bg-white px-3 py-1.5">
          <div className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
            {id}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-1.25">
        <div className="font-roboto text-xs font-bold leading-4 tracking-[0.4px] text-[#2B3674]">
          {title}
        </div>
        <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
          {company}
        </div>
        <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
          Assignee: {assignee}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2.5">
          <Button
            variant="outline"
            className="gap-1 rounded-[5px] border border-[#CAC4D0] bg-white px-3 py-1.5"
          >
            <Eye className="h-6 w-6 text-[#332687]" />
            <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
              View
            </span>
          </Button>
          <Button className="gap-1 rounded-[5px] bg-[#08F] px-3 py-1.5 text-white hover:bg-[#08F]/90">
            <CheckCheck className="h-6 w-6" />
            <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px]">
              Approve
            </span>
          </Button>
          <Button className="rounded-[5px] bg-[#E8B931] px-3 py-1.5 text-white hover:bg-[#E8B931]/90">
            <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px]">
              Request Change
            </span>
          </Button>
        </div>
        <Avatar className="h-[30px] w-[30px] rounded-[50px] bg-[#4F46E5]">
          <AvatarFallback className="bg-[#4F46E5] font-dm-sans text-sm font-normal text-white">
            {assigneeInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </Card>
  );
}
