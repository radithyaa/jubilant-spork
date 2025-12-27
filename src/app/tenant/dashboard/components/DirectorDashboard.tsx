"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCards } from "./KpiCards";
import { SptStatusChart } from "./SptStatusChart";
import { TrendChart } from "./TrendChart";
import { ComplianceOverview } from "./ComplianceOverview";
import { ProjectRiskSummary } from "./ProjectRiskSummary";
import { BastInvoiceStatus } from "./BastInvoiceStatus";
import { TopAttentionTable } from "./TopAttentionTable";
import { directorDashboardData } from "./mockData";

export function DirectorDashboard() {
	return (
		<div className="flex flex-col gap-[30px] p-10">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium leading-6 text-[#707EAE]">
					Dashboard
				</p>
				<h1 className="text-[34px] font-bold leading-[42px] tracking-[-0.68px] text-[#0B1437]">
					Dashboard Direktur
				</h1>
			</div>

			{/* KPI Cards */}
			<KpiCards data={directorDashboardData.kpiCards} />

			{/* Charts Row */}
			<div className="grid gap-[30px] lg:grid-cols-[760px_1fr]">
				<SptStatusChart data={directorDashboardData.sptStatus} />
				<TrendChart data={directorDashboardData.trendData} />
			</div>

			{/* Status Cards Row */}
			<div className="grid gap-[29px] lg:grid-cols-3">
				<ComplianceOverview data={directorDashboardData.complianceOverview} />
				<ProjectRiskSummary data={directorDashboardData.projectRisk} />
				<BastInvoiceStatus data={directorDashboardData.bastInvoice} />
			</div>

			{/* Top Attention Table */}
			<TopAttentionTable data={directorDashboardData.topAttention} />
		</div>
	);
}
