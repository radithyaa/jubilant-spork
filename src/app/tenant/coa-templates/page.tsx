'use client';

import { useState } from 'react';
import { useCoaTemplates, useDeleteCoaTemplate } from '@/hooks/useCoaTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FileText, Loader2 } from 'lucide-react';
import { CoaTemplateModal } from './components/CoaTemplateModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import RBAC from '@/components/rbac/RBAC';

export default function CoaTemplatesPage() {
  const { data: templates, isLoading } = useCoaTemplates();
  const deleteMutation = useDeleteCoaTemplate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (templateName: string) => {
    setEditingTemplate(templateName);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (templateName: string) => {
    setDeletingTemplate(templateName);
  };

  const confirmDelete = async () => {
    if (deletingTemplate) {
      await deleteMutation.mutateAsync(deletingTemplate);
      setDeletingTemplate(null);
    }
  };

  return (
    <RBAC requiredPermission="client:manage" unauthorizedPage>
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Template Chart of Accounts (CoA)</h1>
            <p className="text-muted-foreground mt-2">
              Kelola template akun standar untuk digunakan saat membuat klien baru.
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Buat Template Baru
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Template</CardTitle>
            <CardDescription>
              Semua template CoA yang tersedia untuk tenant ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Nama Template</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates && templates.length > 0 ? (
                    templates.map((templateName, index) => (
                      <TableRow key={templateName}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {templateName}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(templateName)}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(templateName)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                        Belum ada template CoA. Silakan buat yang baru.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <CoaTemplateModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          templateNameToEdit={editingTemplate}
        />

        <Dialog open={!!deletingTemplate} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apakah Anda yakin?</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan. Template <strong>{deletingTemplate}</strong> akan dihapus secara permanen.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingTemplate(null)}>Batal</Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RBAC>
  );
}
