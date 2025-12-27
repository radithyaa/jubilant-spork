"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext, Controller } from "react-hook-form";
import { ProjectFormValues } from "@/validators/project.schema";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useTenantUsers } from "@/hooks/useTenant";

// Preset due policy options matching design (H+3, H+7, etc.)
const DUE_POLICY_OPTIONS = [
	{ value: 3, label: "H+3 (3 hari setelah deadline)" },
	{ value: 7, label: "H+7 (7 hari setelah deadline)" },
	{ value: 14, label: "H+14 (14 hari setelah deadline)" },
];

export default function ProjectSettingsTab() {
	const {
		control,
		formState: { errors },
	} = useFormContext<ProjectFormValues>();

	const { tenant } = useAuth();
	const [bastTemplates, setBastTemplates] = useState<any[]>([]);
	const [invoiceTemplates, setInvoiceTemplates] = useState<any[]>([]);

	// Fetch Templates (keeping as is, no specific hook requested)
	useEffect(() => {
		if (tenant?.id) {
			api
				.get("/project/report-templates", {
					headers: { "X-Tenant-Id": tenant.id },
				})
				.then((res) => {
					const templates = res?.data?.data || [];
					setBastTemplates(
						templates.filter((t: any) => t.report_type === "BAST"),
					);
					setInvoiceTemplates(
						templates.filter((t: any) => t.report_type === "INVOICE"),
					);
				})
				.catch((err) => {
					setBastTemplates([]);
					setInvoiceTemplates([]);
					console.error("Failed to fetch templates", err);
				});
		}
	}, [tenant?.id]);

	// Fetch PMO users for escalation using useTenantUsers hook
	const { data: pmoUsersData } = useTenantUsers({
		tenantId: tenant?.id || "",
		permission: "project:manage",
		enabled: !!tenant?.id,
		limit: 100,
	});

	const pmoUsers = useMemo(
		() =>
			(pmoUsersData?.items || []).filter(
				(u: any) => u?.role !== "Admin Tenant",
			),
		[pmoUsersData],
	);

	return (
		<div className="flex items-start gap-[30px] self-stretch">
			<div className="flex flex-1 flex-col justify-center gap-[30px]">
				{/* SLA & Reminders */}
				<Card className="p-5">
					<div className="mb-5 flex flex-col gap-0 self-stretch">
						<CardTitle>SLA & Reminders</CardTitle>
						<CardDescription className="line-clamp-1 overflow-hidden text-ellipsis">
							Atur kebijakan deadline dan eskalasi
						</CardDescription>
					</div>

					<div className="flex flex-col gap-0 self-stretch">
						<Label className="text-base font-medium leading-6 tracking-[0.15px] ">
							Due Policy *
						</Label>
						<Controller
							control={control}
							name="due_policy_days"
							render={({ field }) => (
								<Select
									onValueChange={(val) => field.onChange(Number(val))}
									value={
										field.value !== undefined && field.value !== null
											? String(field.value)
											: ""
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Pilih Due Policy" />
									</SelectTrigger>
									<SelectContent>
										{DUE_POLICY_OPTIONS.map((opt) => (
											<SelectItem key={opt.value} value={String(opt.value)}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.due_policy_days && (
							<span className="text-red-500 text-xs">
								{errors.due_policy_days.message}
							</span>
						)}
					</div>

					<div className="mt-5 flex flex-col gap-2.5 py-[5px]">
						<Label className="text-base font-medium leading-6 tracking-[0.15px] ">
							Escalation Recipients
						</Label>
						<div className="flex flex-col gap-2">
							{pmoUsers.map(
								(
									user: any, // Cast to any temporarily for u.name
								) => (
									<div key={user.id} className="flex items-center gap-2">
										<Controller
											control={control}
											name="escalation_user_ids"
											render={({ field }) => {
												const isChecked = field.value?.includes(user.id);
												return (
													<Checkbox
														checked={isChecked}
														onCheckedChange={(checked) => {
															const current = field.value || [];
															const updated = checked
																? [...current, user.id]
																: current.filter((val) => val !== user.id);
															field.onChange(updated);
														}}
													/>
												);
											}}
										/>
										<span className="font-inter text-sm font-medium leading-[14px]">
											{user.username ||
												`${user.first_name || ""} ${user.last_name || ""}`.trim()}
										</span>
									</div>
								),
							)}
						</div>
					</div>
				</Card>

				{/* Deliverables */}
				<Card className="p-5">
					<div className="mb-5 flex flex-col gap-0 self-stretch">
						<CardTitle>Deliverables</CardTitle>
						<CardDescription className="line-clamp-1 overflow-hidden text-ellipsis">
							Template BAST & Invoice yang akan digunakan
						</CardDescription>
					</div>

					<div className="flex flex-col gap-5 self-stretch">
						<div className="flex flex-col gap-0">
							<Label className="text-base font-medium leading-6 tracking-[0.15px] ">
								BAST Template
							</Label>
							<Controller
								control={control}
								name="bast_template_id"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Pilih template BAST" />
										</SelectTrigger>
										<SelectContent>
											{bastTemplates.map((t: any) => (
												<SelectItem key={t.id} value={t.id}>
													{t.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						<div className="flex flex-col gap-0">
							<Label className="text-base font-medium leading-6 tracking-[0.15px] ">
								Invoice Template
							</Label>
							<Controller
								control={control}
								name="invoice_template_id"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Pilih template Invoice" />
										</SelectTrigger>
										<SelectContent>
											{invoiceTemplates.map((t: any) => (
												<SelectItem key={t.id} value={t.id}>
													{t.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
