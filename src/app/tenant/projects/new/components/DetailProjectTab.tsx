"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormContext, Controller } from "react-hook-form";
import type { ProjectFormValues } from "@/validators/project.schema";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClients } from "@/hooks/useClients";
import { useTenantUsers } from "@/hooks/useTenant";
import { User } from "@/types/users";

// Modules definition
export const MODULES = [
	{ code: "FORM_1", label: "Document" },
	{ code: "KK_1", label: "Transaction" },
	{ code: "KK_2", label: "Accounting/SIA" },
	{ code: "KK_3", label: "Tax/SIP" },
	{ code: "KK_4", label: "Analysis & Validation" },
	{ code: "KK_5", label: "QC & Handaover" },
];

// Helper to get color style based on module code
const getModuleStyle = (code: string) => {
	if (["FORM_1", "KK_2", "KK_4"].includes(code)) {
		return { bg: "bg-background", textColor: "text-primary" };
	}
	return { bg: "bg-[rgba(255,204,0,0.1)]", textColor: "" };
};

// Helper to sanitize scope key for form field names
const sanitizeScopeKey = (scope: string) => {
	return scope.replace(/[\s.]/g, "_");
};

export default function DetailProjectTab() {
	const {
		register,
		control,
		formState: { errors },
		watch,
	} = useFormContext<ProjectFormValues>();

	const startDate = watch("start_date");
	const selectedScopes = watch("scopes") || [];

	const { tenant } = useAuth();

	// Fetch Clients using hook
	const { data: clientsData, isLoading: isLoadingClients } = useClients({
		tenantId: tenant?.id || "",
		limit: 100,
	});

	const clients = useMemo(() => clientsData?.items || [], [clientsData]);

	// Fetch Project Managers using hook
	const { data: pmsData, isLoading: isLoadingPms } = useTenantUsers({
		tenantId: tenant?.id || "",
		permission: "project:manage",
		limit: 100,
	});

	const pms = useMemo(
		() => (pmsData?.items || []).filter((u: any) => u?.role !== "Admin Tenant"),
		[pmsData],
	);

	// Fetch tenant-scoped users once, reuse for all module leader/member dropdowns
	const { data: tenantUsersData } = useTenantUsers({
		tenantId: tenant?.id || "",
		enabled: !!tenant?.id,
		limit: 100,
	});

	const tenantUsers = useMemo(
		() =>
			(tenantUsersData?.items || []).filter(
				(u: any) => u?.role !== "Admin Tenant",
			),
		[tenantUsersData],
	);

	const moduleUsers = useMemo(() => {
		return selectedScopes.reduce(
			(acc, scope) => {
				acc[scope] = {
					leaders: tenantUsers,
					members: tenantUsers,
				};
				return acc;
			},
			{} as Record<string, { leaders: any[]; members: any[] }>,
		);
	}, [selectedScopes, tenantUsers]);

	return (
		<div className="flex items-start gap-[30px] self-stretch">
			{/* Left Column */}
			<div className="flex flex-1 flex-col justify-center gap-[30px] self-stretch">
				{/* Informasi Dasar */}
				<Card className="p-5">
					<div className="mb-5 flex flex-col gap-0">
						<CardTitle>Informasi Dasar</CardTitle>
					</div>
					<div className="flex flex-col gap-2.5">
						<div className="flex gap-5">
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Dasar Kerja sama / Kontrak</Label>
								<Input
									placeholder="Dasar Kerja sama / Kontrak"
									{...register("contract_basis")}
								/>
							</div>
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Nomor Kontrak *</Label>
								<Input
									placeholder="No. Kontrak"
									{...register("contract_code")}
								/>
								{errors.contract_code && (
									<span className="text-red-500 text-xs">
										{errors.contract_code.message}
									</span>
								)}
							</div>
						</div>

						<div className="flex gap-5">
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Tanggal Kontrak *</Label>
								<Controller
									control={control}
									name="contract_date"
									render={({ field }) => (
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder="Pilih Tanggal Kontrak"
										/>
									)}
								/>
								{errors.contract_date && (
									<span className="text-red-500 text-xs">
										{errors.contract_date.message}
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="mt-2.5 flex flex-col gap-2">
						<Label>Catatan</Label>
						<Textarea placeholder="Deskripsi catatan" {...register("notes")} />
					</div>
				</Card>

				{/* Administrasi Project */}
				<Card className="p-5">
					<div className="mb-5 flex flex-col gap-0">
						<CardTitle>Administrasi Project</CardTitle>
					</div>
					<div className="flex flex-col gap-2.5">
						<div className="flex gap-5">
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Nama Project *</Label>
								<Input placeholder="Nama Project" {...register("name")} />
								{errors.name && (
									<span className="text-red-500 text-xs">
										{errors.name.message}
									</span>
								)}
							</div>
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Pilih Klien *</Label>
								<Controller
									control={control}
									name="client_id"
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue
													placeholder={
														isLoadingClients ? "Loading..." : "Pilih Klien"
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{clients.map((client: any) => (
													<SelectItem 
														key={client.id} 
														value={client.id}
														disabled={client.status !== 'active'}
													>
														{client.name} {client.status !== 'active' ? '(Nonaktif)' : ''}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.client_id && (
									<span className="text-red-500 text-xs">
										{errors.client_id.message}
									</span>
								)}
							</div>
						</div>

						<div className="flex gap-5">
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Project Manager *</Label>
								<Controller
									control={control}
									name="pmo_id"
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											value={field.value}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={
														isLoadingPms
															? "Loading..."
															: "Pilih Project Manager"
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{pms.map((pm: any) => (
													<SelectItem key={pm.id} value={pm.id}>
														{pm.username ||
															`${pm.first_name || ""} ${pm.last_name || ""}`.trim()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.pmo_id && (
									<span className="text-red-500 text-xs">
										{errors.pmo_id.message}
									</span>
								)}
							</div>
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Budget</Label>
								<Controller
									control={control}
									name="budget"
									render={({ field }) => (
										<Input
											type="number"
											variant="idr"
											placeholder="Rp."
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(e.target.valueAsNumber || e.target.value)
											}
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex gap-5">
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Tanggal Mulai *</Label>
								<Controller
									control={control}
									name="start_date"
									render={({ field }) => (
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder="Pilih Tanggal Mulai"
										/>
									)}
								/>
								{errors.start_date && (
									<span className="text-red-500 text-xs">
										{errors.start_date.message}
									</span>
								)}
							</div>
							<div className="flex flex-1 flex-col gap-2 mb-1">
								<Label>Deadline *</Label>
								<Controller
									control={control}
									name="end_date"
									render={({ field }) => (
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder="Pilih Deadline"
										/>
									)}
								/>
								{errors.end_date && (
									<span className="text-red-500 text-xs">
										{errors.end_date.message}
									</span>
								)}
							</div>
						</div>
					</div>
				</Card>

				{/* Team Assignment (Dynamic) */}
				{selectedScopes.length > 0 && (
					<Card className="p-5">
						<div className="mb-5 flex flex-col gap-0">
							<CardTitle>Team Assignment</CardTitle>
							<CardDescription className="line-clamp-1 overflow-hidden text-ellipsis text-primary">
								Atur Team Leader / Member untuk setiap modul
							</CardDescription>
						</div>

						<div className="flex flex-col gap-2.5">
							{selectedScopes.map((scope) => {
								const style = getModuleStyle(scope);
								const leaderField = watch(
									`team_assignments.${sanitizeScopeKey(scope)}.leader_id`,
								);
								const memberField = watch(
									`team_assignments.${sanitizeScopeKey(scope)}.member_id`,
								);

								const filteredLeaders =
									moduleUsers[scope]?.leaders.filter(
										(u: any) => u.id !== memberField,
									) || [];

								const filteredMembers =
									moduleUsers[scope]?.members.filter(
										(u: User) => u.id !== leaderField,
									) || [];

								return (
									<div
										key={scope}
										className="flex flex-col gap-2.5 border-b pb-4 last:border-0 last:pb-0 pt-2 first:pt-0"
									>
										<div
											className={`inline-flex items-center justify-center gap-2.5 self-start rounded-[5px] border px-2.5 py-1 ${style.bg}`}
										>
											<span
												className={`font-inter text-xs leading-normal ${style.textColor}`}
											>
												{scope
													.replace(/_/g, " ")
													.replace(" 1 0", " 1.0")
													.replace(" 2 0", " 2.0")
													.replace(" 3 0", " 3.0")
													.replace(" 4 0", " 4.0")
													.replace(" 5 0", " 5.0")}
											</span>
										</div>

										<div className="flex flex-col gap-2">
											<div className="flex flex-col gap-1">
												<Label className="text-xs">Team Leader</Label>
												<Controller
													control={control}
													name={`team_assignments.${sanitizeScopeKey(scope)}.leader_id`}
													render={({ field }) => (
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger
																className={
																	errors.team_assignments?.[sanitizeScopeKey(scope)]
																		?.leader_id
																		? "border-red-500 h-9"
																		: "h-9"
																}
															>
																<SelectValue placeholder="Pilih Team Leader" />
															</SelectTrigger>
															<SelectContent>
																{filteredLeaders.map((u: any) => (
																	<SelectItem key={u.id} value={u.id}>
																		{u.username}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>
												{errors.team_assignments?.[sanitizeScopeKey(scope)]
													?.leader_id && (
													<span className="text-red-500 text-xs">
														{
															errors.team_assignments[sanitizeScopeKey(scope)]
																?.leader_id?.message
														}
													</span>
												)}
											</div>

											<div className="flex flex-col gap-1">
												<Label className="text-xs">Team Member</Label>
												<Controller
													control={control}
													name={`team_assignments.${sanitizeScopeKey(scope)}.member_id`}
													render={({ field }) => (
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger
																className={
																	errors.team_assignments?.[sanitizeScopeKey(scope)]
																		?.member_id
																		? "border-red-500 h-9"
																		: "h-9"
																}
															>
																<SelectValue placeholder="Pilih Team Member" />
															</SelectTrigger>
															<SelectContent>
																{filteredMembers.map((u: any) => (
																	<SelectItem key={u.id} value={u.id}>
																		{u.username}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>
												{errors.team_assignments?.[sanitizeScopeKey(scope)]
													?.member_id && (
													<span className="text-red-500 text-xs">
														{
															errors.team_assignments[sanitizeScopeKey(scope)]
																?.member_id?.message
														}
													</span>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</Card>
				)}
			</div>

			{/* Right Column - Scope of Work */}
			<div className="w-[500px]">
				<Card className="p-5">
					<div className="mb-5 flex flex-col gap-0">
						<CardTitle>Scope of Work</CardTitle>
						<CardDescription className="line-clamp-1 overflow-hidden text-ellipsis text-primary">
							Pilih modul yang akan dikerjakan dalam project ini
						</CardDescription>
					</div>

					<div className="flex flex-col gap-2.5 py-[5px]">
						{MODULES.map((module) => (
							<div key={module.code} className="flex items-center gap-2">
								<Controller
									control={control}
									name="scopes"
									render={({ field }) => {
										const isChecked = field.value?.includes(module.code);
										return (
											<Checkbox
												checked={isChecked}
												onCheckedChange={(checked) => {
													const current = field.value || [];
													const updated = checked
														? [...current, module.code]
														: current.filter((val) => val !== module.code);
													field.onChange(updated);
												}}
											/>
										);
									}}
								/>
								<Badge className="rounded-sm">
									{module.code
										.replace(/_/g, " ")
										.replace(" 1 0", " 1.0")
										.replace(" 2 0", " 2.0")
										.replace(" 3 0", " 3.0")
										.replace(" 4 0", " 4.0")
										.replace(" 5 0", " 5.0")}
								</Badge>
								<span className="font-inter text-sm font-medium leading-[14px] ">
									{module.label}
								</span>
							</div>
						))}
						{errors.scopes && (
							<span className="text-red-500 text-xs">
								{errors.scopes.message}
							</span>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
