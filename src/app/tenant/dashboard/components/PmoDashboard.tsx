"use client";

import { PmoHeader } from "./pmo/PmoHeader";
import { PmoKpiCards } from "./pmo/PmoKpiCards";
import { ProjectProgressBoard } from "./pmo/ProjectProgressBoard";
import { ApprovalTerbaru } from "./pmo/ApprovalTerbaru";
import { RequestsAlerts } from "./pmo/RequestsAlerts";
import { ProjectProgressTrends } from "./pmo/ProjectProgressTrends";
import { TeamEfficiencyChart } from "./pmo/TeamEfficiencyChart";
import { TopAttentionPmo } from "./pmo/TopAttentionPmo";
import { pmoDashboardData } from "./pmo/mockData";

export function PmoDashboard() {
  return (
    <div className="flex flex-col gap-[30px] px-[30px] py-[25px]">
      {/* Header */}
      <PmoHeader />

      {/* KPI Cards */}
      <PmoKpiCards data={pmoDashboardData.kpiCards} />

      {/* Main Content Grid */}
      <div className="flex gap-[30px]">
        {/* Left Column - Project Progress Board */}
        <div className="flex-1">
          <ProjectProgressBoard data={pmoDashboardData.projectProgressBoard} />
        </div>

        {/* Right Column - Approval & Requests */}
        <div className="flex flex-col gap-[30px]">
          <ApprovalTerbaru data={pmoDashboardData.approvalTerbaru} />
          <RequestsAlerts data={pmoDashboardData.requestsAlerts} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="flex gap-5">
        <ProjectProgressTrends data={pmoDashboardData.projectProgressTrends} />
        <TeamEfficiencyChart data={pmoDashboardData.teamEfficiency} />
      </div>

      {/* Top Attention Table */}
      <TopAttentionPmo data={pmoDashboardData.topAttention} />
    </div>
  );
}
