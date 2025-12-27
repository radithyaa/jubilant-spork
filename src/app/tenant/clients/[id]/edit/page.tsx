'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients';
import { useClientContacts, useUpsertClientContact } from '@/hooks/useClientContacts';
import { useClientBranches, useUpsertClientBranch, useDeleteClientBranch } from '@/hooks/useClientBranches';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Save, ArrowLeft, Plus, Eye, Upload, FileText, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const stripNonDigits = (value: unknown) => String(value ?? '').replace(/\D/g, '');

const formatThousandsId = (value: number) => {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value);
};

const formatFileSizeLabel = (bytes?: number | null) => {
  if (!bytes || !Number.isFinite(bytes)) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const parseDateString = (value: unknown) => {
  if (typeof value !== 'string' || !value) return undefined;
  const parts = value.split('-');
  if (parts.length !== 3) return undefined;
  const [y, m, d] = parts.map(Number);
  return new Date(y, m - 1, d);
};

// Zod Schema (Simplified version of CreateClientModalUpdated)
const clientFormSchema = z.object({
  code: z.string().min(1, 'Kode klien wajib diisi'), // Added code field
  name: z.string().min(1, 'Nama perusahaan wajib diisi'),
  brand_name: z.string().optional(),
  type: z.string().min(1, 'Tipe klien wajib diisi'),
  phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  website: z.string().url('Website tidak valid').optional().or(z.literal('')),
  address: z.string().min(1, 'Alamat wajib diisi'),
  country: z.string().default('Indonesia'),
  province: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),

  // Corporate Info
  nik: z.string().optional(),
  npwp: z.string().optional(),
  nib: z.string().optional(),
  deed_number: z.string().optional(),
  notary_name: z.string().optional(),
  notary_location: z.string().optional(),
  notary_contact: z.string().optional(),
  establishment_date: z.string().optional(),
  employee_count: z.coerce
    .number()
    .min(0)
    .refine(Number.isInteger, 'Jumlah karyawan harus bilangan bulat')
    .optional(),
  basic_capital: z.coerce.number().min(0).optional(),
  paid_capital: z.coerce.number().min(0).optional(),

  // Classification
  business_scale: z.string().optional(),
  business_type: z.string().optional(), // Renamed from industry to business_type
  industry_sector: z.string().optional(),
  annual_revenue: z.coerce.number().min(0).optional(),
  service_package: z.string().optional(),

  // Tax Identity
  taxpayer_type: z.string().optional(),
  kpp_office: z.string().optional(),
  pkp_status: z.boolean().optional(),
  applicable_taxes: z.array(z.string()).optional(),
  pic_pkp_name: z.string().optional(), // Added PKP contact fields
  pic_pkp_contact: z.string().optional(),
  pic_pkp_email: z.string().email('Email PIC PKP tidak valid').optional().or(z.literal('')),

  // Accounting Preferences
  use_default_coa: z.boolean().optional(),
  coa_template: z.string().optional(),
  use_tenant_voucher_numbering: z.boolean().optional(),
  voucher_format: z.string().optional(),
  reset_frequency: z.string().optional(),
  padding_number: z.number().optional(),
  voucher_prefix: z.string().optional(),
  voucher_suffix: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

type BranchForm = {
  id?: string;
  shareholder: string;
  position: string;
  country: string;
  province: string;
  city: string;
  phone: string;
  address: string;
  is_hq: boolean;
  pic_name: string;
  pic_position: string;
  pic_email: string;
  pic_phone: string;
};

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const { tenant } = useAuth();
  const { toast } = useToast();
  const id = params.id as string;

  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const { data: client, isLoading } = useClient(tenant.id, id);
  const { data: contacts } = useClientContacts(tenant.id, id);
  const upsertContactMutation = useUpsertClientContact();
  const { data: branches } = useClientBranches(tenant.id, id);
  const upsertBranchMutation = useUpsertClientBranch();
  const deleteBranchMutation = useDeleteClientBranch();

  const [activeTab, setActiveTab] = useState('identity');
  const [businessTypeOptions, setBusinessTypeOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [coaTemplateOptions, setCoaTemplateOptions] = useState<Array<{ key: string; label: string }>>([]);

  const [picContact, setPicContact] = useState({
    id: '',
    name: '',
    position: '',
    email: '',
    phone: '',
  });

  const [billingContact, setBillingContact] = useState({
    id: '',
    name: '',
    position: '',
    email: '',
    phone: '',
  });

  const [branchesState, setBranchesState] = useState<BranchForm[]>([]);
  const [deletedBranchIds, setDeletedBranchIds] = useState<string[]>([]);

  // Legal Documents State
  const [legalDocuments, setLegalDocuments] = useState<{
    id?: string;
    document_type: string;
    document_number?: string;
    document_date?: string;
    expiry_date?: string;
    issuing_authority?: string;
    file_url?: string;
    file_name?: string;
    file_size?: number;
    mime_type?: string;
    status?: string;
    upload_date?: string;
    notes?: string;
    is_required: boolean;
  }[]>([
    { document_type: 'akta_pendirian', is_required: true },
    { document_type: 'nib', is_required: true },
    { document_type: 'npwp', is_required: true },
  ]);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    document_type: '',
    expiry_date: '',
    file: null as File | null,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      code: '', // Added default value
      country: 'Indonesia',
      applicable_taxes: [],
      pkp_status: false,
      pic_pkp_name: '', // Added default value
      pic_pkp_contact: '', // Added default value
      pic_pkp_email: '', // Added default value
    },
  });

  const watchedTaxes = watch('applicable_taxes') || [];
  console.log('Current watched taxes:', watchedTaxes); // DEBUG LOG

  // Sync existing contacts into local PIC & Billing state
  useEffect(() => {
    if (!contacts || contacts.length === 0) return;

    const primary = contacts.find((c) => c.is_primary);
    const billing = contacts.find((c) => c.is_billing_contact);

    if (primary) {
      setPicContact({
        id: primary.id,
        name: primary.name || '',
        position: primary.position || '',
        email: primary.email || '',
        phone: primary.phone || '',
      });
    }

    if (billing) {
      setBillingContact({
        id: billing.id,
        name: billing.name || '',
        position: billing.position || '',
        email: billing.email || '',
        phone: billing.phone || '',
      });
    }
  }, [contacts]);

  // Sync existing branches into local editable state
  useEffect(() => {
    if (!branches) return;

    setBranchesState(
      branches.map((b) => ({
        id: b.id,
        shareholder: b.shareholder || '',
        position: b.position || '',
        country: b.country || 'Indonesia',
        province: b.province || '',
        city: b.city || '',
        phone: b.phone || '',
        address: b.address || '',
        is_hq: !!b.is_hq,
        pic_name: b.pic_name || '',
        pic_position: b.pic_position || '',
        pic_email: b.pic_email || '',
        pic_phone: b.pic_phone || '',
      })),
    );
  }, [branches]);

  // Populate form when data loads
  useEffect(() => {
    if (client) {
      reset({
        code: client.code || '', // Populate code
        name: client.name || '',
        brand_name: client.brand_name || '',
        type: client.type || 'corporate',
        phone: client.phone || '',
        email: client.email || '',
        website: client.website || '',
        address: client.address || '',
        country: client.country || 'Indonesia',
        province: client.province || '',
        city: client.city || '',
        postal_code: client.postal_code || '',
        nik: client.nik || '',
        npwp: client.npwp || '',
        nib: client.nib || '',
        deed_number: client.deed_number || '',
        notary_name: client.notary_name || '',
        notary_location: client.notary_location || '',
        notary_contact: client.notary_contact || '',
        establishment_date: client.establishment_date ? new Date(client.establishment_date).toISOString().split('T')[0] : '',
        employee_count: Number(client.employee_count) || 0, // Convert to number
        basic_capital: Number(client.basic_capital) || 0, // Convert to number
        paid_capital: Number(client.paid_capital) || 0, // Convert to number

        // Classification
        business_scale: client.business_scale || '',
        business_type: client.business_type || '',
        industry_sector: client.industry_sector || '',
        annual_revenue: Number(client.annual_revenue) || 0, // Convert to number
        service_package: client.service_package || '',

        // Tax
        taxpayer_type: client.taxpayer_type || '',
        kpp_office: client.kpp_office || '',
        pkp_status: client.pkp_status || false,
        applicable_taxes: client.applicable_taxes || [],
        pic_pkp_name: client.pic_pkp_name || '',
        pic_pkp_contact: client.pic_pkp_contact || '',
        pic_pkp_email: client.pic_pkp_email || '',

        // Accounting Preferences
        use_default_coa: client.use_default_coa ?? true,
        coa_template: client.coa_template || '',
        use_tenant_voucher_numbering: client.use_tenant_voucher_numbering ?? true,
        voucher_format: client.voucher_format || '',
        reset_frequency: client.reset_frequency || 'monthly',
        padding_number: client.padding_number || 4,
        voucher_prefix: client.voucher_prefix || '',
        voucher_suffix: client.voucher_suffix || '',
      });

      const clientDocs = (client as any)?.client_legal_documents as any[] | undefined;
      if (Array.isArray(clientDocs)) {
        setLegalDocuments((prev) => {
          const requiredTypes = new Set(prev.filter((d) => d.is_required).map((d) => d.document_type));
          const mapped = clientDocs.map((d) => ({
            id: d.id,
            document_type: d.document_type,
            document_number: d.document_number || '',
            document_date: d.document_date ? new Date(d.document_date).toISOString().split('T')[0] : '',
            expiry_date: d.expiry_date ? new Date(d.expiry_date).toISOString().split('T')[0] : '',
            issuing_authority: d.issuing_authority || '',
            file_url: d.file_url || '',
            file_name: d.file_name || '',
            file_size: d.file_size != null ? Number(d.file_size) : undefined,
            mime_type: d.mime_type || '',
            status: d.status || '',
            upload_date: d.uploaded_at ? new Date(d.uploaded_at).toISOString() : '',
            notes: d.notes || '',
            is_required: requiredTypes.has(d.document_type),
          }));

          const requiredBase = [...requiredTypes].map((t) => ({ document_type: t, is_required: true }));
          const merged = [...requiredBase, ...mapped].reduce((acc: any[], cur: any) => {
            const idx = acc.findIndex((x) => x.document_type === cur.document_type);
            if (idx >= 0) acc[idx] = { ...acc[idx], ...cur };
            else acc.push(cur);
            return acc;
          }, []);
          return merged;
        });
      }
    }
  }, [client, reset]);

  useEffect(() => {
    let cancelled = false;

    const loadBusinessTypes = async () => {
      try {
        const resp = await api.get('project/reference-types', {
          params: { type: 'BUSINESS_TYPE' },
        });

        const data = resp?.data?.data ?? resp?.data ?? [];
        const normalized = Array.isArray(data)
          ? data
              .map((item: any) => ({
                id: String(item?.id ?? item?.name ?? ''),
                name: String(item?.name ?? item?.description ?? item?.id ?? ''),
              }))
              .filter((x: any) => x.id && x.name)
          : [];

        if (!cancelled) setBusinessTypeOptions(normalized);
      } catch {
        if (!cancelled) setBusinessTypeOptions([]);
      }
    };

    const loadCoaTemplates = async () => {
      try {
        const resp = await api.get('project/coa-templates');
        const data = resp?.data?.data ?? resp?.data ?? [];

        const normalized = Array.isArray(data)
          ? data
              .map((name: any) => String(name ?? '').trim())
              .filter((name: string) => !!name)
              .map((name: string) => ({ key: name, label: name }))
          : [];

        if (!cancelled) {
          if (normalized.length > 0) {
            setCoaTemplateOptions(normalized);
          } else {
            setCoaTemplateOptions([
              { key: 'trading', label: 'Trading' },
              { key: 'manufacturing', label: 'Manufacturing' },
              { key: 'services', label: 'Services' },
              { key: 'construction', label: 'Construction' },
            ]);
          }
        }
      } catch {
        if (!cancelled) {
          setCoaTemplateOptions([
            { key: 'trading', label: 'Trading' },
            { key: 'manufacturing', label: 'Manufacturing' },
            { key: 'services', label: 'Services' },
            { key: 'construction', label: 'Construction' },
          ]);
        }
      }
    };

    loadBusinessTypes();
    loadCoaTemplates();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddBranch = () => {
    setBranchesState((prev) => [
      ...prev,
      {
        shareholder: '',
        position: '',
        country: 'Indonesia',
        province: '',
        city: '',
        phone: '',
        address: '',
        is_hq: false,
        pic_name: '',
        pic_position: '',
        pic_email: '',
        pic_phone: '',
      },
    ]);
  };

  const handleBranchChange = (
    index: number,
    field: keyof BranchForm,
    value: string | boolean,
  ) => {
    setBranchesState((prev) =>
      prev.map((branch, i) =>
        i === index
          ? {
              ...branch,
              [field]: value,
            }
          : branch,
      ),
    );
  };

  const handleRemoveBranch = (index: number) => {
    setBranchesState((prev) => {
      const toRemove = prev[index];
      if (toRemove?.id) {
        setDeletedBranchIds((ids) =>
          ids.includes(toRemove.id as string)
            ? ids
            : [...ids, toRemove.id as string],
        );
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: any) => {
    console.log('Submitting form data:', data); // DEBUG LOG
    try {
      const payload = {
        ...data,
        legalDocuments: legalDocuments
          .filter((d) => d.document_type)
          .map((d) => ({
            document_type: d.document_type,
            document_number: d.document_number || '',
            document_date: d.document_date || null,
            expiry_date: d.expiry_date || null,
            issuing_authority: d.issuing_authority || null,
            file_url: d.file_url || null,
            file_name: d.file_name || null,
            file_size: d.file_size ?? null,
            mime_type: d.mime_type || null,
            status: d.status || (d.file_url ? 'uploaded' : 'missing'),
            upload_date: d.upload_date || null,
            notes: d.notes || null,
          })),
      };

      const result = await updateClientMutation.mutateAsync({
        tenantId: tenant.id,
        id,
        data: payload,
      });
      console.log('Update successful, server response:', result); // DEBUG LOG

      // Upsert PIC & Billing contacts + cabang
      const mutationPromises: Promise<any>[] = [];

      if (picContact.name || picContact.email || picContact.phone) {
        mutationPromises.push(
          upsertContactMutation.mutateAsync({
            tenantId: tenant.id,
            clientId: id,
            contactId: picContact.id || undefined,
            data: {
              name: picContact.name,
              position: picContact.position,
              email: picContact.email,
              phone: picContact.phone,
              is_primary: true,
              is_authorized_signer: true,
              is_billing_contact: false,
            },
          }),
        );
      }

      if (billingContact.name || billingContact.email || billingContact.phone) {
        mutationPromises.push(
          upsertContactMutation.mutateAsync({
            tenantId: tenant.id,
            clientId: id,
            contactId: billingContact.id || undefined,
            data: {
              name: billingContact.name,
              position: billingContact.position,
              email: billingContact.email,
              phone: billingContact.phone,
              is_primary: false,
              is_billing_contact: true,
            },
          }),
        );
      }

      // Upsert branches (create/update)
      for (const branch of branchesState) {
        const payload = {
          shareholder: branch.shareholder || null,
          position: branch.position || null,
          country: branch.country || 'Indonesia',
          province: branch.province || null,
          city: branch.city || null,
          phone: branch.phone || null,
          address: branch.address || null,
          is_hq: branch.is_hq ?? false,
          pic_name: branch.pic_name || null,
          pic_position: branch.pic_position || null,
          pic_email: branch.pic_email || null,
          pic_phone: branch.pic_phone || null,
        };

        mutationPromises.push(
          upsertBranchMutation.mutateAsync({
            tenantId: tenant.id,
            clientId: id,
            branchId: branch.id,
            data: payload,
          }),
        );
      }

      // Delete removed branches
      for (const branchId of deletedBranchIds) {
        mutationPromises.push(
          deleteBranchMutation.mutateAsync({
            tenantId: tenant.id,
            clientId: id,
            branchId,
          }),
        );
      }

      if (mutationPromises.length) {
        await Promise.all(mutationPromises);
      }

      toast({
        title: 'Berhasil',
        description: 'Data klien berhasil diperbarui',
      });
      
      router.push(`/tenant/clients/${id}`);
    } catch (error) {
      console.error('Failed to update client:', error);
      const anyErr = error as any;
      const isNetworkError = !anyErr?.response && (anyErr?.message === 'Network Error' || anyErr?.code === 'ERR_NETWORK');
      const errorMessage = isNetworkError
        ? 'Network error: tidak bisa menghubungi server. Pastikan gateway (localhost:8000) dan service-client_management (localhost:3005) sedang berjalan.'
        : anyErr?.response?.data?.message || anyErr?.message || 'Terjadi kesalahan saat menyimpan data';
      console.error('Error details:', anyErr?.response?.data || anyErr?.message); // DEBUG LOG
      
      toast({
        title: 'Gagal menyimpan',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const onValidationError = (validationErrors: FieldErrors<ClientFormData>) => {
    console.log('Validation errors:', validationErrors);
    const errorFields = Object.keys(validationErrors);

    if (!errorFields.length) return;

    toast({
      title: 'Form tidak lengkap',
      description: `Mohon lengkapi field berikut: ${errorFields.join(', ')}`,
      variant: 'destructive',
    });
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus klien ini?')) {
      deleteClientMutation.mutate(
        { tenantId: tenant.id, id },
        {
          onSuccess: () => {
            router.push('/tenant/clients');
          },
        }
      );
    }
  };

  if (isLoading) {
    return <div className="p-6 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/tenant/clients" className="hover:text-primary">Client</Link>
          <span>/</span>
          <Link href={`/tenant/clients/${id}`} className="hover:text-primary">Detail Client</Link>
          <span>/</span>
          <span>Edit Client</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Edit Data Klien</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
            <Button 
              type="submit"
              form="edit-client-form"
              className="bg-blue-600 hover:bg-blue-700 dark:text-white"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none space-x-6 mb-6 overflow-x-auto">
          <TabsTrigger
            value="identity"
            className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Identitas Perusahaan
          </TabsTrigger>
          <TabsTrigger
            value="classification"
            className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Klasifikasi Usaha dan Pajak
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Kontak & Cabang
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Preferensi Akuntansi
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Dokumen Legal
          </TabsTrigger>
        </TabsList>

        <form id="edit-client-form" onSubmit={handleSubmit(onSubmit, onValidationError)}>
          <TabsContent value="identity" className="space-y-6" forceMount style={{ display: activeTab === 'identity' ? 'block' : 'none' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informasi Dasar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Informasi Dasar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama *</Label>
                      <Input 
                        id="name" 
                        {...register('name')} 
                        placeholder="Nama klien/wajib pajak" 
                        className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand_name">Nama Merek</Label>
                      <Input id="brand_name" {...register('brand_name')} placeholder="Merek A" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipe Klien *</Label>
                      <Select onValueChange={(val) => setValue('type', val)} defaultValue={client?.type || 'corporate'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="non_profit">Non-Profit</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telepon *</Label>
                      <Input 
                        id="phone" 
                        {...register('phone')} 
                        placeholder="08123456789" 
                        className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...register('website')} placeholder="https://example.com" />
                  </div>
                </CardContent>
              </Card>

              {/* Alamat */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Alamat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <Textarea 
                      id="address" 
                      {...register('address')} 
                      placeholder="Jl. Contoh, No 321" 
                      className={`h-24 ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Negara *</Label>
                      <Input id="country" {...register('country')} defaultValue="Indonesia" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Provinsi</Label>
                      <Input id="province" {...register('province')} placeholder="DKI Jakarta" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota</Label>
                      <Input id="city" {...register('city')} placeholder="Jakarta Selatan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Kode Pos</Label>
                      <Input id="postal_code" {...register('postal_code')} placeholder="12345" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informasi Korporasi */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Informasi Korporasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nik">NIK</Label>
                      <Input id="nik" {...register('nik')} placeholder="16 Digit NIK" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="npwp">NPWP</Label>
                      <Input id="npwp" {...register('npwp')} placeholder="15/16 Digit NPWP" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nib">NIB</Label>
                      <Input id="nib" {...register('nib')} placeholder="13 Digit NIB" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deed_number">No. Akta Pendirian/Perubahan</Label>
                      <Input id="deed_number" {...register('deed_number')} placeholder="AHU-123..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="notary_name">Nama Notaris</Label>
                      <Input id="notary_name" {...register('notary_name')} placeholder="Nama Notaris" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notary_location">Lokasi Notaris</Label>
                      <Input id="notary_location" {...register('notary_location')} placeholder="Kota Notaris" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="establishment_date">Tanggal Berdiri</Label>
                      <Controller
                        control={control}
                        name="establishment_date"
                        render={({ field }) => (
                          <DatePicker
                            value={parseDateString(field.value)}
                            onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                            placeholder="Pilih tanggal"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee_count">Jumlah Karyawan</Label>
                      <Controller
                        control={control}
                        name="employee_count"
                        render={({ field }) => (
                          <Input
                            id="employee_count"
                            inputMode="numeric"
                            value={
                              field.value === undefined || field.value === null
                                ? ''
                                : formatThousandsId(Number(field.value))
                            }
                            onChange={(e) => {
                              const raw = stripNonDigits(e.target.value);
                              field.onChange(raw ? parseInt(raw, 10) : 0);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            placeholder="XX.XXX"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="basic_capital">Modal Dasar (Rp)</Label>
                      <Controller
                        control={control}
                        name="basic_capital"
                        render={({ field }) => (
                          <Input
                            id="basic_capital"
                            inputMode="numeric"
                            value={field.value ? formatThousandsId(Number(field.value)) : ''}
                            onChange={(e) => {
                              const raw = stripNonDigits(e.target.value);
                              field.onChange(raw ? parseInt(raw, 10) : 0);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            placeholder="0"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paid_capital">Modal Disetor (Rp)</Label>
                      <Controller
                        control={control}
                        name="paid_capital"
                        render={({ field }) => (
                          <Input
                            id="paid_capital"
                            inputMode="numeric"
                            value={field.value ? formatThousandsId(Number(field.value)) : ''}
                            onChange={(e) => {
                              const raw = stripNonDigits(e.target.value);
                              field.onChange(raw ? parseInt(raw, 10) : 0);
                            }}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            placeholder="0"
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classification" className="space-y-6" forceMount style={{ display: activeTab === 'classification' ? 'block' : 'none' }}>
            {/* Informasi Bisnis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Informasi Bisnis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Jenis Usaha *</Label>
                    <Controller
                      control={control}
                      name="business_type"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis usaha" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypeOptions.length > 0 ? (
                              businessTypeOptions.map((opt) => (
                                <SelectItem key={opt.id} value={opt.name}>
                                  {opt.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="__empty" disabled>
                                Tidak ada data referensi
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_scale">Skala Bisnis *</Label>
                    <Select onValueChange={(val) => setValue('business_scale', val)} defaultValue={client?.business_scale || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih skala" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mikro">Mikro</SelectItem>
                        <SelectItem value="kecil">Kecil</SelectItem>
                        <SelectItem value="menengah">Menengah</SelectItem>
                        <SelectItem value="besar">Besar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry_sector_detail">Sektor Industri *</Label>
                    <Select onValueChange={(val) => setValue('industry_sector', val)} defaultValue={client?.industry_sector || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih sektor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sipil">Sipil, Warehouse, dll</SelectItem>
                        <SelectItem value="trading">Trading & Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufaktur</SelectItem>
                        <SelectItem value="services">Jasa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annual_revenue">Revenue Tahunan (Rp)</Label>
                    <Controller
                      control={control}
                      name="annual_revenue"
                      render={({ field }) => (
                        <Input
                          id="annual_revenue"
                          inputMode="numeric"
                          value={field.value ? formatThousandsId(Number(field.value)) : ''}
                          onChange={(e) => {
                            const raw = stripNonDigits(e.target.value);
                            field.onChange(raw ? parseInt(raw, 10) : 0);
                          }}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="0"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_package">Paket Layanan</Label>
                  <Select onValueChange={(val) => setValue('service_package', val)} defaultValue={client?.service_package || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih paket" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standar</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Identitas Perpajakan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">Identitas Perpajakan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status PKP</Label>
                    <Select
                      onValueChange={(val) => setValue('pkp_status', val === 'true')}
                      defaultValue={client?.pkp_status ? 'true' : 'false'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">PKP</SelectItem>
                        <SelectItem value="false">Non PKP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishment_date_tax">Tanggal Berdiri</Label>
                    <Input type="date" id="establishment_date_tax" {...register('establishment_date')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxpayer_type">Tipe Wajib Pajak</Label>
                    <Select onValueChange={(val) => setValue('taxpayer_type', val)} defaultValue={client?.taxpayer_type || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe WP" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="badan">Badan Usaha</SelectItem>
                        <SelectItem value="orang_pribadi">Orang Pribadi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpp_office">Kantor Pelayanan Pajak (KPP)</Label>
                    <Input id="kpp_office" {...register('kpp_office')} placeholder="KPP Pratama Jakarta" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Jenis Pajak yang Berlaku</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {['PPh 21', 'PPh 22', 'PPh 23', 'PPh 4 ayat 2', 'PPh 15', 'PPN', 'PBB', 'Lainnya'].map((tax) => (
                      <div
                        key={tax}
                        className="flex items-center space-x-2"
                        onClick={() => console.log('Div clicked for tax:', tax)} // DEBUG LOG
                      >
                        <Controller
                          name="applicable_taxes"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={`tax-${tax}`}
                              checked={field.value?.includes(tax) || false}
                              onCheckedChange={(checked) => {
                                console.log('Controller checkbox change:', { tax, checked, currentValue: field.value }); // DEBUG LOG
                                const current = field.value || [];
                                if (checked) {
                                  const newTaxes = [...current, tax];
                                  console.log('Adding tax, new array:', newTaxes); // DEBUG LOG
                                  field.onChange(newTaxes);
                                } else {
                                  const newTaxes = current.filter((t: string) => t !== tax);
                                  console.log('Removing tax, new array:', newTaxes); // DEBUG LOG
                                  field.onChange(newTaxes);
                                }
                              }}
                            />
                          )}
                        />
                        <label
                          htmlFor={`tax-${tax}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {tax}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 p-3 rounded mt-2">
                    Jenis Pajak yang dipilih akan mempengaruhi template COA dan requirement dokumen yang akan dibuat secara otomatis
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Surat Perpajakan (Mock UI) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surat Keterangan Terdaftar</CardTitle>
                  <Checkbox />
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Input placeholder="Deskripsi" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nomor</Label>
                      <Input placeholder="Deskripsi" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal *</Label>
                      <DatePicker
                        value={undefined}
                        onChange={() => {}}
                        placeholder="Pilih tanggal"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surat Pengukuhan Pengusaha Kena Pajak</CardTitle>
                  <Checkbox />
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Input placeholder="Deskripsi" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nomor</Label>
                      <Input placeholder="Deskripsi" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal *</Label>
                      <DatePicker
                        value={undefined}
                        onChange={() => {}}
                        placeholder="Pilih tanggal"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6" forceMount style={{ display: activeTab === 'contacts' ? 'block' : 'none' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Person in Charge (PIC)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama PIC *</Label>
                      <Input
                        placeholder="Nama lengkap PIC"
                        value={picContact.name}
                        onChange={(e) =>
                          setPicContact((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jabatan</Label>
                      <Input
                        placeholder="Manager, Owner, dll"
                        value={picContact.position}
                        onChange={(e) =>
                          setPicContact((prev) => ({ ...prev, position: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={picContact.email}
                        onChange={(e) =>
                          setPicContact((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telepon *</Label>
                      <Input
                        placeholder="08123456789"
                        value={picContact.phone}
                        onChange={(e) =>
                          setPicContact((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Kontak Billing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Kontak Billing *</Label>
                      <Input
                        placeholder="Nama lengkap kontak billing"
                        value={billingContact.name}
                        onChange={(e) =>
                          setBillingContact((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jabatan</Label>
                      <Input
                        placeholder="Account Manager, Owner, dll"
                        value={billingContact.position}
                        onChange={(e) =>
                          setBillingContact((prev) => ({ ...prev, position: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={billingContact.email}
                        onChange={(e) =>
                          setBillingContact((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telepon *</Label>
                      <Input
                        placeholder="08123456789"
                        value={billingContact.phone}
                        onChange={(e) =>
                          setBillingContact((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Kantor Cabang
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBranch}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Cabang
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {branchesState.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed">
                    Belum ada kantor cabang yang terdaftar. Tambahkan cabang baru dengan tombol "Tambah Cabang".
                  </div>
                ) : (
                  <div className="space-y-4">
                    {branchesState.map((branch, index) => (
                      <div
                        key={branch.id || index}
                        className="border rounded-lg p-4 space-y-4 bg-slate-50 dark:bg-slate-900/40"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">Cabang {index + 1}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`branch-${index}-is_hq`}
                                checked={branch.is_hq}
                                onCheckedChange={(checked) =>
                                  handleBranchChange(index, 'is_hq', !!checked)
                                }
                              />
                              <Label
                                htmlFor={`branch-${index}-is_hq`}
                                className="text-xs"
                              >
                                Kantor Pusat
                              </Label>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => handleRemoveBranch(index)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Pemegang Saham</Label>
                            <Input
                              placeholder="PT Investindo Jaya"
                              value={branch.shareholder}
                              onChange={(e) =>
                                handleBranchChange(index, 'shareholder', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Jabatan/Struktur</Label>
                            <Input
                              placeholder="Branch Manager"
                              value={branch.position}
                              onChange={(e) =>
                                handleBranchChange(index, 'position', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Negara</Label>
                            <Input
                              placeholder="Indonesia"
                              value={branch.country}
                              onChange={(e) =>
                                handleBranchChange(index, 'country', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Provinsi</Label>
                            <Input
                              placeholder="Jawa Barat"
                              value={branch.province}
                              onChange={(e) =>
                                handleBranchChange(index, 'province', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Kota</Label>
                            <Input
                              placeholder="Bandung"
                              value={branch.city}
                              onChange={(e) =>
                                handleBranchChange(index, 'city', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Telepon</Label>
                            <Input
                              placeholder="022-1234567"
                              value={branch.phone}
                              onChange={(e) =>
                                handleBranchChange(index, 'phone', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Alamat</Label>
                            <Textarea
                              placeholder="Jl. Sudirman No. 123"
                              value={branch.address}
                              onChange={(e) =>
                                handleBranchChange(index, 'address', e.target.value)
                              }
                              className="h-20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t mt-2">
                          <div className="space-y-2">
                            <Label>Nama PIC</Label>
                            <Input
                              placeholder="Dedi Kurniawan"
                              value={branch.pic_name}
                              onChange={(e) =>
                                handleBranchChange(index, 'pic_name', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Jabatan PIC</Label>
                            <Input
                              placeholder="Supervisor"
                              value={branch.pic_position}
                              onChange={(e) =>
                                handleBranchChange(index, 'pic_position', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email PIC</Label>
                            <Input
                              type="email"
                              placeholder="dedi@branch.com"
                              value={branch.pic_email}
                              onChange={(e) =>
                                handleBranchChange(index, 'pic_email', e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Telepon PIC</Label>
                            <Input
                              placeholder="08123456789"
                              value={branch.pic_phone}
                              onChange={(e) =>
                                handleBranchChange(index, 'pic_phone', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6" forceMount style={{ display: activeTab === 'preferences' ? 'block' : 'none' }}>
            {/* Template COA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Template COA (Chart of Account)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gunakan Template Default */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <p className="font-medium">Gunakan Template Default</p>
                    <p className="text-sm text-muted-foreground">
                      Otomatis menggunakan template berdasarkan jenis usaha: {watch('business_type') || '-'}
                    </p>
                    {watch('use_default_coa') && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 border rounded-md text-sm">
                          Trading COA Template
                        </span>
                        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={watch('use_default_coa') ?? true}
                    onCheckedChange={(checked) => setValue('use_default_coa', checked)}
                  />
                </div>

                {/* Pilih Template COA */}
                {!watch('use_default_coa') && (
                  <div className="space-y-2">
                    <Label>Pilih Template COA *</Label>
                    <Select 
                      value={watch('coa_template') || ''} 
                      onValueChange={(val) => setValue('coa_template', val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih template COA..." />
                      </SelectTrigger>
                      <SelectContent>
                        {coaTemplateOptions.map((opt) => (
                          <SelectItem key={opt.key} value={opt.key}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Kebijakan Penomoran Voucher */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Kebijakan Penomoran Voucher
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gunakan kebijakan dari tenant */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <p className="font-medium">Gunakan kebijakan penomoran dari tenant</p>
                    <p className="text-sm text-muted-foreground">
                      Mengikuti format penomoran yang ditetapkan
                    </p>
                  </div>
                  <Switch
                    checked={watch('use_tenant_voucher_numbering') ?? true}
                    onCheckedChange={(checked) => setValue('use_tenant_voucher_numbering', checked)}
                  />
                </div>

                {/* Custom Voucher Settings */}
                {!watch('use_tenant_voucher_numbering') && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Format Voucher *</Label>
                        <Input
                          {...register('voucher_format')}
                          placeholder="JB YYY-MM-###"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Frekuensi Reset</Label>
                        <Select 
                          value={watch('reset_frequency') || 'monthly'} 
                          onValueChange={(val) => setValue('reset_frequency', val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Bulanan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Harian</SelectItem>
                            <SelectItem value="weekly">Mingguan</SelectItem>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                            <SelectItem value="never">Tidak Pernah</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Padding Angka</Label>
                        <Input
                          type="number"
                          {...register('padding_number', { valueAsNumber: true })}
                          placeholder="4"
                          min={1}
                          max={10}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prefix</Label>
                        <Input
                          {...register('voucher_prefix')}
                          placeholder="JV"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Suffix</Label>
                        <Input
                          {...register('voucher_suffix')}
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    {/* Preview Nomor */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-sm text-muted-foreground">Preview Nomor:</p>
                      <p className="font-mono text-blue-600 dark:text-blue-400">
                        {watch('voucher_prefix') || 'JV'}-{new Date().getFullYear().toString().slice(-2)}{(new Date().getMonth() + 1).toString().padStart(2, '0')}-{'1'.padStart(watch('padding_number') || 4, '0')}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6" forceMount style={{ display: activeTab === 'documents' ? 'block' : 'none' }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Upload Dokumen Legal
                </CardTitle>
                <Button 
                  type="button" 
                  onClick={() => setIsDocumentModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Dokumen
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {legalDocuments.map((doc, index) => {
                  const docTypeLabels: Record<string, string> = {
                    akta_pendirian: 'Akta Pendirian',
                    nib: 'NIB',
                    npwp: 'NPWP',
                    siup: 'SIUP',
                    tdp: 'TDP',
                    pkp: 'Pernyataan PKP',
                    ktp_direktur: 'KTP Direktur',
                    sk_kemenkumham: 'SK Kemenkumham',
                  };
                  
                  return (
                    <div key={index} className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-900 dark:text-blue-100">
                            {docTypeLabels[doc.document_type] || doc.document_type}
                          </span>
                          {doc.is_required && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs">
                              Wajib
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.file_url && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                              onClick={async () => {
                                const keyOrUrl = doc.file_url;
                                if (!keyOrUrl) return;

                                setPreviewTitle(doc.file_name || doc.document_type || 'Dokumen');
                                setIsPreviewOpen(true);
                                setPreviewUrl(null);
                                setIsPreviewLoading(true);

                                try {
                                  if (/^https?:\/\//i.test(keyOrUrl)) {
                                    setPreviewUrl(keyOrUrl);
                                    return;
                                  }
                                  const resp = await api.get('/client-wp/api/uploads/legal-documents/presign', {
                                    params: { objectKey: keyOrUrl },
                                    headers: { 'X-Tenant-Id': tenant.id },
                                  });
                                  setPreviewUrl(resp.data?.presigned_url || null);
                                } catch (e) {
                                  console.error(e);
                                } finally {
                                  setIsPreviewLoading(false);
                                }
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          )}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setLegalDocuments(prev => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {doc.file_url ? (
                        <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                          <p className="font-medium text-blue-900 dark:text-blue-100">{doc.file_name || 'Dokumen'}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            {doc.expiry_date && (
                              <span>Masa berlaku sampai: {new Date(doc.expiry_date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {doc.file_size != null && <span>{formatFileSizeLabel(doc.file_size)}</span>}
                            {doc.upload_date && <span> • Diupload {new Date(doc.upload_date).toLocaleDateString('id-ID')}</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-4 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                          <Upload className="h-6 w-6 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Belum ada dokumen diupload</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {legalDocuments.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Belum ada dokumen yang ditambahkan</p>
                    <p className="text-sm mt-1">Klik "Tambah Dokumen" untuk menambahkan dokumen legal</p>
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Dokumen yang diupload akan disimpan dengan enkripsi dan hanya dapat diakses oleh tim yang berwenang. 
                    Pastikan dokumen yang diupload sudah benar dan masih berlaku.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>

      <Dialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open);
          if (!open) {
            setPreviewTitle('');
            setPreviewUrl(null);
            setIsPreviewLoading(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewTitle || 'Preview Dokumen'}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              {isPreviewLoading ? 'Memuat dokumen...' : previewUrl ? ' ' : 'Dokumen tidak tersedia'}
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

          <div className="w-full h-[70vh] rounded-md border overflow-hidden bg-white">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title={previewTitle || 'Preview Dokumen'}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                {isPreviewLoading ? 'Memuat...' : 'Tidak ada preview'}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Upload Dokumen */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900 dark:text-blue-100">Upload Dokumen Legal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jenis Dokumen</Label>
              <Select 
                value={newDocument.document_type} 
                onValueChange={(val) => setNewDocument(prev => ({ ...prev, document_type: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis dokumen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="akta_pendirian">Akta Pendirian</SelectItem>
                  <SelectItem value="akta_perubahan">Akta Perubahan</SelectItem>
                  <SelectItem value="nib">NIB (Nomor Induk Berusaha)</SelectItem>
                  <SelectItem value="npwp">NPWP</SelectItem>
                  <SelectItem value="siup">SIUP</SelectItem>
                  <SelectItem value="tdp">TDP</SelectItem>
                  <SelectItem value="pkp">Pernyataan PKP</SelectItem>
                  <SelectItem value="ktp_direktur">KTP Direktur</SelectItem>
                  <SelectItem value="sk_kemenkumham">SK Kemenkumham</SelectItem>
                  <SelectItem value="surat_domisili">Surat Domisili</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Masa Berlaku Hingga (opsional)</Label>
              <DatePicker
                value={parseDateString(newDocument.expiry_date)}
                onChange={(date) => setNewDocument(prev => ({ ...prev, expiry_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                placeholder="Pilih tanggal"
              />
            </div>

            <div className="space-y-2">
              <Label>File Dokumen</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewDocument(prev => ({ ...prev, file }));
                  }}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Format yang didukung: JPG, PNG, PDF</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsDocumentModalOpen(false);
                setNewDocument({ document_type: '', expiry_date: '', file: null });
              }}
            >
              Batal
            </Button>
            <Button 
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!newDocument.document_type || !newDocument.file}
              onClick={async () => {
                if (!newDocument.document_type || !newDocument.file) return;
                try {
                  const formData = new FormData();
                  formData.append('file', newDocument.file);
                  formData.append('document_type', newDocument.document_type);
                  const { data } = await api.post('/client-wp/api/uploads/legal-documents', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      'X-Tenant-Id': tenant.id,
                    },
                  });

                  const nextDoc = {
                    document_type: newDocument.document_type,
                    expiry_date: newDocument.expiry_date || undefined,
                    file_url: data.objectKey || data.file_url,
                    file_name: data.file_name || newDocument.file.name,
                    file_size: data.file_size || newDocument.file.size,
                    mime_type: data.mime_type || newDocument.file.type,
                    status: 'uploaded',
                    upload_date: new Date().toISOString(),
                    is_required: ['akta_pendirian', 'nib', 'npwp'].includes(newDocument.document_type),
                  };

                  setLegalDocuments((prev) => {
                    const idx = prev.findIndex((d) => d.document_type === nextDoc.document_type);
                    if (idx >= 0) {
                      const copy = [...prev];
                      copy[idx] = { ...copy[idx], ...nextDoc };
                      return copy;
                    }
                    return [...prev, nextDoc];
                  });

                  setIsDocumentModalOpen(false);
                  setNewDocument({ document_type: '', expiry_date: '', file: null });

                  toast({
                    title: 'Upload berhasil',
                    description: 'Dokumen berhasil diupload',
                  });
                } catch (e: any) {
                  const msg = e?.response?.data?.message || e?.message || 'Upload dokumen gagal';
                  toast({
                    title: 'Upload gagal',
                    description: msg,
                    variant: 'destructive',
                  });
                }
              }}
            >
              Upload Dokumen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
