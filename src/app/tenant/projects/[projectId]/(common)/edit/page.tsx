"use client";

import RBAC from "@/components/rbac/RBAC";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import DetailProjectTab from "../../../new/components/DetailProjectTab";
import ProjectSettingsTab from "../../../new/components/ProjectSettingsTab";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	projectSchema,
	type ProjectFormInputValues,
	type ProjectFormValues,
} from "@/validators/project.schema";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getProjectById, updateProject } from "@/services/project.service";

function EditProjectPageContent() {
	const router = useRouter();
	const params = useParams();
	const queryClient = useQueryClient();
	const projectId = params.projectId as string;

	const { data: project, isLoading } = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProjectById(projectId),
	});

	const methods = useForm<ProjectFormInputValues, any, ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			scopes: [],
			escalation_user_ids: [],
			team_assignments: {},
			due_policy_days: 3,
		},
	});

	useEffect(() => {
		if (project) {
			const scopes = project.project_scopes.map((s) => s.scope_name);
			const team_assignments: any = {};

			scopes.forEach((scope) => {
				const sanitizedScope = scope.replace(/[\s.]/g, "_");
				// @ts-ignore
				const members =
					project.project_members?.filter((m) => m.scope === scope) || [];
				// Map backend roles (with underscores) to what frontend might expect if mismatched
                // Assuming backend sends "Team_Leader" but frontend logic might look for "Team Leader" or "Team_Leader"
                // Based on provided data, backend sends "Team_Leader" and "Team_Member".
                // The schema update changed roles to "Team_Leader".
                // Let's handle both to be safe or strictly what's in response.
				const leader = members.find((m) => m.role === "Team_Leader" || m.role === "Team Leader");
				const member = members.find((m) => m.role === "Team_Member" || m.role === "Team Member");

				if (leader || member) {
					team_assignments[sanitizedScope] = {
						leader_id: leader?.user_id,
						member_id: member?.user_id,
					};
				}
			});

			// @ts-ignore
			const escalation_user_ids =
				project.project_escalations?.map((e) => e.user_id) || [];

            // Handle nested objects from backend response
            const clientId = project.client_id || project.clients?.id;
            const pmoId = project.pmo_id || project.users_projects_pmo_idTousers?.id;

			methods.reset({
				name: project.name,
				client_id: clientId,
				pmo_id: pmoId,
				contract_code: project.code,
				contract_basis: project.contract_basis || undefined,
				contract_date: project.contract_date
					? new Date(project.contract_date)
					: undefined,
				start_date: project.start_date
					? new Date(project.start_date)
					: undefined,
				end_date: project.end_date ? new Date(project.end_date) : undefined,
				budget: Number(project.budget), // Ensure number
				notes: project.notes || undefined,
				due_policy_days: project.due_policy_days || 3,
				bast_template_id: project.bast_template_id || undefined,
				invoice_template_id: project.invoice_template_id || undefined,
				scopes,
				team_assignments,
				escalation_user_ids,
			});


		}
	}, [project, methods]);

	const onSubmit = async (data: ProjectFormValues) => {
		try {
			const selectedSanitizedScopes = data.scopes.map((scope) =>
				scope.replace(/[\s.]/g, "_"),
			);

			const validAssignments = Object.entries(data.team_assignments).filter(
				([key]) => selectedSanitizedScopes.includes(key),
			);

			const members = validAssignments.flatMap(
				([sanitizedScopeKey, assignment]) => {
					const originalScope = data.scopes.find(
						(scope) => scope.replace(/[\s.]/g, "_") === sanitizedScopeKey,
					);
					if (!originalScope) return [];
					return [
						{
							user_id: assignment.leader_id,
							role: "Team Leader",
							scope: originalScope,
						},
						{
							user_id: assignment.member_id,
							role: "Team Member",
							scope: originalScope,
						},
					];
				},
			);

			const payload = {
				...data,
				members,
				code: data.contract_code,
			};
			// @ts-ignore
			delete payload.team_assignments;

			await updateProject(projectId, payload);

			toast.success("Berhasil", {
				description: "Project berhasil diperbarui.",
			});
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			queryClient.invalidateQueries({ queryKey: ["project", projectId] });

			router.push("/tenant/projects");
		} catch (error: any) {
			console.error(error);
			toast.error("Gagal", {
				description: "Project gagal diperbarui.",
			});
		}
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className="w-full space-y-4"
			>
				<div className="flex items-center justify-between gap-2.5 self-stretch">
					<div className="flex flex-1 flex-col gap-[5px]">
						<h1 className="font-dm text-3xl font-bold leading-[42px] tracking-[-0.68px]">
							Edit Project
						</h1>
					</div>
					<Button
						type="submit"
						className="flex"
						disabled={methods.formState.isSubmitting}
					>
						<Save className="h-4 w-4 mr-2 font-thin" />
						<span className="text-sm font-medium leading-5 tracking-[0.1px]">
							{methods.formState.isSubmitting
								? "Menyimpan..."
								: "Simpan Perubahan"}
						</span>
					</Button>
				</div>

				<Tabs defaultValue="detail" className="w-full">
					<TabsList className="mb-4 bg-card flex w-full">
						<TabsTrigger value="detail" className="flex-1">
							Detail Project
						</TabsTrigger>
						<TabsTrigger value="settings" className="flex-1">
							Project Settings
						</TabsTrigger>
					</TabsList>

					<TabsContent value="detail" className="mt-0">
						<DetailProjectTab />
					</TabsContent>

					<TabsContent value="settings" className="mt-0">
						<ProjectSettingsTab />
					</TabsContent>
				</Tabs>
			</form>
		</FormProvider>
	);
}

export default function EditProjectPage() {
	return (
		<RBAC requiredPermission="project:manage" unauthorizedPage={true}>
			<EditProjectPageContent />
		</RBAC>
	);
}
