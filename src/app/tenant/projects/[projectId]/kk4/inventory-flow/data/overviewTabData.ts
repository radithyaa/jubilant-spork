// Inventory Flow OverviewTab Data

export interface OverviewStat {
  id: string;
  label: string;
  value: string;
  subText: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  borderColor?: string;
  progress?: number;
}

export interface IssueBreakdown {
  module: string;
  count: number;
  color: string;
}

export interface ComplianceData {
  category: string;
  percentage: number;
  color: string;
}

export interface ValidationSummary {
  id: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  description: string;
  matchRate: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  unmatched: string;
  issuesCount: number;
}

export interface MonthlyTrend {
  month: string;
  pph: number;
  ppn: number;
}

export interface ValidationMetric {
  id: string;
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  subText: string;
}

// Overview Stats Data
export const overviewStats: OverviewStat[] = [
  {
    id: "totalPembelian",
    label: "Total Pembelian",
    value: "892 Transaksi",
    subText: "Rp 15.5 M total nilai",
    icon: "ShoppingCart",
    iconColor: "#155DFC",
    bgColor: "#EFF6FF",
  },
  {
    id: "validationRate",
    label: "Validation Rate",
    value: "94%",
    subText: "Meningkat 2% dari bulan lalu",
    icon: "CheckCircle2",
    iconColor: "#00A63E",
    bgColor: "#F6FFED",
    progress: 94,
  },
  {
    id: "discrepancies",
    label: "Discrepancies",
    value: "42 Issues",
    subText: "6% dari total transaksi",
    icon: "AlertTriangle",
    iconColor: "#E7000B",
    bgColor: "#FFF1F0",
  },
  {
    id: "totalTax",
    label: "Total Pajak",
    value: "Rp 2.3 M",
    subText: "PPN + PPh tertagih",
    icon: "DollarSign",
    iconColor: "#1890FF",
    bgColor: "#E6F4FF",
  },
];

// Issue Breakdown Data (Bar Chart)
export const issueBreakdown: IssueBreakdown[] = [
  {
    module: "PPn 23 Jasa",
    count: 12,
    color: "#FF7A45",
  },
  {
    module: "PPn 22 Barang",
    count: 18,
    color: "#FAAD14",
  },
  {
    module: "PPN Masukan",
    count: 8,
    color: "#1890FF",
  },
  {
    module: "Faktur Pajak",
    count: 4,
    color: "#9810FA",
  },
];

// Tax Compliance Status Data (Donut Chart)
export const complianceData: ComplianceData[] = [
  {
    category: "Compliant",
    percentage: 94,
    color: "#00A63E",
  },
  {
    category: "Minor Issues",
    percentage: 5,
    color: "#FAAD14",
  },
  {
    category: "Critical",
    percentage: 1,
    color: "#E7000B",
  },
];

// Validation Summary Cards Data
export const validationSummaries: ValidationSummary[] = [
  {
    id: "kk451",
    badge: "KK 4.5.1",
    badgeBg: "#EFF6FF",
    badgeColor: "#155DFC",
    title: "PPh 23 & 22 Rekon",
    description: "Validasi cross-check PPh Jasa dan Barang dengan faktur pajak",
    matchRate: "96% Match",
    metrics: [
      { label: "Total DPP PPh", value: "Rp 5.2 M" },
      { label: "PPh 23 (3%)", value: "Rp 156 Jt" },
      { label: "PPh 22 (1.5%)", value: "Rp 78 Jt" },
      { label: "PPh Badan", value: "Rp 45 Jt" },
    ],
    unmatched: "3 transaksi tidak cocok",
    issuesCount: 3,
  },
  {
    id: "kk452",
    badge: "KK 4.5.2",
    badgeBg: "#F6FFED",
    badgeColor: "#00A63E",
    title: "PPN Masukan Rekon",
    description: "Validasi PPN masukan dengan bukti faktur yang dilaporkan",
    matchRate: "92% Match",
    metrics: [
      { label: "Total PPN Masukan", value: "Rp 2.1 M" },
      { label: "PPN Tercatat", value: "Rp 1.95 M" },
      { label: "PPN Tidak Valid", value: "Rp 150 Jt" },
      { label: "Selisih", value: "Rp 50 Jt" },
    ],
    unmatched: "8 transaksi tidak cocok",
    issuesCount: 8,
  },
];

// Monthly Validation Trend Data
export const monthlyTrend: MonthlyTrend[] = [
  {
    month: "Jun",
    pph: 88,
    ppn: 90,
  },
  {
    month: "Jul",
    pph: 85,
    ppn: 87,
  },
  {
    month: "Aug",
    pph: 91,
    ppn: 89,
  },
  {
    month: "Sep",
    pph: 93,
    ppn: 92,
  },
  {
    month: "Oct",
    pph: 96,
    ppn: 94,
  },
];

// Validation Metrics Data (Bottom Cards)
export const validationMetrics: ValidationMetric[] = [
  {
    id: "pph23",
    icon: "Receipt",
    iconColor: "#FF7A45",
    label: "PPh 23 Coverage",
    value: "98.2%",
    subText: "Dari total pembelian jasa",
  },
  {
    id: "pph22",
    icon: "Package",
    iconColor: "#FAAD14",
    label: "PPh 22 Coverage",
    value: "95.8%",
    subText: "Dari total pembelian barang",
  },
  {
    id: "ppnKredit",
    icon: "FileText",
    iconColor: "#1890FF",
    label: "PPN Dikreditkan",
    value: "2.05 M",
    subText: "Dari PPN masukan valid",
  },
  {
    id: "unmatched",
    icon: "AlertTriangle",
    iconColor: "#E7000B",
    label: "Total Unmatched",
    value: "14 Transaksi",
    subText: "Memerlukan review manual",
  },
];
