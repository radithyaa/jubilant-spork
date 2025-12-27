import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { SortingState } from "@tanstack/react-table";

interface TenantUser {
	id: string;
	name: string;
	email: string;
	role: string;
	status: "active" | "inactive";
	joinedAt: string;
}

interface TenantUsersResponse {
	items: TenantUser[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

interface UseTenantUsersParams {
	tenantId: string;
	search?: string;
	status?: "active" | "inactive";
	page?: number;
	limit?: number;
	sorting?: SortingState;
}

export const useTenantUsers = (params: UseTenantUsersParams) => {
	const {
		tenantId,
		search,
		status,
		page = 1,
		limit = 10,
		sorting = [],
	} = params;

	return useQuery({
		queryKey: [
			"tenantUsers",
			tenantId,
			{ search, status, page, limit, sorting },
		],
		queryFn: async () => {
			const [sortBy, sortOrder] =
				sorting.length > 0
					? [sorting[0].id, sorting[0].desc ? "desc" : "asc"]
					: [undefined, undefined];

			const { data } = await api.get<{
				success: boolean;
				data: {
					items: TenantUser[];
					total: number;
					page: number;
					size: number;
				};
			}>(`/api/v1/tenants/${tenantId}/users`, {
				params: {
					search,
					status,
					page,
					size: limit,
					sortBy,
					sortOrder,
				},
			});

			const d = data.data;
			const response: TenantUsersResponse = {
				items: d.items,
				pagination: {
					page: d.page,
					limit: d.size,
					total: d.total,
					totalPages: Math.ceil((d.total || 0) / (d.size || 1)),
				},
			};

			return response;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useInviteUser = (tenantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: { email: string; role_id: string }) => {
			const { data } = await api.post(`/api/v1/tenants/${tenantId}/users`, payload);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
		},
	});
};

export const useUpdateUserRole = (tenantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			userId,
			roleId,
		}: {
			userId: string;
			roleId: string;
		}) => {
			const { data } = await api.put(
				`/api/v1/tenants/${tenantId}/users/${userId}/role`,
				{
					role_id: roleId,
				},
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
		},
	});
};

export const useDeactivateUser = (tenantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			userId,
			reason,
		}: {
			userId: string;
			reason?: string;
		}) => {
			const { data } = await api.delete(`/api/v1/tenants/${tenantId}/users/${userId}`, {
				data: { reason },
			});
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
		},
	});
};

export const useReactivateUser = (tenantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userId: string) => {
			const { data } = await api.post(
				`/api/v1/tenants/${tenantId}/users/${userId}/reactivate`,
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
		},
	});
};

export const useImportUsers = (tenantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);
			const { data } = await api.post(
				`/api/v1/tenants/${tenantId}/users/import`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tenantUsers", tenantId] });
		},
	});
};
