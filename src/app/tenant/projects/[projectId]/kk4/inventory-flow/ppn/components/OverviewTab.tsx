'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PieChart from '@/components/charts/PieChart';
import BarChart from '@/components/charts/BarChart';
import { Search, ChevronDown, Filter, MoreHorizontal, Eye, Receipt } from 'lucide-react';

// Mock data untuk PPN Purchase Transactions
const purchaseTransactions = [
  {
    invoice: 'INV-2025-001',
    date: '15 Sep 2025',
    faktur: '010.000-25.00000001',
    supplier: 'PT Supplier Material',
    npwp: '01.234.567.8-901.000',
    kategori: 'PKP',
    dppGl: 'Rp 500 jt',
    dppSpt: 'Rp 500 jt',
    ppnGl: 'Rp 55 jt',
    ppnSpt: 'Rp 55 jt',
    variance: '✓',
    dikreditkan: 'Ya',
    status: 'Matched',
    statusColor: 'success',
  },
  {
    invoice: 'INV-2025-GT-028',
    date: '22 Sep 2025',
    faktur: '010.000-25.00000018',
    supplier: 'PT Global Trading',
    npwp: '03.456.789.0-123.000',
    kategori: 'PKP',
    dppGl: 'Rp 1,2 M',
    dppSpt: 'Rp 1,2 M',
    ppnGl: 'Rp 132 jt',
    ppnSpt: 'Rp 132 jt',
    variance: '✓',
    dikreditkan: 'Ya',
    status: 'Matched',
    statusColor: 'success',
  },
  {
    invoice: 'INV-2025-MNT-089',
    date: '30 Sep 2025',
    faktur: '010.000-25.00000024',
    supplier: 'CV Jasa Maintenance',
    npwp: '06.789.012.3-456.000',
    kategori: 'PKP',
    dppGl: 'Rp 450 jt',
    dppSpt: 'Rp 450 jt',
    ppnGl: 'Rp 49,5 jt',
    ppnSpt: 'Rp 49,5 jt',
    variance: '✓',
    dikreditkan: 'Ya',
    status: 'Matched',
    statusColor: 'success',
  },
  {
    invoice: 'INV-2025-KON-067',
    date: '05 Okt 2025',
    faktur: '010.000-25.00000035',
    supplier: 'PT Konstruksi Jaya',
    npwp: '08.123.456.7-890.000',
    kategori: 'PKP',
    dppGl: 'Rp 950 jt',
    dppSpt: 'Rp 950 jt',
    ppnGl: 'Rp 104,5 jt',
    ppnSpt: 'Rp 104,5 jt',
    variance: '✓',
    dikreditkan: 'Ya',
    status: 'Matched',
    statusColor: 'success',
  },
  {
    invoice: 'INV-2025-PDM-123',
    date: '08 Okt 2025',
    faktur: '010.000-25.00000042',
    supplier: 'CV Perdagangan Makmur',
    npwp: '09.234.567.8-901.000',
    kategori: 'PKP',
    dppGl: 'Rp 680 jt',
    dppSpt: 'Rp 680 jt',
    ppnGl: 'Rp 74,8 jt',
    ppnSpt: 'Rp 74,8 jt',
    variance: '✓',
    dikreditkan: 'Ya',
    status: 'Matched',
    statusColor: 'success',
  },
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
    dikreditkan: 'Ya',
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
    dikreditkan: 'Ya',
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
    dikreditkan: 'Ya',
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
    dikreditkan: 'Ya',
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
    dikreditkan: 'Ya',
    status: 'Missing',
    statusColor: 'danger',
  },
  {
    invoice: 'INV-2025-WSR-234',
    date: '18 Okt 2025',
    faktur: '-',
    supplier: 'UD Warung Sari',
    npwp: '-',
    kategori: 'Non-PKP',
    dppGl: 'Rp 15 jt',
    dppSpt: 'Rp 0',
    ppnGl: 'Rp 0',
    ppnSpt: 'Rp 0',
    variance: 'Rp 0',
    dikreditkan: 'Tidak',
    status: 'Non-Creditable',
    statusColor: 'warning',
  },
];

// Data untuk Pie Chart
const pieChartData = [83.3, 16.7];
const pieChartOptions = {
  labels: ['PPN Dikreditkan: 83.3%', 'Tidak Dikreditkan: 16.7%'],
  colors: ['#52C41A', '#FAAD14'],
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
      },
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#fff'],
  },
};

// Data untuk Bar Chart
const barChartData = [
  {
    name: 'Variance Amount',
    data: [140000000, 105000000, 70000000, 35000000, 15000000],
  },
];

const barChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '60%',
      colors: {
        ranges: [
          { from: 0, to: 20000000, color: '#FFA940' },
          { from: 20000001, to: 40000000, color: '#FAAD14' },
          { from: 40000001, to: 80000000, color: '#FF7875' },
          { from: 80000001, to: 120000000, color: '#F5222D' },
          { from: 120000001, to: 150000000, color: '#CF1322' },
        ],
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      'PT Global Import',
      'PT Importir Barang',
      'CV Digital Services',
      'PT Industri Manufact...',
      'PT Equipment Supplie...',
    ],
    labels: {
      rotate: -45,
      rotateAlways: true,
      style: {
        fontSize: '10px',
      },
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => value.toLocaleString('id-ID'),
    },
  },
  grid: {
    borderColor: '#CCCCCC',
    strokeDashArray: 3,
  },
  colors: ['#CF1322', '#F5222D', '#FF7875', '#FAAD14', '#FFA940'],
};

export default function OverviewTab() {
  return (
    <div className="flex flex-col gap-[14px]">
      {/* Top Charts Row */}
      <div className="flex gap-[14px]">
        {/* PPN Creditable Status Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-[#1A1A2E]">PPN Creditable Status</CardTitle>
            <CardDescription className="text-sm">Breakdown of creditable vs non-creditable PPN</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="w-[300px] h-[300px]">
                <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
              </div>
            </div>
            <div className="flex justify-center gap-10 mt-4 pt-4 border-t">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#52C41A]" />
                  <span className="text-[11px] text-[#64748B]">PPN Dikreditkan</span>
                </div>
                <span className="text-xs font-bold text-[#1A1A2E]">Rp 1,127 M</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#FAAD14]" />
                  <span className="text-[11px] text-[#64748B]">Tidak Dikreditkan</span>
                </div>
                <span className="text-xs font-bold text-[#1A1A2E]">Rp 225,83 jt</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Variances by Supplier Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-[#1A1A2E]">Top Variances by Supplier</CardTitle>
            <CardDescription className="text-sm">Largest DPP/PPN differences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[340px]">
              <BarChart chartData={barChartData} chartOptions={barChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PPN Purchase Transactions Table */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-[#1A1A2E]">PPN Purchase Transactions (15)</CardTitle>
          <CardDescription className="text-sm">Detailed validation of purchases vs PPN reporting</CardDescription>
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
              <thead className="bg-slate-50">
                <tr className="border-b">
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
                  <th className="px-3.5 py-3 text-center text-[11px] font-normal text-[#64748B] uppercase tracking-wide">
                    Dikreditkan
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
                {purchaseTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      transaction.statusColor === 'warning' ? 'bg-[#FFFBE6]/30' : ''
                    } ${transaction.statusColor === 'danger' ? 'bg-[#FFF1F0]/30' : ''}`}
                  >
                    <td className="px-3.5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5 text-[#64748B]" />
                        <div className="flex flex-col">
                          <span className="text-xs font-normal text-[#1A1A2E] font-mono">{transaction.invoice}</span>
                          <span className="text-[11px] text-[#64748B]">{transaction.date}</span>
                          <span className="text-[11px] text-[#64748B] font-mono">{transaction.faktur}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#1A1A2E]">{transaction.supplier}</span>
                        <span className="text-[11px] text-[#64748B] font-mono">{transaction.npwp}</span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      {transaction.kategori === 'PKP' && (
                        <Badge variant="outline" className="border-[#1890FF] bg-[#E6F7FF] text-[#1890FF]">
                          PKP
                        </Badge>
                      )}
                      {transaction.kategori === 'Import' && (
                        <Badge variant="outline" className="border-[#722ED1] bg-[#F9F0FF] text-[#722ED1]">
                          Import
                        </Badge>
                      )}
                      {transaction.kategori === 'Non-PKP' && (
                        <Badge variant="outline" className="border-[#FAAD14] bg-[#FFF7E6] text-[#FAAD14]">
                          Non-PKP
                        </Badge>
                      )}
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{transaction.dppGl}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{transaction.dppSpt}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{transaction.ppnGl}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span className="text-xs text-[#1A1A2E] font-mono">{transaction.ppnSpt}</span>
                    </td>
                    <td className="px-3.5 py-3.5 text-right">
                      <span
                        className={`text-xs font-mono ${
                          transaction.variance === '✓' ? 'text-[#52C41A]' : 'text-[#F5222D]'
                        }`}
                      >
                        {transaction.variance}
                      </span>
                    </td>
                    <td className="px-3.5 py-3.5 text-center">
                      {transaction.dikreditkan === 'Ya' ? (
                        <Badge variant="outline" className="border-[#52C41A] bg-[#F6FFED] text-[#52C41A]">
                          Ya
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#FAAD14] bg-[#FFF7E6] text-[#FAAD14]">
                          Tidak
                        </Badge>
                      )}
                    </td>
                    <td className="px-3.5 py-3.5">
                      {transaction.status === 'Matched' && (
                        <Badge variant="outline" className="border-[#52C41A] bg-[#F6FFED] text-[#52C41A]">
                          Matched
                        </Badge>
                      )}
                      {transaction.status === 'Variance' && (
                        <Badge variant="outline" className="border-[#FAAD14] bg-[#FFFBE6] text-[#FAAD14]">
                          Variance
                        </Badge>
                      )}
                      {transaction.status === 'Missing' && (
                        <Badge variant="outline" className="border-[#F5222D] bg-[#FFF1F0] text-[#F5222D]">
                          Missing
                        </Badge>
                      )}
                      {transaction.status === 'Non-Creditable' && (
                        <Badge variant="outline" className="border-[#FAAD14] bg-[#FFF7E6] text-[#FAAD14]">
                          Non-Creditable
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
