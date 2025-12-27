import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { CoaAccount } from '@/services/coa-template.service';
import { useCoaTemplateDetails, useSaveCoaTemplate } from '@/hooks/useCoaTemplates';

interface CoaTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateNameToEdit: string | null;
}

export function CoaTemplateModal({ open, onOpenChange, templateNameToEdit }: CoaTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [accounts, setAccounts] = useState<CoaAccount[]>([]);
  const { data: existingAccounts, isLoading: isLoadingDetails } = useCoaTemplateDetails(templateNameToEdit);
  const saveMutation = useSaveCoaTemplate();

  useEffect(() => {
    if (templateNameToEdit) {
      setTemplateName(templateNameToEdit);
      if (existingAccounts) {
        setAccounts(existingAccounts);
      }
    } else {
      setTemplateName('');
      setAccounts([]);
    }
  }, [templateNameToEdit, existingAccounts, open]);

  const handleAddAccount = () => {
    setAccounts([
      ...accounts,
      { account_code: '', account_name: '', account_type: 'Asset', normal_balance: 'Debit' }
    ]);
  };

  const handleRemoveAccount = (index: number) => {
    const newAccounts = [...accounts];
    newAccounts.splice(index, 1);
    setAccounts(newAccounts);
  };

  const handleAccountChange = (index: number, field: keyof CoaAccount, value: string) => {
    const newAccounts = [...accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setAccounts(newAccounts);
  };

  const handleSave = async () => {
    if (!templateName) return;
    await saveMutation.mutateAsync({ templateName, accounts });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{templateNameToEdit ? 'Edit Template CoA' : 'Buat Template CoA Baru'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Nama Template</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Contoh: Manufaktur, Jasa, Trading"
              disabled={!!templateNameToEdit}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Daftar Akun</h3>
              <Button onClick={handleAddAccount} size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Tambah Akun
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Akun</TableHead>
                    <TableHead>Nama Akun</TableHead>
                    <TableHead>Tipe Akun</TableHead>
                    <TableHead>Saldo Normal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={account.account_code}
                          onChange={(e) => handleAccountChange(index, 'account_code', e.target.value)}
                          placeholder="1-1000"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={account.account_name}
                          onChange={(e) => handleAccountChange(index, 'account_name', e.target.value)}
                          placeholder="Kas"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={account.account_type}
                          onValueChange={(value) => handleAccountChange(index, 'account_type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asset">Asset</SelectItem>
                            <SelectItem value="Liability">Liability</SelectItem>
                            <SelectItem value="Equity">Equity</SelectItem>
                            <SelectItem value="Revenue">Revenue</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={account.normal_balance || 'Debit'}
                          onValueChange={(value) => handleAccountChange(index, 'normal_balance', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Debit">Debit</SelectItem>
                            <SelectItem value="Credit">Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAccount(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {accounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                        Belum ada akun. Klik "Tambah Akun" untuk memulai.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending || !templateName}>
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
