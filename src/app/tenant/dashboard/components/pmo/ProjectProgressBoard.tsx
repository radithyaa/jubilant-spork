"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Eye, Calendar } from "lucide-react";

interface ProjectData {
  id: string;
  client: string;
  team: string;
  milestones: Array<{
    name: string;
    status: "done" | "in-progress" | "not-started";
  }>;
  nextMilestone: {
    name: string;
    date: string;
  };
  progress: number;
}

interface ProjectProgressBoardProps {
  data: {
    summary: {
      notStarted: number;
      inProgress: number;
      completed: number;
      overdue: number;
    };
    projects: ProjectData[];
  };
}

const statusColors = {
  done: "bg-[#CFF7D3] text-[#4A4459]",
  "in-progress": "bg-[#332687] text-white",
  "not-started": "bg-[#CDCDCD] text-[#4A4459]",
};

export function ProjectProgressBoard({ data }: ProjectProgressBoardProps) {
  return (
    <Card className="rounded-[20px] border-none bg-white p-[30px] shadow-sm">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
              Proyek Progress Board
            </h2>
            <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">
              Realtime status berbagai proyek dengan milestone board
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-[37px] w-[37px] rounded-[10px] bg-[#F4F7FE]">
            <MoreHorizontal className="h-6 w-6 text-[#4318FF]" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-5">
          <div className="flex flex-1 flex-col items-center justify-center gap-[5px] rounded-[20px] bg-[#EADDFF] p-5">
            <span className="text-[32px] font-semibold leading-[120%] tracking-[-0.64px] text-[#4A4459]">
              {data.summary.notStarted}
            </span>
            <span className="text-sm font-medium leading-5 tracking-[0.1px] text-[#4A4459]">
              Not Started
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[5px] rounded-[20px] bg-[#FFF1C2] p-5">
            <span className="text-[32px] font-semibold leading-[120%] tracking-[-0.64px] text-[#4A4459]">
              {data.summary.inProgress}
            </span>
            <span className="text-sm font-medium leading-5 tracking-[0.1px] text-[#4A4459]">
              In Progress
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[5px] rounded-[20px] bg-[#CFF7D3] p-5">
            <span className="text-[32px] font-semibold leading-[120%] tracking-[-0.64px] text-[#4A4459]">
              {data.summary.completed}
            </span>
            <span className="text-sm font-medium leading-5 tracking-[0.1px] text-[#4A4459]">
              Completed
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[5px] rounded-[20px] bg-[#EC221F] p-5">
            <span className="text-[32px] font-semibold leading-[120%] tracking-[-0.64px] text-white">
              {data.summary.overdue}
            </span>
            <span className="text-sm font-medium leading-5 tracking-[0.1px] text-white">Overdue</span>
          </div>
        </div>

        {/* Project Cards */}
        <div className="flex flex-col gap-[10px]">
          {data.projects.map((project) => (
            <Card
              key={project.id}
              className="rounded-[20px] border border-[#D9D9D9] bg-white p-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col gap-5">
                {/* Project Info */}
                <div className="flex flex-col gap-[9px]">
                  <p className="text-base font-bold leading-6 tracking-[0.15px] text-[#2B3674]">
                    {project.id}
                  </p>
                  <p className="text-xs leading-4 tracking-[0.4px] text-[#2B3674]">
                    {project.client}
                  </p>
                  <p className="text-xs font-bold leading-4 tracking-[0.4px] text-[#2B3674]">
                    Team: {project.team}
                  </p>
                </div>

                {/* Milestones */}
                <div className="flex flex-wrap items-center gap-[10px]">
                  {project.milestones.map((milestone, idx) => (
                    <Badge
                      key={idx}
                      className={`rounded-full px-3 py-[6px] text-sm font-medium leading-5 tracking-[0.1px] ${statusColors[milestone.status]}`}
                    >
                      {milestone.name}
                    </Badge>
                  ))}
                </div>

                {/* Next Milestone */}
                <div className="flex items-center gap-[10px]">
                  <Calendar className="h-6 w-6 text-[#332687]" />
                  <p className="text-sm font-bold leading-5 tracking-[0.25px] text-[#2B3674]">
                    Next: {project.nextMilestone.name} ({project.nextMilestone.date})
                  </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-5">
                  <div className="flex flex-1 flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm leading-normal text-[#6E7184]">Progress</span>
                      <span className="text-xs leading-normal text-[#9C9EAA]">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-[10px]" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-[5px] border-[#CAC4D0]"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
