"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
	useClient,
	useClientReadiness,
	useDeleteClient,
} from "@/hooks/useClients";
import { useClientContacts } from "@/hooks/useClientContacts";
import { useClientBranches } from "@/hooks/useClientBranches";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
	ArrowLeft,
	Trash2,
	Edit,
	Building2,
	FileText,
	Activity,
	Calendar,
	Mail,
	Phone,
	MapPin,
	Globe,
	Clock,
	Filter,
	Plus,
	Eye,
	CheckCircle2,
	AlertCircle,
	History,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const formatThousandsId = (value: number) => {
	if (!Number.isFinite(value)) return "";
	return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
		value,
	);
};

export default function ClientDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { tenant } = useAuth();
	const { toast } = useToast();
	const id = params.id as string;
	const deleteClientMutation = useDeleteClient();

	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [previewTitle, setPreviewTitle] = useState<string>("");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isPreviewLoading, setIsPreviewLoading] = useState(false);

	const { data: client, isLoading, error } = useClient(tenant.id, id);
	const { data: readiness } = useClientReadiness(tenant.id, id);
	const { data: contacts, isLoading: isContactsLoading } = useClientContacts(
		tenant.id,
		id,
	);
	const { data: branches, isLoading: isBranchesLoading } = useClientBranches(
		tenant.id,
		id,
	);

	// Fetch projects for this client
	const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
		queryKey: ["client-projects", tenant.id, id],
		queryFn: async () => {
			const response = await api.get("/project", {
				params: {
					client_id: id,
					status: "all",
					page: 1,
					limit: 50,
				},
				headers: { "X-Tenant-Id": tenant.id },
			});
			return response.data?.data || { projects: [], total: 0 };
		},
		enabled: !!tenant.id && !!id,
	});

	const clientProjects = projectsData?.projects || [];

	if (isLoading) {
		return (
			<div className="p-6 space-y-6">
				<Skeleton className="h-12 w-1/3" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (error || !client) {
		return (
			<div className="p-6 text-center">
				<h3 className="text-lg font-medium text-red-600">
					Error loading client details
				</h3>
				<Button
					variant="outline"
					onClick={() => router.back()}
					className="mt-4"
				>
					Go Back
				</Button>
			</div>
		);
	}

	const handleDelete = () => {
		if (confirm("Apakah Anda yakin ingin menghapus klien ini?")) {
			deleteClientMutation.mutate(
				{ tenantId: tenant.id, id },
				{
					onSuccess: () => {
						router.push("/tenant/clients");
					},
				},
			);
		}
	};

	const handlePreviewLegalDoc = async (doc: any) => {
		const keyOrUrl = doc?.file_url;
		if (!keyOrUrl) return;

		setPreviewTitle(doc?.file_name || doc?.document_type || "Dokumen");
		setIsPreviewOpen(true);
		setPreviewUrl(null);
		setIsPreviewLoading(true);

		try {
			if (/^https?:\/\//i.test(keyOrUrl)) {
				setPreviewUrl(keyOrUrl);
				return;
			}

			const resp = await api.get(
				"/client-wp/api/uploads/legal-documents/presign",
				{
					params: { objectKey: keyOrUrl },
					headers: { "X-Tenant-Id": tenant.id },
				},
			);
			setPreviewUrl(resp.data?.presigned_url || null);
		} catch (e: any) {
			const msg =
				e?.response?.data?.message || e?.message || "Gagal membuka dokumen";
			toast({
				title: "Preview gagal",
				description: msg,
				variant: "destructive",
			});
		} finally {
			setIsPreviewLoading(false);
		}
	};

	// Legal document completeness purely from readiness API
	// Backend considers 4 minimal docs: NPWP, Surat PKP, Akta Pendirian, KTP penanggung jawab
	const TOTAL_REQUIRED_LEGAL_DOCS = 4;
	let legalDocsFulfilled = 0;
	let legalDocsPercent = 0;

	if (readiness && readiness.checks) {
		const legalCheck = readiness.checks.find(
			(c) => c.key === "legal_documents",
		);
		const missingCount = legalCheck?.missing?.length ?? 0;
		legalDocsFulfilled = Math.max(0, TOTAL_REQUIRED_LEGAL_DOCS - missingCount);
		legalDocsPercent = TOTAL_REQUIRED_LEGAL_DOCS
			? Math.round((legalDocsFulfilled / TOTAL_REQUIRED_LEGAL_DOCS) * 100)
			: 0;
	}

	// Format Date Helper
	const formatDate = (dateString?: string | null) => {
		if (!dateString) return "-";
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	// Helper to get milestone status label
	const getMilestoneLabel = (status: string) => {
		const labels: Record<string, string> = {
			NOT_STARTED: "Not started",
			IN_PROGRESS: "In Progress",
			SUBMITTED: "Submitted",
			LEADER_APPROVED: "Leader Approved",
			PMO_APPROVED: "Done",
		};
		return labels[status] || status;
	};

	// Helper to get milestone status class
	const getMilestoneStatusClass = (status: string) => {
		if (status === "PMO_APPROVED" || status === "LEADER_APPROVED")
			return "done";
		if (status === "IN_PROGRESS" || status === "SUBMITTED")
			return "in_progress";
		return "not_started";
	};

	// Transform project data for display
	const transformProjectForDisplay = (project: any) => {
		const scopes = project.project_scopes || [];

		// Build milestones from project_scopes
		const defaultMilestones = [
			"FORM_1",
			"KK_1",
			"KK_2",
			"KK_3",
			"KK_4",
			"KK_5",
		];
		const milestoneLabels: Record<string, string> = {
			FORM_1: "Form 1.0",
			KK_1: "KK 1.0",
			KK_2: "KK 2.0",
			KK_3: "KK 3.0",
			KK_4: "KK 4.0",
			KK_5: "KK 5.0",
		};

		const milestones = defaultMilestones.map((scopeName) => {
			const scope = scopes.find((s: any) => s.scope_name === scopeName);
			const status = scope?.status || "NOT_STARTED";
			return {
				name: milestoneLabels[scopeName] || scopeName,
				status: getMilestoneStatusClass(status),
				label: getMilestoneLabel(status),
			};
		});

		// Find next deadline from scopes
		const inProgressScope = scopes.find((s: any) => s.status === "IN_PROGRESS");
		const nextDeadline = inProgressScope
			? `${milestoneLabels[inProgressScope.scope_name] || inProgressScope.scope_name} Completion (${formatDate(project.end_date)})`
			: project.end_date
				? `Project Deadline (${formatDate(project.end_date)})`
				: "-";

		return {
			id: project.code || project.id,
			name: project.name,
			team_lead:
				project.users_projects_ketua_tim_idTousers?.name ||
				project.users_projects_pmo_idTousers?.name ||
				"-",
			milestones,
			next_deadline: nextDeadline,
			progress: project.progress || 0,
			status: project.status,
			start_date: project.start_date,
			end_date: project.end_date,
			fiscal_year: project.fiscal_year,
			budget: project.budget,
		};
	};

	// Active projects (PLANNING or IN_PROGRESS)
	const activeProjects = clientProjects
		.filter((p: any) => p.status === "PLANNING" || p.status === "IN_PROGRESS")
		.map(transformProjectForDisplay);

	const totalProjects = clientProjects.length;

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/tenant/clients" className="hover:text-primary">
						Client
					</Link>
					<span>/</span>
					<span>Detail Client</span>
				</div>

				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						Detail Klien
					</h1>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							className="gap-2"
							onClick={() => router.push(`/tenant/clients/${id}/history`)}
						>
							<History className="h-4 w-4" />
							Riwayat
						</Button>
						<Button
							variant="outline"
							className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-400"
							onClick={handleDelete}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Hapus
						</Button>
						<Button
							className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
							asChild
						>
							<Link href={`/tenant/clients/${id}/edit`}>Edit Data Klien</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="bg-blue-50/50 border-none shadow-sm dark:bg-blue-950/20">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="p-3 bg-card rounded-lg shadow-sm dark:bg-blue-900/30">
							<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="text-sm font-medium text-blue-600 dark:text-blue-400">
								Project Aktif
							</p>
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
									{activeProjects.length}
								</span>
								<span className="text-xs text-muted-foreground">
									dari {totalProjects} total
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-blue-50/50 border-none shadow-sm dark:bg-blue-950/20">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="p-3 bg-card rounded-lg shadow-sm dark:bg-blue-900/30">
							<Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="text-sm font-medium text-blue-600 dark:text-blue-400">
								Pajak aktif
							</p>
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
									{client.applicable_taxes?.length || 0}
								</span>
								<span className="text-xs text-muted-foreground">
									jenis pajak
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-blue-50/50 border-none shadow-sm dark:bg-blue-950/20">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="p-3 bg-card rounded-lg shadow-sm dark:bg-blue-900/30">
							<CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="text-sm font-medium text-blue-600 dark:text-blue-400">
								Kelengkapan Dokumen
							</p>
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
									{legalDocsPercent}%
								</span>
								<span className="text-xs text-muted-foreground">
									{legalDocsFulfilled} dokumen wajib terpenuhi
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs Navigation */}
			<Tabs defaultValue="summary" className="w-full">
				<TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none space-x-6 mb-6 overflow-x-auto">
					{[
						{ value: "summary", label: "Ringkasan" },
						{ value: "identity", label: "Identitas Perusahaan" },
						{ value: "classification", label: "Klasifikasi Usaha & Pajak" },
						{ value: "contacts", label: "Kontak & Cabang" },
						{ value: "accounting", label: "Preferensi Akuntansi" },
						{ value: "documents", label: "Dokumen Legal" },
					].map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="summary" className="space-y-6">
					{/* Info Cards Row */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Ringkasan Informasi Perusahaan */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Ringkasan Informasi Perusahaan
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-y-6 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">Nama Perusahaan:</p>
									<p className="font-medium">{client.name}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Skala Bisnis:</p>
									<p className="font-medium capitalize">
										{client.business_scale || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">
										Email Perusahaan:
									</p>
									<p className="font-medium">{client.email || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Telepon:</p>
									<p className="font-medium">{client.phone || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Bergabung Sajak:</p>
									<p className="font-medium">{formatDate(client.created_at)}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Alamat:</p>
									<p className="font-medium">{client.address || "-"}</p>
								</div>
							</CardContent>
						</Card>

						{/* Identitas Perpajakan */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Identitas Perpajakan
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-y-6 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">Tipe WP:</p>
									<p className="font-medium capitalize">
										{client.taxpayer_type || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Periode Lapor:</p>
									<p className="font-medium">Bulanan</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Zona Waktu:</p>
									<p className="font-medium">Asia/Jakarta</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Terdaftar:</p>
									<p className="font-medium">{formatDate(client.created_at)}</p>
								</div>
								<div className="col-span-2">
									<p className="text-muted-foreground mb-2">
										Jenis Pajak Aktif:
									</p>
									<div className="flex flex-wrap gap-2">
										{client.applicable_taxes?.length ? (
											client.applicable_taxes.map((tax) => (
												<Badge
													key={tax}
													variant="secondary"
													className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
												>
													{tax}
												</Badge>
											))
										) : (
											<span className="text-muted-foreground italic">
												Tidak ada pajak aktif
											</span>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Proyek Aktif Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
									Proyek Aktif
								</h2>
								<p className="text-sm text-muted-foreground">
									Realtime status berbagai proyek dengan milestone board
								</p>
							</div>
							<div className="flex gap-2">
								<Button variant="outline" className="gap-2">
									<Filter className="h-4 w-4" />
									Filter
								</Button>
								<Button
									className="bg-blue-600 hover:bg-blue-700 gap-2"
									onClick={() =>
										router.push(`/tenant/projects/new?clientId=${id}`)
									}
									disabled={client.status !== "active"}
								>
									<Plus className="h-4 w-4" />
									Tambah Project
								</Button>
							</div>
						</div>

						{activeProjects.length === 0 ? (
							<Card className="overflow-hidden">
								<CardContent className="p-6 text-center text-muted-foreground">
									<p>Belum ada proyek aktif untuk klien ini.</p>
									<Button
										className="mt-4 bg-blue-600 hover:bg-blue-700 gap-2"
										onClick={() =>
											router.push(`/tenant/projects/new?clientId=${id}`)
										}
										disabled={client.status !== "active"}
									>
										<Plus className="h-4 w-4" />
										Buat Project Pertama
									</Button>
								</CardContent>
							</Card>
						) : (
							activeProjects.map((project: any) => (
								<Card
									key={project.id}
									className="overflow-hidden cursor-pointer transition-colors hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-900/40"
									role="button"
									tabIndex={0}
									onClick={() =>
										router.push(`/tenant/projects/${project.id}/summary`)
									}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											router.push(`/tenant/projects/${project.id}/summary`);
										}
									}}
								>
									<CardContent className="p-6">
										<div className="flex flex-col gap-6">
											{/* Top Row: ID and Name */}
											<div>
												<div className="flex justify-between items-start">
													<h3 className="font-bold text-slate-900 dark:text-slate-100">
														{project.id}
													</h3>
												</div>
												<p className="text-xs font-bold text-blue-900 dark:text-blue-300 mt-1 uppercase">
													{client.name}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													Team:{" "}
													<span className="font-medium text-slate-900 dark:text-slate-200">
														{project.team_lead}
													</span>
												</p>
											</div>

											{/* Milestones */}
											<div className="flex flex-wrap gap-2">
												{project.milestones.map((ms) => (
													<Badge
														key={ms.name}
														variant="secondary"
														className={`
                            ${ms.status === "done" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" : ""}
                            ${ms.status === "in_progress" ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50" : ""}
                            ${ms.status === "not_started" ? "bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700" : ""}
                            px-3 py-1
                          `}
													>
														{ms.name}: {ms.label}
													</Badge>
												))}
											</div>

											{/* Deadline and Progress */}
											<div className="space-y-3">
												<div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-300">
													<Calendar className="h-4 w-4" />
													Next: {project.next_deadline}
												</div>

												<div className="space-y-1">
													<div className="flex justify-between text-xs text-muted-foreground">
														<span>Progress</span>
														<span>{project.progress}%</span>
													</div>
													<div className="flex gap-4 items-center">
														<Progress
															value={project.progress}
															className="h-2 bg-blue-100 dark:bg-blue-950"
														/>
														<Button
															variant="outline"
															size="sm"
															className="gap-2 whitespace-nowrap"
															onClick={(e) => {
																e.stopPropagation();
																router.push(
																	`/tenant/projects/${project.id}/summary`,
																);
															}}
														>
															<Eye className="h-3 w-3" />
															View
														</Button>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</TabsContent>

				<TabsContent value="identity" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Informasi Dasar
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">Nama Perusahaan</p>
									<p className="font-medium">{client.name}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Nama Legal</p>
									<p className="font-medium">{client.legal_name || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">
										Nama Merek (Brand)
									</p>
									<p className="font-medium">{client.brand_name || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Kode Klien</p>
									<p className="font-medium">{client.code || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Tipe Entitas</p>
									<p className="font-medium capitalize">{client.type || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Website</p>
									<p className="font-medium text-blue-600 hover:underline">
										{client.website ? (
											<a
												href={client.website}
												target="_blank"
												rel="noopener noreferrer"
											>
												{client.website}
											</a>
										) : (
											"-"
										)}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Alamat & Kontak
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">Alamat Lengkap</p>
									<p className="font-medium">{client.address || "-"}</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-muted-foreground mb-1">
											Kota / Kabupaten
										</p>
										<p className="font-medium">{client.city || "-"}</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Provinsi</p>
										<p className="font-medium">{client.province || "-"}</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Negara</p>
										<p className="font-medium">
											{client.country || "Indonesia"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Kode Pos</p>
										<p className="font-medium">{client.postal_code || "-"}</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Email Resmi</p>
										<p className="font-medium">{client.email || "-"}</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Telepon Resmi</p>
										<p className="font-medium">{client.phone || "-"}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Legalitas & Pendirian
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">NPWP</p>
									<p className="font-medium">{client.npwp || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">NIK</p>
									<p className="font-medium">{client.nik || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">NIB</p>
									<p className="font-medium">{client.nib || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">
										Nomor Akta Pendirian
									</p>
									<p className="font-medium">{client.deed_number || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Tanggal Berdiri</p>
									<p className="font-medium">
										{formatDate(client.establishment_date)}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Nama Notaris</p>
									<p className="font-medium">{client.notary_name || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Lokasi Notaris</p>
									<p className="font-medium">{client.notary_location || "-"}</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Kontak Notaris</p>
									<p className="font-medium">{client.notary_contact || "-"}</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Modal & SDM
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">Modal Dasar</p>
									<p className="font-medium">
										{client.basic_capital != null
											? new Intl.NumberFormat("id-ID", {
													style: "currency",
													currency: "IDR",
													maximumFractionDigits: 0,
												}).format(Number(client.basic_capital))
											: "Rp 0"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Modal Disetor</p>
									<p className="font-medium">
										{client.paid_capital != null
											? new Intl.NumberFormat("id-ID", {
													style: "currency",
													currency: "IDR",
													maximumFractionDigits: 0,
												}).format(Number(client.paid_capital))
											: "Rp 0"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Revenue Tahunan</p>
									<p className="font-medium">
										{client.annual_revenue != null
											? new Intl.NumberFormat("id-ID", {
													style: "currency",
													currency: "IDR",
													maximumFractionDigits: 0,
												}).format(Number(client.annual_revenue))
											: "Rp 0"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Jumlah Karyawan</p>
									<p className="font-medium">
										{formatThousandsId(Number(client.employee_count ?? 0))}{" "}
										Orang
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="classification" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Klasifikasi Usaha */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Klasifikasi Usaha
								</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground mb-1">Jenis Usaha</p>
									<p className="font-medium capitalize">
										{client.business_type || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Sektor Industri</p>
									<p className="font-medium capitalize">
										{client.industry_sector || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Paket Layanan</p>
									<p className="font-medium capitalize">
										{client.service_package || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Skala Bisnis</p>
									<p className="font-medium capitalize">
										{client.business_scale || "-"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Revenue Tahunan</p>
									<p className="font-medium">
										{client.annual_revenue != null
											? new Intl.NumberFormat("id-ID", {
													style: "currency",
													currency: "IDR",
													maximumFractionDigits: 0,
												}).format(Number(client.annual_revenue))
											: "Rp 0"}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground mb-1">Jumlah Karyawan</p>
									<p className="font-medium">
										{formatThousandsId(Number(client.employee_count ?? 0))}{" "}
										Orang
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Identitas Pajak & PKP */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Identitas Pajak & PKP
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 text-sm">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-muted-foreground mb-1">Status PKP</p>
										<p className="font-medium">
											{client.pkp_status ? "PKP" : "Non PKP"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">
											Tipe Wajib Pajak
										</p>
										<p className="font-medium capitalize">
											{client.taxpayer_type || "-"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">KPP Terdaftar</p>
										<p className="font-medium">{client.kpp_office || "-"}</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">
											PIC AR Kantor Pajak
										</p>
										<p className="font-medium">{client.pic_pkp_name || "-"}</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Kontak PIC AR</p>
										<p className="font-medium">
											{client.pic_pkp_contact || "-"}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground mb-1">Email PIC AR</p>
										<p className="font-medium">{client.pic_pkp_email || "-"}</p>
									</div>
								</div>

								<div>
									<p className="text-muted-foreground mb-2">
										Jenis Pajak Aktif
									</p>
									<div className="flex flex-wrap gap-2">
										{client.applicable_taxes?.length ? (
											client.applicable_taxes.map((tax) => (
												<Badge
													key={tax}
													variant="secondary"
													className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
												>
													{tax}
												</Badge>
											))
										) : (
											<span className="text-muted-foreground italic">
												Tidak ada pajak aktif
											</span>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Dokumen Pajak */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Dokumen Pajak
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 text-sm">
								{(() => {
									const taxDocs = client.client_tax_documents || [];

									// Label mapping for known document types
									const docTypeLabels: Record<string, string> = {
										registered_letter: "Surat Keterangan Terdaftar (SKT)",
										pkp_confirmation: "Surat Pengukuhan PKP",
									};

									const getDocLabel = (docType: string) => {
										return docTypeLabels[docType] || docType;
									};

									if (taxDocs.length === 0) {
										return (
											<p className="text-muted-foreground italic text-center py-4">
												Tidak ada dokumen pajak
											</p>
										);
									}

									return (
										<div className="space-y-4">
											{taxDocs.map((doc: any) => (
												<div
													key={doc.id || doc.document_type}
													className="rounded-lg border p-4"
												>
													<div className="flex items-center justify-between">
														<p className="font-medium">
															{getDocLabel(doc.document_type)}
														</p>
														<Badge
															variant="default"
															className="bg-green-100 text-green-800"
														>
															Tersedia
														</Badge>
													</div>
													<div className="mt-3 grid grid-cols-2 gap-4">
														<div>
															<p className="text-muted-foreground mb-1">
																Nomor Surat
															</p>
															<p className="font-medium">
																{doc.document_number || "-"}
															</p>
														</div>
														<div>
															<p className="text-muted-foreground mb-1">
																Tanggal Surat
															</p>
															<p className="font-medium">
																{formatDate(doc.document_date)}
															</p>
														</div>
														<div className="col-span-2">
															<p className="text-muted-foreground mb-1">
																Deskripsi
															</p>
															<p className="font-medium">
																{doc.description || "-"}
															</p>
														</div>
													</div>
												</div>
											))}
										</div>
									);
								})()}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="contacts" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Person In Charge (PIC) */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Person In Charge (PIC)
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								{isContactsLoading ? (
									<p className="text-muted-foreground italic">
										Memuat kontak...
									</p>
								) : contacts && contacts.length ? (
									(() => {
										const primary = contacts.find((c) => c.is_primary);
										if (!primary) {
											return (
												<p className="text-muted-foreground italic">
													Belum ada PIC utama yang ditandai.
												</p>
											);
										}
										return (
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-muted-foreground mb-1">Nama PIC</p>
													<p className="font-medium">{primary.name}</p>
												</div>
												<div>
													<p className="text-muted-foreground mb-1">Jabatan</p>
													<p className="font-medium">
														{primary.position || "-"}
													</p>
												</div>
												<div>
													<p className="text-muted-foreground mb-1">Email</p>
													<p className="font-medium">{primary.email || "-"}</p>
												</div>
												<div>
													<p className="text-muted-foreground mb-1">Telepon</p>
													<p className="font-medium">{primary.phone || "-"}</p>
												</div>
											</div>
										);
									})()
								) : (
									<p className="text-muted-foreground italic">
										Belum ada data kontak.
									</p>
								)}
							</CardContent>
						</Card>

						{/* Kontak Billing */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Kontak Billing
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								{isContactsLoading ? (
									<p className="text-muted-foreground italic">
										Memuat kontak...
									</p>
								) : contacts && contacts.length ? (
									(() => {
										const billing = contacts.find((c) => c.is_billing_contact);
										if (!billing) {
											return (
												<p className="text-muted-foreground italic">
													Belum ada kontak billing yang ditandai.
												</p>
											);
										}
										return (
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-muted-foreground mb-1">
														Nama Kontak Billing
													</p>
													<p className="font-medium">{billing.name}</p>
												</div>
												<div>
													<p className="text-muted-foreground mb-1">Jabatan</p>
													<p className="font-medium">
														{billing.position || "-"}
													</p>
												</div>
												<div>
													<p className="text-muted-foreground mb-1">Email</p>
													<p className="font-medium">{billing.email || "-"}</p>
												</div>
												<div>
													<p className="text-muted-foreground mb-1">Telepon</p>
													<p className="font-medium">{billing.phone || "-"}</p>
												</div>
											</div>
										);
									})()
								) : (
									<p className="text-muted-foreground italic">
										Belum ada data kontak.
									</p>
								)}
							</CardContent>
						</Card>

						{/* Kontak Lainnya */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Kontak Lainnya
								</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								{isContactsLoading ? (
									<p className="text-muted-foreground italic">
										Memuat kontak...
									</p>
								) : contacts && contacts.length ? (
									(() => {
										const others = contacts.filter(
											(c) => !c.is_primary && !c.is_billing_contact,
										);
										if (!others.length) {
											return (
												<p className="text-muted-foreground italic">
													Tidak ada kontak lain selain PIC dan Billing.
												</p>
											);
										}
										return (
											<div className="space-y-2">
												{others.map((c) => (
													<div key={c.id} className="py-2">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<div>
																<p className="text-muted-foreground mb-1">
																	Nama Kontak
																</p>
																<p className="font-medium break-all">
																	{c.name}{" "}
																	{c.is_authorized_signer && (
																		<span className="ml-2 text-xs rounded-full bg-green-100 text-green-700 px-2 py-0.5 dark:bg-green-900/40 dark:text-green-300">
																			Penandatangan Berwenang
																		</span>
																	)}
																</p>
															</div>
															<div>
																<p className="text-muted-foreground mb-1">
																	Jabatan
																</p>
																<p className="font-medium break-all">
																	{c.position || "-"}
																</p>
															</div>
															<div>
																<p className="text-muted-foreground mb-1">
																	Email
																</p>
																<p className="font-medium break-all">
																	{c.email || "-"}
																</p>
															</div>
															<div>
																<p className="text-muted-foreground mb-1">
																	Telepon
																</p>
																<p className="font-medium break-all">
																	{c.phone || "-"}
																</p>
															</div>
														</div>
													</div>
												))}
											</div>
										);
									})()
								) : (
									<p className="text-muted-foreground italic">
										Belum ada data kontak.
									</p>
								)}
							</CardContent>
						</Card>

						{/* Kantor Cabang */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
									Kantor Cabang
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								{isBranchesLoading ? (
									<p className="text-muted-foreground italic">
										Memuat kantor cabang...
									</p>
								) : branches && branches.length ? (
									<div className="space-y-3">
										{branches.map((branch, index) => (
											<div
												key={branch.id}
												className="border rounded-md px-4 py-3 bg-slate-50 dark:bg-slate-900/40"
											>
												<div className="flex items-center justify-between mb-2">
													<p className="font-semibold">Cabang {index + 1}</p>
													{branch.is_hq && (
														<span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 dark:bg-blue-900/40 dark:text-blue-200">
															Kantor Pusat
														</span>
													)}
												</div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div>
														<p className="text-muted-foreground mb-1">
															Pemegang Saham
														</p>
														<p className="font-medium">
															{branch.shareholder || "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">
															Jabatan/Struktur
														</p>
														<p className="font-medium">
															{branch.position || "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">Negara</p>
														<p className="font-medium">
															{branch.country || "Indonesia"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">
															Provinsi
														</p>
														<p className="font-medium">
															{branch.province || "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">Kota</p>
														<p className="font-medium">{branch.city || "-"}</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">
															Telepon
														</p>
														<p className="font-medium">{branch.phone || "-"}</p>
													</div>
													<div className="md:col-span-2">
														<p className="text-muted-foreground mb-1">Alamat</p>
														<p className="font-medium">
															{branch.address || "-"}
														</p>
													</div>
												</div>

												<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
													<div>
														<p className="text-muted-foreground mb-1">
															Nama PIC
														</p>
														<p className="font-medium">
															{branch.pic_name || "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">
															Jabatan PIC
														</p>
														<p className="font-medium">
															{branch.pic_position || "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">
															Email PIC
														</p>
														<p className="font-medium">
															{branch.pic_email || "-"}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground mb-1">
															Telepon PIC
														</p>
														<p className="font-medium">
															{branch.pic_phone || "-"}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground italic">
										Belum ada kantor cabang yang terdaftar.
									</p>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="accounting" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{/* Chart of Accounts Card */}
						<Card className="hover:shadow-md transition-shadow cursor-pointer group">
							<Link href={`/tenant/clients/${id}/accounts`}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
											<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										</div>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
										>
											Aktif
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										Chart of Accounts
									</h3>
									<p className="text-sm text-muted-foreground mt-1">
										Kelola daftar akun untuk klien ini
									</p>
									<div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
										Kelola Akun
										<ArrowLeft className="h-4 w-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
									</div>
								</CardContent>
							</Link>
						</Card>

						{/* Placeholder for future features */}
						<Card className="opacity-60">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
										<Activity className="h-5 w-5 text-slate-500" />
									</div>
									<Badge
										variant="secondary"
										className="bg-slate-100 text-slate-500 dark:bg-slate-800"
									>
										Coming Soon
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="font-semibold text-lg text-slate-500">
									Periode Akuntansi
								</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Pengaturan periode fiskal dan pelaporan
								</p>
							</CardContent>
						</Card>

						<Card className="opacity-60">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
										<Globe className="h-5 w-5 text-slate-500" />
									</div>
									<Badge
										variant="secondary"
										className="bg-slate-100 text-slate-500 dark:bg-slate-800"
									>
										Coming Soon
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<h3 className="font-semibold text-lg text-slate-500">
									Mata Uang
								</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Pengaturan mata uang dan kurs
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
				<TabsContent value="documents">
					{isLoading ? (
						<div className="p-8 text-center text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
							Memuat dokumen legal...
						</div>
					) : client?.client_legal_documents &&
						client.client_legal_documents.length ? (
						<div className="space-y-3">
							{client.client_legal_documents.map((doc: any) => (
								<div
									key={doc.id}
									className="flex items-center justify-between p-4 rounded-lg border bg-card"
								>
									<div className="space-y-1">
										<p className="font-medium">
											{doc.file_name || doc.document_type}
										</p>
										<p className="text-xs text-muted-foreground">
											{doc.document_type}
											{doc.uploaded_at &&
												` • Diupload ${new Date(doc.uploaded_at).toLocaleDateString("id-ID")}`}
										</p>
									</div>
									<div className="flex items-center gap-2">
										{doc.file_url && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="gap-2"
												onClick={() => handlePreviewLegalDoc(doc)}
											>
												<Eye className="h-4 w-4" />
												Preview
											</Button>
										)}
										<Badge variant="secondary" className="capitalize">
											{doc.status || "missing"}
										</Badge>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="p-8 text-center text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
							Dokumen Legal akan ditampilkan di sini
						</div>
					)}

					<Dialog
						open={isPreviewOpen}
						onOpenChange={(open) => {
							setIsPreviewOpen(open);
							if (!open) {
								setPreviewUrl(null);
								setIsPreviewLoading(false);
								setPreviewTitle("");
							}
						}}
					>
						<DialogContent className="sm:max-w-4xl">
							<DialogHeader>
								<DialogTitle>{previewTitle || "Preview Dokumen"}</DialogTitle>
							</DialogHeader>

							<div className="flex items-center justify-between gap-3">
								<div className="text-sm text-muted-foreground">
									{isPreviewLoading
										? "Memuat dokumen..."
										: previewUrl
											? " "
											: "Dokumen tidak tersedia"}
								</div>
								{previewUrl && (
									<a
										href={previewUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm font-medium text-blue-600 hover:underline"
									>
										Buka di tab baru
									</a>
								)}
							</div>

							<div className="w-full h-[70vh] rounded-md border overflow-hidden bg-card">
								{previewUrl ? (
									<iframe
										src={previewUrl}
										title={previewTitle || "Preview Dokumen"}
										className="w-full h-full"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
										{isPreviewLoading ? "Memuat..." : "Tidak ada preview"}
									</div>
								)}
							</div>
						</DialogContent>
					</Dialog>
				</TabsContent>
			</Tabs>
		</div>
	);
}
