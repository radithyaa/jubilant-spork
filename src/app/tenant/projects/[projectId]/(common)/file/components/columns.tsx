'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Download, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch'; // Added Switch import
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Added useMutation, useQueryClient
import { toggleProjectFileVisibility } from '@/services/project-file.service'; // Added toggleProjectFileVisibility
import { toast } from 'sonner'; // Added toast for notifications
import { FileActionMenu } from './FileActionMenu';

// Define a type for your project file data
export type ProjectFile = {
  id: string;
  project_id: string;
  name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  visible_to_customer: boolean;
  created_by: string;
  created_at: string;
  removed_at: string | null;
  removed_by: string | null;
  is_removed: boolean;
  users_created: { name: string, email: string };
};

const VisibilityCell = ({ file }: { file: ProjectFile }) => {
  const queryClient = useQueryClient();

  const toggleVisibilityMutation = useMutation({
    mutationFn: (newValue: boolean) => toggleProjectFileVisibility(file.project_id, file.id, newValue),
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ['projectFiles', file.project_id] });
      const previousFiles = queryClient.getQueryData(['projectFiles', file.project_id]);
      queryClient.setQueryData(['projectFiles', file.project_id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          files: oldData.files.map((f: ProjectFile) =>
            f.id === file.id ? { ...f, visible_to_customer: newValue } : f
          ),
        };
      });
      return { previousFiles };
    },
    onSuccess: (data) => {
      toast.success('Visibilitas file berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['projectFiles', file.project_id] });
    },
    onError: (err: any, newValue, context) => {
      toast.error('Gagal memperbarui visibilitas file.', { description: err.message });
      queryClient.setQueryData(['projectFiles', file.project_id], context?.previousFiles);
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Switch
            checked={file.visible_to_customer}
            onCheckedChange={(newValue) => toggleVisibilityMutation.mutate(newValue)}
            disabled={toggleVisibilityMutation.isPending}
            aria-label={file.visible_to_customer ? 'Terlihat oleh klien' : 'Tidak terlihat oleh klien'}
            color='primary'
            className={`mx-auto flex ${file.visible_to_customer ? 'bg-primary' : 'bg-background'}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {file.visible_to_customer ? 'Terlihat oleh klien' : 'Tidak terlihat oleh klien'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const columns: ColumnDef<ProjectFile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama File" />
    ),
    cell: ({ row }) => (
      <a href={row.original.file_url} target="_blank" rel="noopener noreferrer" className=" hover:underline">
        {row.original.name}
      </a>
    ),
  },
  {
    accessorKey: 'file_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipe File" />
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.file_type || '-'}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'file_size',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ukuran" />
    ),
    cell: ({ row }) => {
      const sizeInBytes = row.original.file_size;
      if (sizeInBytes === null || sizeInBytes === undefined) return <span>-</span>;
      const KB = sizeInBytes / 1024;
      if (KB < 1024) return <span>{KB.toFixed(2)} KB</span>;
      const MB = KB / 1024;
      return <span>{MB.toFixed(2)} MB</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'visible_to_customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visible ke Klien" />
    ),
    cell: ({ row }) => <VisibilityCell file={row.original} />,
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Upload" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.created_at), 'dd/MM/yyyy HH:mm');
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_by',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diunggah Oleh" />
    ),
    cell: ({ row }) => row.original.users_created?.name || '-',
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <FileActionMenu file={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
