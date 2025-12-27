import api from "@/lib/api";

export interface CoaAccount {
  account_code: string;
  account_name: string;
  account_type: string;
  normal_balance?: string;
  template_name?: string;
}

export interface CoaTemplate {
  name: string;
}

export const getCoaTemplates = async (): Promise<string[]> => {
  const response = await api.get<{ success: boolean; data: string[] }>(
    "/project/coa-templates"
  );
  return response.data.data;
};

export const getCoaTemplateDetails = async (
  templateName: string
): Promise<CoaAccount[]> => {
  const response = await api.get<{ success: boolean; data: CoaAccount[] }>(
    `/project/coa-templates/${templateName}`
  );
  return response.data.data;
};

export const saveCoaTemplate = async (
  templateName: string,
  accounts: CoaAccount[]
): Promise<void> => {
  await api.put(`/project/coa-templates/${templateName}`, {
    accounts,
  });
};

export const deleteCoaTemplate = async (templateName: string): Promise<void> => {
  await api.delete(`/project/coa-templates/${templateName}`);
};
