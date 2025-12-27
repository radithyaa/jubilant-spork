'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  FileText,
  MapPin,
  User,
  Calculator,
  Phone,
  Mail,
  Trash2,
  Plus,
  Settings,
  Eye,
  Hash,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCoaTemplates } from '@/hooks/useCoaTemplates';

// Form validation schemas
const basicInfoSchema = z.object({
  name: z.string().min(1, 'Nama klien wajib diisi'),
  brand_name: z.string().optional(),
  type: z.enum(['corporate', 'individual']).refine((val) => val !== undefined, {
    message: 'Tipe klien wajib dipilih',
  }),
  phone: z.string().optional(),
  website: z.string().url('Format website tidak valid').optional().or(z.literal('')),
});

const addressSchema = z.object({
  address: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
});

const corporateSchema = z.object({
  nik: z.string().optional(),
  npwp: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\.\d-\d{3}\.\d{3}$/, 'Format NPWP tidak valid')
    .optional()
    .or(z.literal('')),
  nib: z.string().optional(),
  deed_number: z.string().optional(),
  notary_name: z.string().optional(),
  notary_location: z.string().optional(),
  notary_contact: z.string().optional(),
  establishment_date: z.string().optional(),
  employee_count: z.string().optional(),
  basic_capital: z.string().optional(),
  paid_capital: z.string().optional(),
});

const businessInfoSchema = z.object({
  business_type: z.string().min(1, 'Jenis usaha wajib diisi'),
  industry_sector: z.string().min(1, 'Sektor industri wajib diisi'),
  service_package: z.string().optional(),
  business_scale: z.string().min(1, 'Skala bisnis wajib diisi'),
  annual_revenue: z.string().optional(),
});

const taxIdentitySchema = z.object({
  pkp_status: z.enum(['pkp', 'non_pkp']).refine((val) => val !== undefined, {
    message: 'Status PKP wajib dipilih',
  }),
  establishment_date: z.string().optional(),
  taxpayer_type: z.string().min(1, 'Tipe wajib pajak wajib diisi'),
  kpp_office: z.string().optional(),
  applicable_taxes: z.array(z.string()).optional(),
});

const taxDocumentSchema = z.object({
  has_registered_letter: z.boolean().optional(),
  registered_letter_description: z.string().optional(),
  registered_letter_number: z.string().optional(),
  registered_letter_date: z.string().optional(),
  has_pkp_confirmation: z.boolean().optional(),
  pkp_confirmation_description: z.string().optional(),
  pkp_confirmation_number: z.string().optional(),
  pkp_confirmation_date: z.string().optional(),
});

const picPkpSchema = z.object({
  pic_name: z.string().optional(),
  pic_contact: z.string().optional(),
  pic_email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
});

const picSchema = z.object({
  name: z.string().min(1, 'Nama PIC wajib diisi'),
  position: z.string().min(1, 'Jabatan wajib dipilih'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
});

const billingContactSchema = z.object({
  name: z.string().min(1, 'Nama kontak billing wajib diisi'),
  position: z.string().min(1, 'Jabatan wajib dipilih'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional(),
});

const branchSchema = z.object({
  shareholder: z.string().optional(),
  position: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  pic_name: z.string().optional(),
  pic_position: z.string().optional(),
  pic_email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  pic_phone: z.string().optional(),
  address: z.string().optional(),
});

const accountingPreferenceSchema = z.object({
  useDefaultCoa: z.boolean(),
  useTenantVoucherNumbering: z.boolean(),
  coaTemplate: z.string().optional(),
  voucherFormat: z.string().optional(),
  resetFrequency: z.enum(['monthly', 'annually', 'daily']).optional(),
  paddingNumber: z.number().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  manualCoa: z.array(
    z.object({
      id: z.string(),
      accountNumber: z.string().min(1, 'Nomor Akun wajib diisi'),
      accountName: z.string().min(1, 'Nama Akun wajib diisi'),
      description: z.string().optional(),
    }),
  ),
});

const legalDocumentSchema = z.object({
  aktaPendirian: z.object({
    file: z.string().optional(),
    fileName: z.string().optional(),
    uploadDate: z.string().optional(),
    status: z.enum(['uploaded', 'pending', 'missing']).default('missing'),
  }),
  aktaPerubahan: z.object({
    file: z.string().optional(),
    fileName: z.string().optional(),
    uploadDate: z.string().optional(),
    status: z.enum(['uploaded', 'pending', 'missing']).default('missing'),
  }),
  siup: z.object({
    file: z.string().optional(),
    fileName: z.string().optional(),
    uploadDate: z.string().optional(),
    status: z.enum(['uploaded', 'pending', 'missing']).default('missing'),
  }),
  tdp: z.object({
    file: z.string().optional(),
    fileName: z.string().optional(),
    uploadDate: z.string().optional(),
    status: z.enum(['uploaded', 'pending', 'missing']).default('missing'),
  }),
  npwp: z.object({
    file: z.string().optional(),
    fileName: z.string().optional(),
    uploadDate: z.string().optional(),
    status: z.enum(['uploaded', 'pending', 'missing']).default('missing'),
  }),
  ktpDirektur: z.object({
    file: z.string().optional(),
    fileName: z.string().optional(),
    uploadDate: z.string().optional(),
    status: z.enum(['uploaded', 'pending', 'missing']).default('missing'),
  }),
});

type FormData = {
  basicInfo: z.infer<typeof basicInfoSchema>;
  address: z.infer<typeof addressSchema>;
  corporate: z.infer<typeof corporateSchema>;
  businessInfo: z.infer<typeof businessInfoSchema>;
  taxIdentity: z.infer<typeof taxIdentitySchema>;
  taxDocument: z.infer<typeof taxDocumentSchema>;
  picPkp: z.infer<typeof picPkpSchema>;
  pic: z.infer<typeof picSchema>;
  billingContact: z.infer<typeof billingContactSchema>;
  branches: z.infer<typeof branchSchema>[];
  accountingPreferences: z.infer<typeof accountingPreferenceSchema>;
  legalDocuments: z.infer<typeof legalDocumentSchema>;
};

interface Branch {
  id: string;
  shareholder?: string;
  position?: string;
  country?: string;
  province?: string;
  city?: string;
  phone?: string;
  pic_name?: string;
  pic_position?: string;
  pic_email?: string;
  pic_phone?: string;
  address?: string;
}

interface ManualCoaItem {
  id: string;
  accountNumber: string;
  accountName: string;
  description?: string;
}

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const steps = [
  { id: 1, title: 'Identitas', icon: User },
  { id: 2, title: 'Klasifikasi Usaha & Pajak', icon: Calculator },
  { id: 3, title: 'Kontak & Cabang', icon: Phone },
  { id: 4, title: 'Preferensi Akuntansi', icon: Settings },
  { id: 5, title: 'Dokumen Legal', icon: FileText },
  { id: 6, title: 'Review', icon: Eye },
];

export function CreateClientModal({ open, onClose, onSuccess }: CreateClientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [manualCoa, setManualCoa] = useState<ManualCoaItem[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basicInfo', 'contacts']);

  // Fetch CoA Templates
  const { data: coaTemplates, isLoading: isLoadingCoaTemplates } = useCoaTemplates();

  // Form instances for each step
  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      brand_name: '',
      type: 'corporate',
      phone: '',
      website: '',
    },
  });

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      country: '',
      province: '',
      city: '',
      phone: '',
    },
  });

  const corporateForm = useForm<z.infer<typeof corporateSchema>>({
    resolver: zodResolver(corporateSchema),
    defaultValues: {
      nik: '',
      npwp: '',
      nib: '',
      deed_number: '',
      notary_name: '',
      notary_location: '',
      notary_contact: '',
      establishment_date: '',
      employee_count: '',
      basic_capital: '',
      paid_capital: '',
    },
  });

  const businessInfoForm = useForm<z.infer<typeof businessInfoSchema>>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      business_type: '',
      industry_sector: '',
      service_package: '',
      business_scale: '',
      annual_revenue: '',
    },
  });

  const taxIdentityForm = useForm<z.infer<typeof taxIdentitySchema>>({
    resolver: zodResolver(taxIdentitySchema),
    defaultValues: {
      pkp_status: 'non_pkp',
      establishment_date: '',
      taxpayer_type: '',
      kpp_office: '',
      applicable_taxes: [],
    },
  });

  const taxDocumentForm = useForm<z.infer<typeof taxDocumentSchema>>({
    resolver: zodResolver(taxDocumentSchema),
    defaultValues: {
      has_registered_letter: false,
      registered_letter_description: '',
      registered_letter_number: '',
      registered_letter_date: '',
      has_pkp_confirmation: false,
      pkp_confirmation_description: '',
      pkp_confirmation_number: '',
      pkp_confirmation_date: '',
    },
  });

  const picPkpForm = useForm<z.infer<typeof picPkpSchema>>({
    resolver: zodResolver(picPkpSchema),
    defaultValues: {
      pic_name: '',
      pic_contact: '',
      pic_email: '',
    },
  });

  const picForm = useForm<z.infer<typeof picSchema>>({
    resolver: zodResolver(picSchema),
    defaultValues: {
      name: '',
      position: '',
      email: '',
      phone: '',
    },
  });

  const billingContactForm = useForm<z.infer<typeof billingContactSchema>>({
    resolver: zodResolver(billingContactSchema),
    defaultValues: {
      name: '',
      position: '',
      email: '',
      phone: '',
    },
  });

  const branchForm = useForm<z.infer<typeof branchSchema>>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      shareholder: '',
      position: '',
      country: 'Indonesia',
      province: 'DKI Jakarta',
      city: 'Jakarta',
      phone: '',
      pic_name: '',
      pic_position: '',
      pic_email: '',
      pic_phone: '',
      address: '',
    },
  });

  const accountingForm = useForm<z.infer<typeof accountingPreferenceSchema>>({
    resolver: zodResolver(accountingPreferenceSchema) as any,
    defaultValues: {
      useDefaultCoa: true,
      useTenantVoucherNumbering: true,
      coaTemplate: '',
      voucherFormat: '',
      resetFrequency: 'monthly' as const,
      paddingNumber: 3,
      prefix: '',
      suffix: '',
      manualCoa: [],
    },
  });

  const legalDocumentForm = useForm<z.infer<typeof legalDocumentSchema>>({
    resolver: zodResolver(legalDocumentSchema) as any,
    defaultValues: {
      aktaPendirian: {
        file: '',
        fileName: '',
        uploadDate: '',
        status: 'missing',
      },
      aktaPerubahan: {
        file: '',
        fileName: '',
        uploadDate: '',
        status: 'missing',
      },
      siup: {
        file: '',
        fileName: '',
        uploadDate: '',
        status: 'missing',
      },
      tdp: {
        file: '',
        fileName: '',
        uploadDate: '',
        status: 'missing',
      },
      npwp: {
        file: '',
        fileName: '',
        uploadDate: '',
        status: 'missing',
      },
      ktpDirektur: {
        file: '',
        fileName: '',
        uploadDate: '',
        status: 'missing',
      },
    },
  });

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await basicInfoForm.trigger();
      if (isValid) isValid = await addressForm.trigger();
      if (isValid) isValid = await corporateForm.trigger();
    } else if (currentStep === 2) {
      isValid = await businessInfoForm.trigger();
      if (isValid) isValid = await taxIdentityForm.trigger();
      if (isValid) isValid = await taxDocumentForm.trigger();
      if (isValid) isValid = await picPkpForm.trigger();
    } else if (currentStep === 3) {
      isValid = await picForm.trigger();
      if (isValid) isValid = await billingContactForm.trigger();
      // Branch form is optional, so we don't validate it here
    } else if (currentStep === 4) {
      isValid = await accountingForm.trigger();
      // Manual COA validation is optional
    } else if (currentStep === 5) {
      isValid = await legalDocumentForm.trigger();
      // Legal documents validation is optional
    } else if (currentStep === 6) {
      // Review step - no validation needed, just proceed to submit
      isValid = true;
    }

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      ...branchForm.getValues(),
    };
    setBranches([...branches, newBranch]);
    branchForm.reset();
  };

  const handleRemoveBranch = (id: string) => {
    setBranches(branches.filter((branch) => branch.id !== id));
  };

  const handleAddCoaItem = () => {
    const newItem: ManualCoaItem = {
      id: Date.now().toString(),
      accountNumber: '',
      accountName: '',
      description: '',
    };
    setManualCoa([...manualCoa, newItem]);
  };

  const handleRemoveCoaItem = (id: string) => {
    setManualCoa(manualCoa.filter((item) => item.id !== id));
  };

  const handleUpdateCoaItem = (id: string, field: keyof ManualCoaItem, value: string) => {
    setManualCoa(manualCoa.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const generateVoucherPreview = () => {
    const { prefix, voucherFormat, paddingNumber, suffix } = accountingForm.getValues();
    const sampleNumber = '001'.padStart(paddingNumber || 3, '0');
    return `${prefix || ''}${voucherFormat || 'VOU'}${sampleNumber}${suffix || ''}`;
  };

  const handleFileUpload = (docType: keyof z.infer<typeof legalDocumentSchema>, file: File) => {
    const uploadDate = new Date().toISOString();
    const fileUrl = URL.createObjectURL(file); // Simulated file URL

    legalDocumentForm.setValue(`${docType}.file`, fileUrl);
    legalDocumentForm.setValue(`${docType}.fileName`, file.name);
    legalDocumentForm.setValue(`${docType}.uploadDate`, uploadDate);
    legalDocumentForm.setValue(`${docType}.status`, 'uploaded');
  };

  const handleRemoveFile = (docType: keyof z.infer<typeof legalDocumentSchema>) => {
    legalDocumentForm.setValue(`${docType}.file`, '');
    legalDocumentForm.setValue(`${docType}.fileName`, '');
    legalDocumentForm.setValue(`${docType}.uploadDate`, '');
    legalDocumentForm.setValue(`${docType}.status`, 'missing');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'missing':
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'Terkirim';
      case 'pending':
        return 'Menunggu';
      case 'missing':
      default:
        return 'Belum Upload';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section],
    );
  };

  const handleSubmit = async () => {
    const legalValid = await legalDocumentForm.trigger();
    if (!legalValid) return;

    setIsSubmitting(true);
    try {
      // API integration will be added here
      console.log('Form data:', {
        basicInfo: basicInfoForm.getValues(),
        address: addressForm.getValues(),
        corporate: corporateForm.getValues(),
        businessInfo: businessInfoForm.getValues(),
        taxIdentity: taxIdentityForm.getValues(),
        taxDocument: taxDocumentForm.getValues(),
        picPkp: picPkpForm.getValues(),
        pic: picForm.getValues(),
        billingContact: billingContactForm.getValues(),
        branches: branches,
        accountingPreferences: {
          ...accountingForm.getValues(),
          manualCoa: manualCoa,
        },
        legalDocuments: legalDocumentForm.getValues(),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      onClose();
      // Reset all forms
      basicInfoForm.reset();
      addressForm.reset();
      corporateForm.reset();
      businessInfoForm.reset();
      taxIdentityForm.reset();
      taxDocumentForm.reset();
      picPkpForm.reset();
      picForm.reset();
      billingContactForm.reset();
      branchForm.reset();
      accountingForm.reset();
      legalDocumentForm.reset();
      setBranches([]);
      setManualCoa([]);
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Informasi Dasar</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama *</Label>
                  <Input
                    id="name"
                    {...basicInfoForm.register('name')}
                    placeholder="Masukkan nama klien"
                    className={basicInfoForm.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {basicInfoForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {basicInfoForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_name">Nama Merek</Label>
                  <Input
                    id="brand_name"
                    {...basicInfoForm.register('brand_name')}
                    placeholder="Masukkan nama merek"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Klien *</Label>
                  <Select
                    value={basicInfoForm.watch('type')}
                    onValueChange={(value) =>
                      basicInfoForm.setValue('type', value as 'corporate' | 'individual')
                    }
                  >
                    <SelectTrigger
                      className={basicInfoForm.formState.errors.type ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Pilih tipe klien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporate">Badan</SelectItem>
                      <SelectItem value="individual">Orang Pribadi</SelectItem>
                    </SelectContent>
                  </Select>
                  {basicInfoForm.formState.errors.type && (
                    <p className="text-sm text-red-500">
                      {basicInfoForm.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    {...basicInfoForm.register('phone')}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...basicInfoForm.register('website')}
                    placeholder="https://example.com"
                  />
                  {basicInfoForm.formState.errors.website && (
                    <p className="text-sm text-red-500">
                      {basicInfoForm.formState.errors.website.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Alamat */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Alamat</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea
                    id="address"
                    {...addressForm.register('address')}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Negara</Label>
                  <Input
                    id="country"
                    {...addressForm.register('country')}
                    placeholder="Indonesia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input
                    id="province"
                    {...addressForm.register('province')}
                    placeholder="DKI Jakarta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    {...addressForm.register('city')}
                    placeholder="Jakarta Selatan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_phone">Telepon</Label>
                  <Input
                    id="address_phone"
                    {...addressForm.register('phone')}
                    placeholder="Nomor telepon alamat"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Informasi Korporasi */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Informasi Korporasi</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK</Label>
                  <Input id="nik" {...corporateForm.register('nik')} placeholder="Masukkan NIK" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="npwp">NPWP</Label>
                  <Input
                    id="npwp"
                    {...corporateForm.register('npwp')}
                    placeholder="01.234.567.8-901.000"
                    className={corporateForm.formState.errors.npwp ? 'border-red-500' : ''}
                  />
                  {corporateForm.formState.errors.npwp && (
                    <p className="text-sm text-red-500">
                      {corporateForm.formState.errors.npwp.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nib">NIB</Label>
                  <Input id="nib" {...corporateForm.register('nib')} placeholder="Masukkan NIB" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deed_number">No. Akta Pendirian/Perubahan</Label>
                  <Input
                    id="deed_number"
                    {...corporateForm.register('deed_number')}
                    placeholder="Masukkan nomor akta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notary_name">Nama Notaris</Label>
                  <Input
                    id="notary_name"
                    {...corporateForm.register('notary_name')}
                    placeholder="Masukkan nama notaris"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notary_location">Lokasi Notaris</Label>
                  <Input
                    id="notary_location"
                    {...corporateForm.register('notary_location')}
                    placeholder="Jakarta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notary_contact">Kontak Notaris</Label>
                  <Input
                    id="notary_contact"
                    {...corporateForm.register('notary_contact')}
                    placeholder="Email atau telepon notaris"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishment_date">Tanggal Berdiri</Label>
                  <Input
                    id="establishment_date"
                    {...corporateForm.register('establishment_date')}
                    type="date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee_count">Jumlah Karyawan</Label>
                  <Input
                    id="employee_count"
                    {...corporateForm.register('employee_count')}
                    placeholder="XX.XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic_capital">Modal Dasar (Rp)</Label>
                  <Input
                    id="basic_capital"
                    {...corporateForm.register('basic_capital')}
                    placeholder="1000000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paid_capital">Modal Disetor (Rp)</Label>
                  <Input
                    id="paid_capital"
                    {...corporateForm.register('paid_capital')}
                    placeholder="500000000"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Informasi Bisnis */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Informasi Bisnis</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business_type">Jenis Usaha *</Label>
                  <Select
                    value={businessInfoForm.watch('business_type')}
                    onValueChange={(value) => businessInfoForm.setValue('business_type', value)}
                  >
                    <SelectTrigger
                      className={
                        businessInfoForm.formState.errors.business_type ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Pilih jenis usaha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="konstruksi">Konstruksi</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="manufaktur">Manufaktur</SelectItem>
                      <SelectItem value="jasa">Jasa</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  {businessInfoForm.formState.errors.business_type && (
                    <p className="text-sm text-red-500">
                      {businessInfoForm.formState.errors.business_type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry_sector">Sektor Industri *</Label>
                  <Select
                    value={businessInfoForm.watch('industry_sector')}
                    onValueChange={(value) => businessInfoForm.setValue('industry_sector', value)}
                  >
                    <SelectTrigger
                      className={
                        businessInfoForm.formState.errors.industry_sector ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Pilih sektor industri" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sipil">Sipil</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                  {businessInfoForm.formState.errors.industry_sector && (
                    <p className="text-sm text-red-500">
                      {businessInfoForm.formState.errors.industry_sector.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_package">Paket Layanan</Label>
                  <Select
                    value={businessInfoForm.watch('service_package')}
                    onValueChange={(value) => businessInfoForm.setValue('service_package', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih paket layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standar">Standar</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_scale">Skala Bisnis *</Label>
                  <Select
                    value={businessInfoForm.watch('business_scale')}
                    onValueChange={(value) => businessInfoForm.setValue('business_scale', value)}
                  >
                    <SelectTrigger
                      className={
                        businessInfoForm.formState.errors.business_scale ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Pilih skala bisnis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kecil">Kecil</SelectItem>
                      <SelectItem value="menengah">Menengah</SelectItem>
                      <SelectItem value="besar">Besar</SelectItem>
                    </SelectContent>
                  </Select>
                  {businessInfoForm.formState.errors.business_scale && (
                    <p className="text-sm text-red-500">
                      {businessInfoForm.formState.errors.business_scale.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="annual_revenue">Revenue Tahunan (Rp)</Label>
                  <Input
                    id="annual_revenue"
                    {...businessInfoForm.register('annual_revenue')}
                    placeholder="365-374-4961"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Identitas Perpajakan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Identitas Perpajakan</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status PKP</Label>
                  <Select
                    value={taxIdentityForm.watch('pkp_status')}
                    onValueChange={(value) =>
                      taxIdentityForm.setValue('pkp_status', value as 'pkp' | 'non_pkp')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status PKP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pkp">PKP</SelectItem>
                      <SelectItem value="non_pkp">Non PKP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishment_date">Tanggal Berdiri</Label>
                  <Input
                    id="establishment_date"
                    {...taxIdentityForm.register('establishment_date')}
                    type="date"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxpayer_type">Tipe Wajib Pajak *</Label>
                  <Select
                    value={taxIdentityForm.watch('taxpayer_type')}
                    onValueChange={(value) => taxIdentityForm.setValue('taxpayer_type', value)}
                  >
                    <SelectTrigger
                      className={
                        taxIdentityForm.formState.errors.taxpayer_type ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Pilih tipe wajib pajak" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="badan_usaha">Badan Usaha</SelectItem>
                      <SelectItem value="orang_pribadi">Orang Pribadi</SelectItem>
                      <SelectItem value="cv">CV</SelectItem>
                      <SelectItem value="firma">Firma</SelectItem>
                    </SelectContent>
                  </Select>
                  {taxIdentityForm.formState.errors.taxpayer_type && (
                    <p className="text-sm text-red-500">
                      {taxIdentityForm.formState.errors.taxpayer_type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpp_office">Kantor Pelayanan Pajak (KPP)</Label>
                  <Input
                    id="kpp_office"
                    {...taxIdentityForm.register('kpp_office')}
                    placeholder="KPP Pratama Jakarta"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Jenis Pajak yang Berlaku</Label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Jenis Pajak yang dipilih akan mempengaruhi template COA dan requirement dokumen
                    yang akan dibuat secara otomatis
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      'PPh 29',
                      'PPh 23/26',
                      'PPN',
                      'PPh 21/26',
                      'PPh 4 ayat 2',
                      'PBB',
                      'PPh 22',
                      'PPh 15',
                      'Lainnya',
                    ].map((tax) => (
                      <div key={tax} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tax-${tax}`}
                          checked={
                            taxIdentityForm.watch('applicable_taxes')?.includes(tax) || false
                          }
                          onChange={(e) => {
                            const currentTaxes = taxIdentityForm.watch('applicable_taxes') || [];
                            if (e.target.checked) {
                              taxIdentityForm.setValue('applicable_taxes', [...currentTaxes, tax]);
                            } else {
                              taxIdentityForm.setValue(
                                'applicable_taxes',
                                currentTaxes.filter((t) => t !== tax),
                              );
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`tax-${tax}`} className="text-sm">
                          {tax}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Informasi Surat Perpajakan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Informasi Surat Perpajakan</h3>
              </div>

              {/* Surat Keterangan Terdaftar */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="has_registered_letter"
                    checked={taxDocumentForm.watch('has_registered_letter') || false}
                    onChange={(e) =>
                      taxDocumentForm.setValue('has_registered_letter', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="has_registered_letter" className="font-medium">
                    Surat Keterangan Terdaftar
                  </Label>
                </div>

                {taxDocumentForm.watch('has_registered_letter') && (
                  <div className="grid grid-cols-1 gap-3 pl-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="registered_letter_description">Deskripsi</Label>
                      <Input
                        id="registered_letter_description"
                        {...taxDocumentForm.register('registered_letter_description')}
                        placeholder="Deskripsi surat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registered_letter_number">Nomor</Label>
                      <Input
                        id="registered_letter_number"
                        {...taxDocumentForm.register('registered_letter_number')}
                        placeholder="Nomor surat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registered_letter_date">Tanggal *</Label>
                      <Input
                        id="registered_letter_date"
                        {...taxDocumentForm.register('registered_letter_date')}
                        type="date"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Surat Pengukuhan Pengusaha Kena Pajak */}
              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="has_pkp_confirmation"
                    checked={taxDocumentForm.watch('has_pkp_confirmation') || false}
                    onChange={(e) =>
                      taxDocumentForm.setValue('has_pkp_confirmation', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="has_pkp_confirmation" className="font-medium">
                    Surat Pengukuhan Pengusaha Kena Pajak
                  </Label>
                </div>

                {taxDocumentForm.watch('has_pkp_confirmation') && (
                  <div className="grid grid-cols-1 gap-3 pl-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="pkp_confirmation_description">Deskripsi</Label>
                      <Input
                        id="pkp_confirmation_description"
                        {...taxDocumentForm.register('pkp_confirmation_description')}
                        placeholder="Deskripsi surat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkp_confirmation_number">Nomor</Label>
                      <Input
                        id="pkp_confirmation_number"
                        {...taxDocumentForm.register('pkp_confirmation_number')}
                        placeholder="Nomor surat"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pkp_confirmation_date">Tanggal *</Label>
                      <Input
                        id="pkp_confirmation_date"
                        {...taxDocumentForm.register('pkp_confirmation_date')}
                        type="date"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tambah Surat Lainnya */}
              
            </div>

            <Separator />

            {/* PIC PKP */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">PIC PKP</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pic_name">PIC/AR Kantor Pajak</Label>
                  <Input
                    id="pic_name"
                    {...picPkpForm.register('pic_name')}
                    placeholder="Nama PIC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic_contact">Kontak/Whatsapp</Label>
                  <Input
                    id="pic_contact"
                    {...picPkpForm.register('pic_contact')}
                    placeholder="08123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic_email">Email</Label>
                  <Input
                    id="pic_email"
                    {...picPkpForm.register('pic_email')}
                    placeholder="email@example.com"
                    className={picPkpForm.formState.errors.pic_email ? 'border-red-500' : ''}
                  />
                  {picPkpForm.formState.errors.pic_email && (
                    <p className="text-sm text-red-500">
                      {picPkpForm.formState.errors.pic_email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Person In Charge (PIC) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Person In Charge (PIC)</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pic_name">Nama PIC *</Label>
                  <Input
                    id="pic_name"
                    {...picForm.register('name')}
                    placeholder="Masukkan nama PIC"
                    className={picForm.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {picForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{picForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic_position">Jabatan *</Label>
                  <Select
                    value={picForm.watch('position')}
                    onValueChange={(value) => picForm.setValue('position', value)}
                  >
                    <SelectTrigger
                      className={picForm.formState.errors.position ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Pilih jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  {picForm.formState.errors.position && (
                    <p className="text-sm text-red-500">
                      {picForm.formState.errors.position.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic_email">Email</Label>
                  <Input
                    id="pic_email"
                    {...picForm.register('email')}
                    placeholder="email@example.com"
                    className={picForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {picForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{picForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pic_phone">Telepon</Label>
                  <Input id="pic_phone" {...picForm.register('phone')} placeholder="08123456789" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Kontak Billing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Kontak Billing</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billing_name">Nama Kontak Billing *</Label>
                  <Input
                    id="billing_name"
                    {...billingContactForm.register('name')}
                    placeholder="Masukkan nama kontak billing"
                    className={billingContactForm.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {billingContactForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {billingContactForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_position">Jabatan *</Label>
                  <Select
                    value={billingContactForm.watch('position')}
                    onValueChange={(value) => billingContactForm.setValue('position', value)}
                  >
                    <SelectTrigger
                      className={
                        billingContactForm.formState.errors.position ? 'border-red-500' : ''
                      }
                    >
                      <SelectValue placeholder="Pilih jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account_manager">Account Manager</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  {billingContactForm.formState.errors.position && (
                    <p className="text-sm text-red-500">
                      {billingContactForm.formState.errors.position.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_email">Email</Label>
                  <Input
                    id="billing_email"
                    {...billingContactForm.register('email')}
                    placeholder="email@example.com"
                    className={billingContactForm.formState.errors.email ? 'border-red-500' : ''}
                  />
                  {billingContactForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {billingContactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_phone">Telepon</Label>
                  <Input
                    id="billing_phone"
                    {...billingContactForm.register('phone')}
                    placeholder="08123456789"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Kantor Cabang */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Kantor Cabang</h3>
              </div>

              {/* Form Tambah Cabang */}
              <div className="rounded-lg border bg-card p-4">
                <h4 className="mb-4 font-medium">Tambah Kantor Cabang Baru</h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="branch_shareholder">Pemegang Saham</Label>
                    <Input
                      id="branch_shareholder"
                      {...branchForm.register('shareholder')}
                      placeholder="Masukkan nama pemegang saham"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_position">Jabatan/Struktur</Label>
                    <Select
                      value={branchForm.watch('position')}
                      onValueChange={(value) => branchForm.setValue('position', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jabatan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_country">Negara</Label>
                    <Select
                      value={branchForm.watch('country')}
                      onValueChange={(value) => branchForm.setValue('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih negara" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                        <SelectItem value="Singapore">Singapore</SelectItem>
                        <SelectItem value="Thailand">Thailand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_province">Provinsi</Label>
                    <Select
                      value={branchForm.watch('province')}
                      onValueChange={(value) => branchForm.setValue('province', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                        <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                        <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
                        <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                        <SelectItem value="Bali">Bali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_city">Kota</Label>
                    <Select
                      value={branchForm.watch('city')}
                      onValueChange={(value) => branchForm.setValue('city', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jakarta">Jakarta</SelectItem>
                        <SelectItem value="Bandung">Bandung</SelectItem>
                        <SelectItem value="Surabaya">Surabaya</SelectItem>
                        <SelectItem value="Medan">Medan</SelectItem>
                        <SelectItem value="Denpasar">Denpasar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_phone">Telepon</Label>
                    <Input
                      id="branch_phone"
                      {...branchForm.register('phone')}
                      placeholder="08123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_pic_name">Nama PIC</Label>
                    <Input
                      id="branch_pic_name"
                      {...branchForm.register('pic_name')}
                      placeholder="Masukkan nama PIC cabang"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_pic_position">Jabatan</Label>
                    <Select
                      value={branchForm.watch('pic_position')}
                      onValueChange={(value) => branchForm.setValue('pic_position', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jabatan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_pic_email">Email</Label>
                    <Input
                      id="branch_pic_email"
                      {...branchForm.register('pic_email')}
                      placeholder="email@example.com"
                      className={branchForm.formState.errors.pic_email ? 'border-red-500' : ''}
                    />
                    {branchForm.formState.errors.pic_email && (
                      <p className="text-sm text-red-500">
                        {branchForm.formState.errors.pic_email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch_pic_phone">Telepon</Label>
                    <Input
                      id="branch_pic_phone"
                      {...branchForm.register('pic_phone')}
                      placeholder="08123456789"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="branch_address">Alamat Lengkap</Label>
                    <Textarea
                      id="branch_address"
                      {...branchForm.register('address')}
                      placeholder="Masukkan alamat lengkap cabang"
                      rows={3}
                    />
                  </div>
                </div>

                <Button type="button" onClick={handleAddBranch} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Cabang
                </Button>
              </div>

              {/* Daftar Kantor Cabang */}
              {branches.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Daftar Kantor Cabang</h4>
                  {branches.map((branch) => (
                    <div key={branch.id} className="rounded-lg border bg-card p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <p className="font-medium">{branch.address || 'Alamat tidak tersedia'}</p>
                          <p className="text-sm text-muted-foreground">
                            PIC: {branch.pic_name || '-'} ({branch.pic_position || '-'})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Telepon: {branch.pic_phone || '-'}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveBranch(branch.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Template COA */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Template COA</h3>
              </div>

              <div className="space-y-4">
                {/* Toggle Default Template */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useDefaultCoa"
                    checked={accountingForm.watch('useDefaultCoa') || false}
                    onChange={(e) => accountingForm.setValue('useDefaultCoa', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="useDefaultCoa" className="font-medium">
                    Gunakan Template Default
                  </Label>
                </div>

                {accountingForm.watch('useDefaultCoa') && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="coaTemplate">Pilihan Template COA</Label>
                      <Select
                        value={accountingForm.watch('coaTemplate')}
                        onValueChange={(value) => accountingForm.setValue('coaTemplate', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih template COA" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCoaTemplates ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                          ) : coaTemplates && coaTemplates.length > 0 ? (
                            coaTemplates.map((template) => (
                              <SelectItem key={template} value={template}>
                                {template}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center text-sm text-muted-foreground">Tidak ada template</div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button type="button" variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Tambah COA Manual */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Tambah COA Manual</h3>
              </div>

              <div className="space-y-4">
                {/* COA Table */}
                <div className="rounded-lg border">
                  <div className="grid grid-cols-12 gap-2 bg-muted p-3 text-sm font-medium">
                    <div className="col-span-2">Nomor Akun</div>
                    <div className="col-span-4">Nama Akun</div>
                    <div className="col-span-5">Deskripsi Akun</div>
                    <div className="col-span-1">Aksi</div>
                  </div>

                  {manualCoa.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 border-t p-3">
                      <div className="col-span-2">
                        <Input
                          value={item.accountNumber}
                          onChange={(e) =>
                            handleUpdateCoaItem(item.id, 'accountNumber', e.target.value)
                          }
                          placeholder="1001"
                          className="h-8"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={item.accountName}
                          onChange={(e) =>
                            handleUpdateCoaItem(item.id, 'accountName', e.target.value)
                          }
                          placeholder="Kas"
                          className="h-8"
                        />
                      </div>
                      <div className="col-span-5">
                        <Input
                          value={item.description || ''}
                          onChange={(e) =>
                            handleUpdateCoaItem(item.id, 'description', e.target.value)
                          }
                          placeholder="Akun kas kecil"
                          className="h-8"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCoaItem(item.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t p-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCoaItem}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Baris
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Kebijakan Penomoran Voucher */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Kebijakan Penomoran Voucher</h3>
              </div>

              <div className="space-y-4">
                {/* Toggle Tenant Policy */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useTenantVoucherNumbering"
                    checked={accountingForm.watch('useTenantVoucherNumbering') || false}
                    onChange={(e) =>
                      accountingForm.setValue('useTenantVoucherNumbering', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="useTenantVoucherNumbering" className="font-medium">
                    Gunakan kebijakan penomoran dari tenant
                  </Label>
                </div>

                {!accountingForm.watch('useTenantVoucherNumbering') && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="voucherFormat">Format Voucher</Label>
                      <Input
                        id="voucherFormat"
                        {...accountingForm.register('voucherFormat')}
                        placeholder="VOU"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resetFrequency">Frekuensi Reset</Label>
                      <Select
                        value={accountingForm.watch('resetFrequency')}
                        onValueChange={(value) =>
                          accountingForm.setValue(
                            'resetFrequency',
                            value as 'monthly' | 'annually' | 'daily',
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                          <SelectItem value="annually">Tahunan</SelectItem>
                          <SelectItem value="daily">Harian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paddingNumber">Padding Angka</Label>
                      <Input
                        id="paddingNumber"
                        type="number"
                        {...accountingForm.register('paddingNumber', { valueAsNumber: true })}
                        placeholder="3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prefix">Prefix</Label>
                      <Input id="prefix" {...accountingForm.register('prefix')} placeholder="CMP" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="suffix">Suffix</Label>
                      <Input
                        id="suffix"
                        {...accountingForm.register('suffix')}
                        placeholder="/2024"
                      />
                    </div>
                  </div>
                )}

                {/* Voucher Preview */}
                <div className="rounded-lg border bg-muted p-4">
                  <h4 className="mb-2 font-medium">Preview Nomor Voucher</h4>
                  <p className="font-mono text-lg">{generateVoucherPreview()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Dokumen Legal Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Dokumen Legal</h3>
              </div>

              <div className="space-y-4">
                {/* Akta Pendirian */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(
                          legalDocumentForm.watch('aktaPendirian.status') || 'missing',
                        )}
                        <h4 className="font-medium">Akta Pendirian</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(
                          legalDocumentForm.watch('aktaPendirian.status') || 'missing',
                        )}
                      </p>
                      {legalDocumentForm.watch('aktaPendirian.fileName') && (
                        <p className="text-sm text-muted-foreground">
                          File: {legalDocumentForm.watch('aktaPendirian.fileName')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="aktaPendirian"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('aktaPendirian', file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('aktaPendirian')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      {legalDocumentForm.watch('aktaPendirian.status') === 'uploaded' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile('aktaPendirian')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Akta Perubahan */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(
                          legalDocumentForm.watch('aktaPerubahan.status') || 'missing',
                        )}
                        <h4 className="font-medium">Akta Perubahan</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(
                          legalDocumentForm.watch('aktaPerubahan.status') || 'missing',
                        )}
                      </p>
                      {legalDocumentForm.watch('aktaPerubahan.fileName') && (
                        <p className="text-sm text-muted-foreground">
                          File: {legalDocumentForm.watch('aktaPerubahan.fileName')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="aktaPerubahan"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('aktaPerubahan', file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('aktaPerubahan')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      {legalDocumentForm.watch('aktaPerubahan.status') === 'uploaded' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile('aktaPerubahan')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SIUP */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(legalDocumentForm.watch('siup.status') || 'missing')}
                        <h4 className="font-medium">SIUP</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(legalDocumentForm.watch('siup.status') || 'missing')}
                      </p>
                      {legalDocumentForm.watch('siup.fileName') && (
                        <p className="text-sm text-muted-foreground">
                          File: {legalDocumentForm.watch('siup.fileName')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="siup"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('siup', file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('siup')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      {legalDocumentForm.watch('siup.status') === 'uploaded' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile('siup')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* TDP */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(legalDocumentForm.watch('tdp.status') || 'missing')}
                        <h4 className="font-medium">TDP</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(legalDocumentForm.watch('tdp.status') || 'missing')}
                      </p>
                      {legalDocumentForm.watch('tdp.fileName') && (
                        <p className="text-sm text-muted-foreground">
                          File: {legalDocumentForm.watch('tdp.fileName')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="tdp"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('tdp', file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('tdp')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      {legalDocumentForm.watch('tdp.status') === 'uploaded' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile('tdp')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* NPWP */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(legalDocumentForm.watch('npwp.status') || 'missing')}
                        <h4 className="font-medium">NPWP</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(legalDocumentForm.watch('npwp.status') || 'missing')}
                      </p>
                      {legalDocumentForm.watch('npwp.fileName') && (
                        <p className="text-sm text-muted-foreground">
                          File: {legalDocumentForm.watch('npwp.fileName')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="npwp"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('npwp', file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('npwp')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      {legalDocumentForm.watch('npwp.status') === 'uploaded' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile('npwp')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* KTP Direktur */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(legalDocumentForm.watch('ktpDirektur.status') || 'missing')}
                        <h4 className="font-medium">KTP Direktur</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getStatusText(legalDocumentForm.watch('ktpDirektur.status') || 'missing')}
                      </p>
                      {legalDocumentForm.watch('ktpDirektur.fileName') && (
                        <p className="text-sm text-muted-foreground">
                          File: {legalDocumentForm.watch('ktpDirektur.fileName')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="ktpDirektur"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('ktpDirektur', file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('ktpDirektur')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </Button>
                      {legalDocumentForm.watch('ktpDirektur.status') === 'uploaded' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile('ktpDirektur')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Review Header */}
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Review Data Klien</h3>
              </div>
              <p className="text-muted-foreground">
                Periksa kembali semua data sebelum menyimpan klien baru
              </p>
            </div>

            {/* Basic Info Section */}
            <div className="rounded-lg border bg-card">
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50"
                onClick={() => toggleSection('basicInfo')}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Informasi Dasar</h4>
                </div>
                {expandedSections.includes('basicInfo') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>

              {expandedSections.includes('basicInfo') && (
                <div className="space-y-3 px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nama Klien</p>
                      <p className="font-medium">{basicInfoForm.watch('name') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Brand Name</p>
                      <p>{basicInfoForm.watch('brand_name') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tipe Klien</p>
                      <p>
                        {basicInfoForm.watch('type') === 'corporate' ? 'Korporasi' : 'Individu'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                      <p>{basicInfoForm.watch('phone') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Website</p>
                      <p>{basicInfoForm.watch('website') || '-'}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Alamat Lengkap</p>
                    <p>
                      {addressForm.watch('address')}, {addressForm.watch('city')},{' '}
                      {addressForm.watch('province')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contacts Section */}
            <div className="rounded-lg border bg-card">
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50"
                onClick={() => toggleSection('contacts')}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Kontak & Cabang</h4>
                </div>
                {expandedSections.includes('contacts') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>

              {expandedSections.includes('contacts') && (
                <div className="space-y-4 px-4 pb-4">
                  {/* PIC */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Person In Charge (PIC)
                    </p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm">Nama: {picForm.watch('name') || '-'}</p>
                        <p className="text-sm">Jabatan: {picForm.watch('position') || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm">Email: {picForm.watch('email') || '-'}</p>
                        <p className="text-sm">Telepon: {picForm.watch('phone') || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Billing Contact */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Kontak Billing</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm">Nama: {billingContactForm.watch('name') || '-'}</p>
                        <p className="text-sm">
                          Jabatan: {billingContactForm.watch('position') || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">Email: {billingContactForm.watch('email') || '-'}</p>
                        <p className="text-sm">
                          Telepon: {billingContactForm.watch('phone') || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Branch Offices */}
                  {branches.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Kantor Cabang ({branches.length})
                      </p>
                      {branches.map((branch, index) => (
                        <div key={branch.id} className="rounded-sm border bg-muted/30 p-3">
                          <p className="text-sm font-medium">Cabang {index + 1}</p>
                          <p className="text-sm">Alamat: {branch.address || '-'}</p>
                          <p className="text-sm">PIC: {branch.pic_name || '-'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Business & Tax Section */}
            <div className="rounded-lg border bg-card">
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50"
                onClick={() => toggleSection('business')}
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Usaha & Pajak</h4>
                </div>
                {expandedSections.includes('business') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>

              {expandedSections.includes('business') && (
                <div className="space-y-3 px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bidang Usaha</p>
                      <p>{businessInfoForm.watch('business_type') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">NPWP</p>
                      <p>{corporateForm.watch('npwp') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status PKP</p>
                      <p>
                        {taxIdentityForm.watch('pkp_status') === 'pkp' ? 'PKP' : 'Non-PKP'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accounting Preferences Section */}
            <div className="rounded-lg border bg-card">
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50"
                onClick={() => toggleSection('accounting')}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Preferensi Akuntansi</h4>
                </div>
                {expandedSections.includes('accounting') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>

              {expandedSections.includes('accounting') && (
                <div className="space-y-3 px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Template COA</p>
                      <p>
                        {accountingForm.watch('useDefaultCoa')
                          ? `Template: ${accountingForm.watch('coaTemplate') || 'Default'}`
                          : 'Custom COA'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Manual COA</p>
                      <p>{manualCoa.length} item(s)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Penomoran Voucher</p>
                      <p>
                        {accountingForm.watch('useTenantVoucherNumbering')
                          ? 'Menggunakan kebijakan tenant'
                          : `Custom: ${generateVoucherPreview()}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legal Documents Section */}
            <div className="rounded-lg border bg-card">
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-muted/50"
                onClick={() => toggleSection('legal')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Dokumen Legal</h4>
                </div>
                {expandedSections.includes('legal') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>

              {expandedSections.includes('legal') && (
                <div className="space-y-3 px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(legalDocumentForm.watch('aktaPendirian.status') || 'missing')}
                      <div>
                        <p className="text-sm font-medium">Akta Pendirian</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(
                            legalDocumentForm.watch('aktaPendirian.status') || 'missing',
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(legalDocumentForm.watch('aktaPerubahan.status') || 'missing')}
                      <div>
                        <p className="text-sm font-medium">Akta Perubahan</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(
                            legalDocumentForm.watch('aktaPerubahan.status') || 'missing',
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(legalDocumentForm.watch('siup.status') || 'missing')}
                      <div>
                        <p className="text-sm font-medium">SIUP</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(legalDocumentForm.watch('siup.status') || 'missing')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(legalDocumentForm.watch('tdp.status') || 'missing')}
                      <div>
                        <p className="text-sm font-medium">TDP</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(legalDocumentForm.watch('tdp.status') || 'missing')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(legalDocumentForm.watch('npwp.status') || 'missing')}
                      <div>
                        <p className="text-sm font-medium">NPWP</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(legalDocumentForm.watch('npwp.status') || 'missing')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(legalDocumentForm.watch('ktpDirektur.status') || 'missing')}
                      <div>
                        <p className="text-sm font-medium">KTP Direktur</p>
                        <p className="text-sm text-muted-foreground">
                          {getStatusText(
                            legalDocumentForm.watch('ktpDirektur.status') || 'missing',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Final Confirmation */}
            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="font-medium">Konfirmasi Final</p>
                  <p className="text-sm text-muted-foreground">
                    Pastikan semua data klien sudah benar sebelum menyimpan. Data yang telah
                    disimpan tidak dapat diubah melalui form ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Tambah Klien Baru</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCompleted
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-8 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="py-4">{renderStepContent()}</div>

        {/* Actions */}
        <div className="flex justify-between border-t pt-4">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Klien'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
