import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoaTemplates, getCoaTemplateDetails, saveCoaTemplate, deleteCoaTemplate, CoaAccount } from '@/services/coa-template.service';
import { toast } from 'sonner';

export const useCoaTemplates = () => {
  return useQuery({
    queryKey: ['coa-templates'],
    queryFn: getCoaTemplates,
  });
};

export const useCoaTemplateDetails = (templateName: string | null) => {
  return useQuery({
    queryKey: ['coa-templates', templateName],
    queryFn: () => getCoaTemplateDetails(templateName!),
    enabled: !!templateName,
  });
};

export const useSaveCoaTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateName, accounts }: { templateName: string; accounts: CoaAccount[] }) =>
      saveCoaTemplate(templateName, accounts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coa-templates'] });
      toast.success('Template CoA berhasil disimpan');
    },
    onError: (error) => {
      toast.error('Gagal menyimpan template CoA: ' + (error as any).message);
    },
  });
};

export const useDeleteCoaTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCoaTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coa-templates'] });
      toast.success('Template CoA berhasil dihapus');
    },
    onError: (error) => {
      toast.error('Gagal menghapus template CoA: ' + (error as any).message);
    },
  });
};
