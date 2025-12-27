'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, Filter, MoreHorizontal, Eye, Receipt, AlertTriangle } from 'lucide-react';

// Mock data untuk Variance & Missing Items
const varianceItems = [
  {
    invoice: 'INV-2025-DGT-045',
    date: '18 Sep 2025',
    faktur: '010.000-25.00000012',
    supplier: 'CV Digital Services',
    npwp: '02.345.678.9-012.000',
    kategori: 'PKP',
    dppGl: 'Rp 850 jt',
    dppSpt: 'Rp 820 jt',
    ppnGl: 'Rp 93,5 jt',
    ppnSpt: 'Rp 90,2 jt',
    variance: 'Rp 30 jt',
    status: 'Variance',
    statusColor: 'warning',
  },
  {
    invoice: 'INV-2025-EQP-034',
    date: '02 Okt 2025',
    faktur: '010.000-25.00000031',
    supplier: 'PT Equipment Supplier',
    npwp: '07.890.123.4-567.000',
    kategori: 'PKP',
    dppGl: 'Rp 1,8 M',
    dppSpt: 'Rp 1,792 M',
    ppnGl: 'Rp 198 jt',
    ppnSpt: 'Rp 197,12 jt',
    variance: 'Rp 8 jt',
    status: 'Variance',
    statusColor: 'warning',
  },
  {
    invoice: 'INV-2025-IND-045',
    date: '14 Okt 2025',
    faktur: '010.000-25.00000056',
    supplier: 'PT Industri Manufacturing',
    npwp: '12.567.890.1-234.000',
    kategori: 'PKP',
    dppGl: 'Rp 2,1 M',
    dppSpt: 'Rp 2,085 M',
    ppnGl: 'Rp 231 jt',
    ppnSpt: 'Rp 229,35 jt',
    variance: 'Rp 15 jt',
    status: 'Variance',
    statusColor: 'warning',
  },
  {
    invoice: 'PIB-2025-012',
    date: '28 Sep 2025',
    faktur: 'PIB-012-2025',
    supplier: 'PT Importir Barang',
    npwp: '05.678.901.2-345.000',
    kategori: 'Import',
    dppGl: 'Rp 750 jt',
    dppSpt: 'Rp 0',
    ppnGl: 'Rp 82,5 jt',
    ppnSpt: 'Rp 0',
    variance: 'Rp 82,5 jt',
    status: 'Missing',
    statusColor: 'danger',
  },
  {
    invoice: 'PIB-2025-024',
    date: '15 Okt 2025',
    faktur: 'PIB-024-2025',
    supplier: 'PT Global Import',
    npwp: '13.678.901.2-345.000',
    kategori: 'Import',
    dppGl: 'Rp 1,25 M',
    dppSpt: 'Rp 0',
    ppnGl: 'Rp 137,5 jt',
    ppnSpt: 'Rp 0',
    variance: 'Rp 137,5 jt',
    status: 'Missing',
    statusColor: 'danger',
  },
];

export default function VarianceTab() {
  return (
    <div className="flex flex-col gap-[14px]">
      {/* Summary Cards Row */}
      <div className="flex gap-[14px]">
        {/* Total Issues Card */}
        <Card className="flex-1 bg-[#FFF1F0]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-normal text-[#1A1A2E]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E7000B]" />
              Total Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-[21px] font-normal text-[#F5222D]">5</div>
            <div className="text-[11px] text-[#64748B]">Requires attention</div>
          </CardContent>
        </Card>

        {/* Total Variance Amount Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xs font-normal text-[#1A1A2E]">Total Variance Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-[21px] font-normal text-[#F5222D]">Rp 273 jt</div>
            <div className="text-[11px] text-[#64748B]">DPP/PPN difference</div>
          </CardContent>
        </Card>

        {/* Breakdown Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xs font-normal text-[#1A1A2E]">Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#64748B]">Variance:</span>
              <span className="text-[#FAAD14]">3</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#64748B]">Missing:</span>
              <span className="text-[#F5222D]">2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variance & Missing Items Table */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#1A1A2E]">Variance & Missing Items (5)</CardTitle>
          <CardDescription className="text-sm">Items requiring investigation and correction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Filters */}
          <div className="flex items-center gap-5 p-2.5 rounded-lg bg-[#F4F7FE]">
            <div className="flex items-center gap-1 px-1.5 py-0 h-[54px] rounded-lg border border-[#D9D9D9] bg-white">
              <div className="flex items-center gap-1 px-2.5 py-1.5">
                <span className="text-sm font-medium text-[#49454F]">20</span>
                <ChevronDown className="w-3 h-6 text-[#332687]" />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-5 py-0 h-[54px] rounded-lg border border-[#D9D9D9] bg-white">
              <Search className="w-5 h-5 text-[#332687]" />
              <Input placeholder="Cari nama user" className="border-0 p-0 h-auto focus-visible:ring-0" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 px-1.5 py-0 h-[54px] rounded-lg border border-[#D9D9D9] bg-white">
                <div className="flex items-center gap-1 px-3 py-1.5">
                  <span className="text-sm font-medium text-[#49454F]">All Status</span>
                  <ChevronDown className="w-3 h-6 text-[#332687]" />
                </div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0 h-[54px] rounded-lg border border-[#D9D9D9] bg-white">
                <div className="flex items-center gap-1 px-3 py-1.5">
                  <span className="text-sm font-medium text-[#49454F]">All Type</span>
                  <ChevronDown className="w-3 h-6 text-[#332687]" />
                </div>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0 h-[54px] rounded-lg border border-[#D9D9D9] bg-[#F9FAFB]">
                <div className="flex items-center gap-1 px-3 py-1.5">
                  <Filter className="w-[18px] h-[18px] text-[#332687]" />
                  <span className="text-sm font-medium text-[#49454F]">Filter</span>
                </div>
              </div>
              <div className="w-[54px] h-[54px] rounded-lg bg-[#F4F7FE] flex items-center justify-center">
                <MoreHorizontal className="w-[35px] h-[35px] text-[#4318FF]" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3.5 py-3 text-left text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Invoice / Faktur
                  </th>
                  <th className="px-3.5 py-3 text-left text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Supplier
                  </th>
                  <th className="px-3.5 py-3 text-left text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Kategori
                  </th>
                  <th className="px-3.5 py-3 text-right text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    DPP (GL)
                  </th>
                  <th className="px-3.5 py-3 text-right text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    DPP (SPT)
                  </th>
                  <th className="px-3.5 py-3 text-right text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    PPN (GL)
                  </th>
                  <th className="px-3.5 py-3 text-right text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    PPN (SPT)
                  </th>
                  <th className="px-3.5 py-3 text-right text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Variance
                  </th>
                  <th className="px-3.5 py-3 text-left text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-3.5 py-3 text-center text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {varianceItems.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${item.statusColor === 'warning' ? 'bg-[#FFFBE6]/30' : ''} ${
                      item.statusColor === 'danger' ? 'bg-[#FFF1F0]/30' : ''
                    }`}
                  >
                    <td className="px-3.5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5 text-[#64748B]" />
                        <div className="flex flex-col">
                          <span className="text-xs font-normal text-[#1A1A2E] font-mono">{item.invoice}</span>
                          <span className="text-[11px] text-[#64748B]">{item.date}</span>
                          <span className="text-[11px] text-[#64748B] font-mono">{item.faktur}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#1A1A2E]">{item.supplier}</span>
                        <span className="text-[11px] text-[#64748B] font-mono">{item.npwp}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      {item.kategori === 'PKP' && (
                        <Badge variant="outline" className="border-[#1890FF] bg-[#E6F7FF] text-[#1890FF]">
                          PKP
                        </Badge>
                      )}
                      {item.kategori === 'Import' && (
                        <Badge variant="outline" className="border-[#722ED1] bg-[#F9F0FF] text-[#722ED1]">
                          Import
                        </Badge>
                      )}
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{item.dppGl}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{item.dppSpt}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{item.ppnGl}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{item.ppnSpt}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#F5222D] font-mono">{item.variance}</span>
                    </td>
                    <td className="px-3.5 py-3.5">
                      {item.status === 'Variance' && (
                        <Badge variant="outline" className="border-[#FAAD14] bg-[#FFFBE6] text-[#FAAD14]">
                          <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                          Variance
                        </Badge>
                      )}
                      {item.status === 'Missing' && (
                        <Badge variant="outline" className="border-[#F5222D] bg-[#FFF1F0] text-[#F5222D]">
                          Missing
                        </Badge>
                      )}
                    </td>
                    <td className="px-3.5 py-3.5 text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                        <Eye className="w-3.5 h-3.5 text-[#1A1A2E]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
