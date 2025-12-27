import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye } from 'lucide-react';

interface Milestone {
  name: string;
  status: 'done' | 'in-progress' | 'not-started';
}

interface ProjectProgressCardProps {
  id: string;
  companyName: string;
  team: string;
  milestones: Milestone[];
  nextMilestone: string;
  progress: number;
}

export function ProjectProgressCard({
  id,
  companyName,
  team,
  milestones,
  nextMilestone,
  progress,
}: ProjectProgressCardProps) {
  const getMilestoneColor = (status: string) => {
    if (status === 'done') return 'bg-[#CFF7D3] text-[#4A4459]';
    if (status === 'in-progress') return 'bg-[#332687] text-white';
    return 'bg-[#CDCDCD] text-[#4A4459]';
  };

  return (
    <Card className="flex flex-col justify-center gap-5 rounded-[20px] border border-[#D9D9D9] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]">
      <div className="flex flex-col justify-center gap-2.25">
        <div className="font-roboto text-base font-bold leading-6 tracking-[0.15px] text-[#2B3674]">
          {id}
        </div>
        <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
          {companyName}
        </div>
        <div className="font-roboto text-xs font-bold leading-4 tracking-[0.4px] text-[#2B3674]">
          Team: {team}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {milestones.map((milestone, idx) => (
          <Badge
            key={idx}
            className={`rounded-[50px] px-3 py-1.5 text-sm font-medium leading-5 tracking-[0.1px] ${getMilestoneColor(milestone.status)}`}
          >
            {milestone.name}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <Calendar className="h-6 w-6 text-[#332687]" />
        <div className="font-roboto text-sm font-bold leading-5 tracking-[0.25px] text-[#2B3674]">
          Next: {nextMilestone}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex flex-1 flex-col justify-center gap-5">
          <div className="flex items-center justify-between">
            <div className="font-inter text-sm font-normal text-[#6E7184]">
              Progress
            </div>
            <div className="font-inter text-xs font-normal text-[#9C9EAA]">
              {progress}%
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="h-2.5 w-full bg-[#A3AED0]" />
            <div
              className="h-2.5 bg-[#332687]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-1 rounded-[5px] border border-[#CAC4D0] bg-white px-3 py-1.5"
        >
          <Eye className="h-6 w-6 text-[#332687]" />
          <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
            View
          </span>
        </Button>
      </div>
    </Card>
  );
}
