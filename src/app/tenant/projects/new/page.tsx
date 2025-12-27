"use client";

import RBAC from "@/components/rbac/RBAC";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DetailProjectTab from "./components/DetailProjectTab";
import ProjectSettingsTab from "./components/ProjectSettingsTab";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	projectSchema,
	type ProjectFormInputValues,
	type ProjectFormValues,
} from "@/validators/project.schema";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

function NewProjectPageContent() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();

	const methods = useForm<ProjectFormInputValues, any, ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			scopes: [],
			escalation_user_ids: [],
			team_assignments: {},
			due_policy_days: 3, // Default H+3
			client_id: searchParams.get("clientId") || "", // Read clientId from URL query
		},
	});

	// Preselect client if clientId is provided in the query string
	useEffect(() => {
		const clientId = searchParams.get("clientId");
		if (clientId) {
			methods.setValue("client_id", clientId);
		}
	}, [searchParams, methods]);

	const onSubmit = async (data: ProjectFormValues) => {
		try {
			// Transform frontend data to backend DTO
			const selectedSanitizedScopes = data.scopes.map((scope) =>
				scope.replace(/[\s.]/g, "_"),
			);

			// Filter team assignments to keep only those that match selected sanitized scopes
			const validAssignments = Object.entries(data.team_assignments).filter(
				([key]) => selectedSanitizedScopes.includes(key),
			);

			const members = validAssignments.flatMap(
				([sanitizedScopeKey, assignment]) => {
					// Find original scope name from data.scopes that matches this sanitized key
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
				type: "tax_consulting", // Default project type for now, replace with actual selection from UI if implemented
			};

			// Remove frontend-only fields
			// @ts-ignore
			delete payload.team_assignments;

			await api.post("/project", payload);

			toast.success("Berhasil", {
				description: "Project berhasil dibuat.",
			});
			queryClient.invalidateQueries({ queryKey: ["projects"] });

			router.push("/tenant/projects");
		} catch (error: any) {
			console.error(error);
			toast.error("Gagal", {
				description: "Project gagal dibuat.",
			});
		}
	};

	const onError = (errors: any) => {
		console.error("Form validation errors:", errors);
		toast.error("Gagal", {
			description: "Mohon periksa kembali formulir Anda.",
		});
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit, onError)}
				className="w-full space-y-4"
			>
				{/* Header */}
				<div className="flex items-center justify-between gap-2.5 self-stretch">
					<div className="flex flex-1 flex-col gap-[5px]">
						<h1 className="font-dm text-3xl font-bold leading-[42px] tracking-[-0.68px]">
							Tambah Project Baru
						</h1>
					</div>

					<Button
						type="submit"
						className="flex"
						disabled={methods.formState.isSubmitting}
					>
						<Plus className="h-6 w-6" />
						<span className="text-sm font-medium leading-5 tracking-[0.1px]">
							{methods.formState.isSubmitting ? "Menyimpan..." : "Buat Project"}
						</span>
					</Button>
				</div>

				{/* Tabs */}
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

export default function NewProjectPage() {
	return (
		<RBAC
			requiredPermission={["project:manage", "client:manage"]}
			unauthorizedPage={true}
		>
			<NewProjectPageContent />
		</RBAC>
	);
}
