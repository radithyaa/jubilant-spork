'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MoreHorizontal, ChevronDown } from 'lucide-react';
import { InfoCard } from './InfoCard';
import { StatusCard } from './StatusCard';
import { ProjectProgressCard } from './ProjectProgressCard';
import { AlertCard } from './AlertCard';
import { DeliverableItem } from './DeliverableItem';
import {
  clientInfo,
  progressBoard,
  projectProgress,
  requestsAlerts,
  deliverables,
  allProjects,
} from './data';

export function ClientPage() {
  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="flex flex-col gap-1.25 px-0">
        <div className="font-dm-sans text-sm font-medium leading-6 text-[#707EAE]">
          Dashboard
        </div>
        <div className="font-dm-sans text-[34px] font-bold leading-[42px] tracking-[-0.68px] text-[#0B1437]">
          Dashboard Client
        </div>
      </div>

      {/* Welcome Section */}
      <div className="mt-[31px] flex flex-col gap-2.5 px-[30px]">
        <Card className="flex flex-col items-start gap-[30px] rounded-[20px] bg-white p-[30px]">
          <div className="flex flex-col items-start gap-5">
            <div className="flex items-start gap-2.5">
              <div className="flex flex-col items-start">
                <div className="h-8 w-[451px] font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
                  {clientInfo.welcomeMessage}
                </div>
                <div className="h-6 w-[303px] font-roboto text-base font-normal leading-6 tracking-[0.5px] text-[#2B3674]">
                  {clientInfo.subtitle}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-[30px] self-stretch">
              <InfoCard
                icon={User}
                label={clientInfo.pic.label}
                value={clientInfo.pic.name}
              />
              <InfoCard icon={Phone} label="Phone" value={clientInfo.phone} />
              <InfoCard icon={Mail} label="Email" value={clientInfo.email} />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mt-[30px] inline-flex items-start gap-[30px] px-[30px]">
        {/* Left Section */}
        <div className="flex flex-1 flex-col gap-[30px]">
          {/* Progress Board */}
          <Card className="flex flex-col items-start gap-[30px] rounded-[20px] bg-white p-[30px]">
            <div className="flex flex-col items-start gap-5 self-stretch">
              <div className="flex items-start justify-between self-stretch">
                <div className="flex flex-col items-start">
                  <div className="h-8 w-[252px] font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
                    Proyek Progress Board
                  </div>
                  <div className="h-4 w-[325px] font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
                    Realtime status berbagai proyek dengan milestone board
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

              <div className="flex items-center gap-5 self-stretch">
                <StatusCard
                  count={progressBoard.notStarted}
                  label="Not Started"
                  bgColor="bg-[#EADDFF]"
                />
                <StatusCard
                  count={progressBoard.inProgress}
                  label="In Progress"
                  bgColor="bg-[#FFF1C2]"
                />
                <StatusCard
                  count={progressBoard.completed}
                  label="Completed"
                  bgColor="bg-[#CFF7D3]"
                />
                <StatusCard
                  count={progressBoard.overdue}
                  label="Overdue"
                  bgColor="bg-[#EC221F]"
                  textColor="text-white"
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-2.5 self-stretch">
              {projectProgress.map((project, idx) => (
                <ProjectProgressCard key={idx} {...project} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center gap-[30px]">
          {/* Request & Alerts */}
          <Card className="flex w-[550px] flex-col items-start gap-2.5 rounded-[30px] bg-white p-[30px]">
            <div className="flex items-start justify-between self-stretch">
              <div className="flex flex-col items-start">
                <div className="h-8 w-[190px] font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
                  Request & Alerts
                </div>
                <div className="h-4 w-[274px] font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
                  Dokumen yang diperlukan dan tindak konfirmasi
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

            {requestsAlerts.map((alert) => (
              <AlertCard key={alert.id} {...alert} />
            ))}
          </Card>

          {/* Deliverable */}
          <Card className="flex w-[550px] flex-col items-start gap-2.5 rounded-[30px] bg-white p-[30px]">
            <div className="flex items-start justify-between self-stretch">
              <div className="flex flex-col items-start">
                <div className="h-9 w-[139px] font-roboto text-[28px] font-medium leading-9 tracking-0 text-[#2B3674]">
                  Deliverable
                </div>
                <div className="h-4 w-[190px] font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
                  Download your project Document
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

            <div className="flex flex-col items-start gap-[21px] self-stretch">
              {deliverables.map((item, idx) => (
                <DeliverableItem key={idx} {...item} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* All Projects Table */}
      <div className="mt-[30px] flex flex-col gap-2.5 px-[30px]">
        <Card className="flex flex-col items-start gap-[50px] rounded-[20px] bg-white p-[30px]">
          <div className="flex items-start justify-between self-stretch">
            <div className="flex flex-col items-start">
              <div className="h-8 w-[165px] font-dm-sans text-2xl font-bold leading-8 tracking-[-0.48px] text-[#2B3674]">
                Semua Project
              </div>
              <div className="h-4 w-[232px] font-roboto text-xs font-normal leading-4 tracking-[0.4px] text-[#2B3674]">
                Riwayat lengkap project konsultasi pajak
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

          <div className="flex flex-col items-start gap-2.5 self-stretch">
            {/* Table Header */}
            <div className="flex items-center justify-between self-stretch">
              <div className="flex w-[120px] items-center gap-1.75">
                <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                  Kode Project
                </div>
                <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
              </div>
              <div className="flex w-[120px] items-center gap-1.75">
                <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                  Klien
                </div>
                <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
              </div>
              <div className="flex w-[120px] items-center gap-1.75">
                <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                  Periode
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
                  Days Overdue
                </div>
                <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
              </div>
              <div className="flex w-[120px] items-center gap-1.75">
                <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                  Contact
                </div>
                <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
              </div>
              <div className="flex w-[120px] items-center gap-1.75">
                <div className="font-dm-sans text-sm font-medium leading-6 tracking-[-0.28px] text-[#A3AED0]">
                  Action
                </div>
                <ChevronDown className="h-6 w-6 text-[#A3AED0]" />
              </div>
            </div>

            <div className="h-px w-full bg-[#E9EDF7]" />

            {/* Table Rows */}
            {allProjects.map((project, idx) => (
              <div key={idx} className="flex items-center justify-between self-stretch">
                <div className="flex w-[120px] items-center justify-center gap-2.5">
                  <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                    {project.code}
                  </div>
                </div>
                <div className="flex w-[120px] items-center justify-center gap-2.5">
                  <div className="font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                    {project.client}
                  </div>
                </div>
                <div className="flex w-[120px] flex-col items-start gap-2.5 bg-transparent p-[3px]">
                  <div className="h-[29px] rounded-[6.25px] border border-[#C2C5CC] bg-[#EEEFF1] px-2.5 py-1">
                    <div className="font-inter text-[11px] font-normal text-[#7C7D8C]">
                      {project.period}
                    </div>
                  </div>
                </div>
                <div className="flex w-[120px] flex-col items-start gap-2.5">
                  <Badge
                    className={`rounded-[50px] px-3 py-1.5 text-sm font-medium leading-5 tracking-[0.1px] ${
                      project.status === 'Selesai'
                        ? 'bg-[#CFF7D3] text-[#4A4459]'
                        : project.status === 'In Progress'
                          ? 'bg-[#E8DEF8] text-[#4A4459]'
                          : 'bg-[#FFF1C2] text-[#4A4459]'
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="flex w-[120px] flex-col items-start gap-2.5 bg-transparent p-[3px]">
                  <div className="h-[29px] rounded-[5.75px] border border-[#FEC4BE] bg-[#F9E6E7] px-2 py-1">
                    <div className="font-inter text-xs font-normal text-[#E47174]">
                      {project.daysOverdue}
                    </div>
                  </div>
                </div>
                <div className="w-[120px] font-dm-sans text-sm font-bold leading-6 tracking-[-0.28px] text-[#2B3674]">
                  {project.contact}
                </div>
                <div className="w-[120px]">
                  <div className="h-[31px] w-[65px] rounded-[5.75px] border border-[#C5C4C5] bg-[#FEFDFE] px-2 py-1.5">
                    <div className="font-inter text-[13px] font-bold text-[#676A79]">
                      View
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
