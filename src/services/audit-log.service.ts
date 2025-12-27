import api from '@/lib/api';

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  old_values: any;
  new_values: any;
  project_id: string;
  tenant_id: string;
  user_id: string;
  ip_address: string;
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

export interface AuditLogResponse {
  success: boolean;
  data: {
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
  };
}

export const auditLogService = {
  getLogs: async (projectId: string, params?: any) => {
    const response = await api.get<AuditLogResponse>('/audit/logs', {
      params: {
        project_id: projectId,
        ...params,
      },
    });
    return response.data;
  },
};
