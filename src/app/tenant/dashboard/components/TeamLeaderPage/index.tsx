'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Bell,
  CheckCircle2,
  TrendingUp,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ProjectCard } from './ProjectCard';
import { ApprovalQueueItem } from './ApprovalQueueItem';
import {
  teamLeaderStats,
  projectTabs,
  myProjects,
  approvalQueue,
  projectsTable,
} from './data';

export function TeamLeaderPage() {
  return (
    <div className="flex flex-col gap-[30px] px-10 py-0">
      {/* Header */}
      <div className="flex flex-col gap-1.25">
        <div className="font-dm-sans text-sm font-medium leading-6 text-[#707EAE]">
          Dashboard
        </div>
        <div className="font-dm-sans text-[34px] font-bold leading-[42px] tracking-[-0.68px] text-[#0B1437]">
          Dashboard Ketua Tim
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-[30px]">
        <StatCard
          icon={FileText}
          label="Total Tugas Tim"
          value={teamLeaderStats.totalTasks}
          description="Across all modul on projects"
        />
        <StatCard
          icon={Bell}
          label="Menunggu Approval"
          value={teamLeaderStats.pendingApproval}
          description="Butuh peninjauan"
        />
        <StatCard
          icon={CheckCircle2}
          label="Tugas Overdue"
          value={teamLeaderStats.overdueTasks}
          description="Butuh perhatian khusus"
        />
        <StatCard
          icon={TrendingUp}
          label="Utilitas Tim"
          value={`${teamLeaderStats.teamUtility}%`}
          description="Active capacity"
        />
      </div>

      <div className="flex gap-[30px]">
        {/* Proyek Saya Section */}
        <div className="flex flex-1 flex-col gap-[30px] rounded-[20px] bg-white p-[30px]">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
                  Proyek Saya
                </div>
                <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
                  Daftar proyek yang ditugaskan kepada Anda
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-[37px] w-[37px] rounded-[10px] bg-[#F4F7FE]"
              >
                <MoreHorizontal className="h-6 w-6 text-[#4318FF]" />
              </Button>
            </div>

            <Tabs defaultValue="form-1-0" className="w-full">
              <TabsList className="h-auto w-full justify-start rounded-[100px] bg-[#F8FAFC] p-5">
                {projectTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-1 rounded-[100px] px-[15px] py-[3px] data-[state=active]:bg-white data-[state=active]:shadow-none"
                  >
                    <span className="font-public-sans text-sm font-semibold leading-[22px] text-[#757575]">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2.5">
            {myProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>

        {/* Approval Queue */}
        <div className="flex w-[550px] flex-col gap-2.5 rounded-[30px] bg-white p-[30px] shadow-[0_2px_2px_0_rgba(0,0,0,0.15)]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
                Approval Queue
              </div>
              <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
                Item menunggu persetujuan Anda
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-[37px] w-[37px] rounded-[10px] bg-[#F4F7FE]"
            >
              <MoreHorizontal className="h-6 w-6 text-[#4318FF]" />
            </Button>
          </div>

          {approvalQueue.map((item) => (
            <ApprovalQueueItem key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <Card className="flex flex-col gap-[50px] rounded-[20px] bg-white p-[30px]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
              Proyek Saya
            </div>
            <div className="font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
              Daftar proyek yang ditugaskan kepada Anda
            </div>
          </div>
          <div className="flex w-[666px] items-center justify-end gap-5">
            <Button
              variant="outline"
              className="gap-1 rounded-[10px] border border-[#CAC4D0] bg-white px-[3px]"
            >
              <span className="px-3 py-1.5 font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
                All Status
              </span>
              <ChevronDown className="h-6 w-3 text-[#332687]" />
            </Button>
            <Button
              variant="outline"
              className="gap-1 rounded-[10px] border border-[#CAC4D0] bg-[#F9FAFB] px-[3px]"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3 4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H19.5C19.8978 3 20.2794 3.15804 20.5607 3.43934C20.842 3.72064 21 4.10218 21 4.5V6.586C20.9999 7.11639 20.7891 7.62501 20.414 8L15 13.414V20.838C15 21.0255 14.9521 21.2099 14.8608 21.3737C14.7695 21.5375 14.6379 21.6753 14.4783 21.7739C14.3188 21.8724 14.1368 21.9286 13.9494 21.9371C13.7621 21.9455 13.5757 21.9059 13.408 21.822L9.691 19.964C9.48337 19.8602 9.30875 19.7006 9.1867 19.5031C9.06466 19.3057 9.00001 19.0781 9 18.846V13.414L3.586 8C3.2109 7.62501 3.00011 7.11639 3 6.586V4.5ZM5 5V6.586L10.56 12.146C10.6994 12.2853 10.8101 12.4507 10.8856 12.6327C10.9611 12.8148 11 13.0099 11 13.207V18.382L13 19.382V13.207C13 12.809 13.158 12.427 13.44 12.147L19 6.585V5H5Z"
                  fill="#332687"
                />
              </svg>
              <span className="px-3 py-1.5 font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-[#49454F]">
                Filter
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-[37px] w-[37px] flex-shrink-0 rounded-[10px] bg-[#F4F7FE]"
            >
              <MoreHorizontal className="h-6 w-6 text-[#4318FF]" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Table Header */}
          <div className="flex items-center justify-between">
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Kode Project
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Nama Proyek
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Nama Klien (WP)
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Period
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Progress
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Status
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[120px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Last Update
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
            <div className="flex w-[196px] items-center gap-1.75">
              <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                Action
              </div>
              <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
            </div>
          </div>

          <div className="h-px w-full bg-[#E9EDF7]" />

          {/* Table Rows */}
          {projectsTable.map((project, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex w-[120px] items-center justify-center gap-2.5">
                <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                  {project.code}
                </div>
              </div>
              <div className="flex w-[120px] items-center justify-center gap-2.5">
                <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                  {project.projectName}
                </div>
              </div>
              <div className="flex w-[120px] items-center justify-center gap-2.5">
                <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                  {project.clientName}
                </div>
              </div>
              <div className="flex w-[120px] flex-col items-start gap-2.5 bg-transparent p-[3px]">
                <div className="flex h-[29px] items-center justify-center gap-2.5 rounded-[5px] bg-[rgba(103,80,164,0.08)] px-2.5">
                  <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                    {project.period}
                  </div>
                </div>
              </div>
              <div className="flex w-[120px] flex-col items-start gap-2.5 bg-transparent p-[3px]">
                <div className="flex w-[120px] items-center gap-1.5">
                  <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                    {project.progress}%
                  </div>
                  <div className="h-2 w-[63px] flex-shrink-0">
                    <Progress
                      value={project.progress}
                      className="h-2 bg-[#EFF4FB]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-[120px] flex-col items-start gap-2.5 bg-transparent p-[3px]">
                <div className="flex h-[29px] items-center justify-center gap-2.5 rounded-[5px] bg-[rgba(103,80,164,0.08)] px-2.5">
                  <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                    {project.status}
                  </div>
                </div>
              </div>
              <div className="grid w-[120px] grid-cols-1 grid-rows-1 gap-2.5">
                <div className="col-span-1 row-span-1 justify-self-stretch font-dm-sans text-xs font-normal leading-[15px] tracking-[-0.24px] text-[#2B3674]">
                  {project.lastUpdate}
                </div>
              </div>
              <div className="flex w-[201px] items-center gap-1.5">
                <Button className="h-12 rounded-[5px] bg-[#6750A4] px-3 py-1.5 hover:bg-[#6750A4]/90">
                  <span className="font-roboto text-sm font-medium leading-5 tracking-[0.1px] text-white">
                    View My Task
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
