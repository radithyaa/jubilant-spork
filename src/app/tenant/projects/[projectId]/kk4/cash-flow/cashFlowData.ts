// Overview Tab Data
export const overviewStatsData = [
  {
    id: "1",
    label: "Total Penjualan",
    value: "Rp 4,16 M",
    description: "dari KK ini saja",
    color: "#64748B",
    bgColor: "#F5F5F5",
  },
  {
    id: "2",
    label: "Kas Diterima",
    value: "Rp 2,36 M",
    description: "Penerimaan penjualan",
    color: "#096",
    bgColor: "#F0FDF4",
  },
  {
    id: "3",
    label: "Selisih",
    value: "Rp 1,8 M",
    description: "Belum diterima",
    color: "#E7000B",
    bgColor: "#FFF1F0",
  },
  {
    id: "4",
    label: "Rasio Realisasi",
    value: "56.7%",
    description: "Cash realization ratio",
    color: "#1447E6",
    bgColor: "#DBEAFE",
  },
  {
    id: "5",
    label: "Pending Items",
    value: "5",
    description: "Awaiting items",
    color: "#64748B",
    bgColor: "#F5F5F5",
  },
];

export const overviewTransactionsData = [
  {
    id: "1",
    invoice: "INV/2025/01/001",
    customer: "PT Maju Jaya",
    salesAmount: "Rp 500,000,000",
    cashIn: "Rp 500,000,000",
    difference: "Rp 0",
    realization: "100%",
    invoiceDate: "01-15-2025",
    paymentDate: "01-20-2025",
    dueDate: "02-14-2025",
    status: "Landed",
    statusColor: "#52C41A",
    statusBg: "#F6FFED",
  },
  {
    id: "2",
    invoice: "INV/2025/01/002",
    customer: "CV Sejahtera",
    salesAmount: "Rp 850,000,000",
    cashIn: "Rp 425,000,000",
    difference: "Rp 425,000,000",
    realization: "50%",
    invoiceDate: "01-10-2025",
    paymentDate: "01-25-2025",
    dueDate: "02-10-2025",
    status: "Partial",
    statusColor: "#FAAD14",
    statusBg: "#FFFBE6",
  },
  {
    id: "3",
    invoice: "INV/2025/01/003",
    customer: "PT Global Tech",
    salesAmount: "Rp 750,000,000",
    cashIn: "Rp 0",
    difference: "Rp 750,000,000",
    realization: "0%",
    invoiceDate: "01-05-2025",
    paymentDate: "-",
    dueDate: "02-05-2025",
    status: "Pending",
    statusColor: "#8C8C8C",
    statusBg: "#F5F5F5",
  },
  {
    id: "4",
    invoice: "INV/2025/01/004",
    customer: "UD Mandiri",
    salesAmount: "Rp 600,000,000",
    cashIn: "Rp 600,000,000",
    difference: "Rp 0",
    realization: "100%",
    invoiceDate: "01-08-2025",
    paymentDate: "01-18-2025",
    dueDate: "02-08-2025",
    status: "Landed",
    statusColor: "#52C41A",
    statusBg: "#F6FFED",
  },
  {
    id: "5",
    invoice: "INV/2025/01/005",
    customer: "PT Industri Nusantara",
    salesAmount: "Rp 1,200,000,000",
    cashIn: "Rp 400,000,000",
    difference: "Rp 800,000,000",
    realization: "33%",
    invoiceDate: "01-01-2025",
    paymentDate: "01-20-2025",
    dueDate: "02-01-2025",
    status: "Partial",
    statusColor: "#FAAD14",
    statusBg: "#FFFBE6",
  },
];

export const agingAnalysisData = [
  { bucket: "< 30 Hari", value: 3, label: "Kurang" },
  { bucket: "31-60 Hari", value: 5, label: "Menengah" },
  { bucket: "61-90 Hari", value: 2, label: "Panjang" },
  { bucket: "> 90 Hari", value: 1, label: "Overdraft" },
];

// Sales Tab Data
export const salesStatsData = [
  {
    id: "1",
    label: "Total A/R",
    value: "Rp 2,495 M",
    description: "Outstanding receivables",
    color: "#64748B",
    bgColor: "#F5F5F5",
  },
  {
    id: "2",
    label: "High Risk A/R",
    value: "Rp 530 jt",
    description: "21% of total",
    color: "#E7000B",
    bgColor: "#FFF1F0",
  },
  {
    id: "3",
    label: "Over 90 Days",
    value: "Rp 45 jt",
    description: "Requires immediate action",
    color: "#FAAD14",
    bgColor: "#FFFBE6",
  },
  {
    id: "4",
    label: "Collection Rate",
    value: "89%",
    description: "+5% from last month",
    color: "#096",
    bgColor: "#D0FAE5",
  },
];

export const monthlyCashFlowData = [
  {
    month: "May",
    sales: 2100,
    cash: 1950,
    arOutstanding: 150,
  },
  {
    month: "Jun",
    sales: 2300,
    cash: 2120,
    arOutstanding: 180,
  },
  {
    month: "Jul",
    sales: 2450,
    cash: 2240,
    arOutstanding: 210,
  },
  {
    month: "Aug",
    sales: 2650,
    cash: 2380,
    arOutstanding: 270,
  },
  {
    month: "Sep",
    sales: 2550,
    cash: 2350,
    arOutstanding: 200,
  },
];

export const flowReconciliationData = [
  {
    label: "Total Sales (Revenue)",
    value: "Rp 2.600.000.000",
  },
  {
    label: "Cash Collected",
    value: "(Rp 2.500.000.000)",
  },
  {
    label: "Accounts Receivable Increase",
    value: "Rp 100.000.000",
  },
];

export const reportsExportData = [
  {
    id: "1",
    title: "Export Aging Report",
    icon: "FileText",
  },
  {
    id: "2",
    title: "Generate Collection List",
    icon: "FileText",
  },
  {
    id: "3",
    title: "Mark as Reviewed",
    icon: "CheckCircle",
  },
];

// Aging Tab Data
export const agingSummaryData = [
  {
    bucket: "Current",
    value: 2200,
    label: "Current",
  },
  {
    bucket: "1-30 Days",
    value: 1800,
    label: "1-30 Days",
  },
  {
    bucket: "31-60 Days",
    value: 1400,
    label: "31-60 Days",
  },
  {
    bucket: "61-90 Days",
    value: 900,
    label: "61-90 Days",
  },
  {
    bucket: "> 90 Days (Overdue)",
    value: 600,
    label: "> 90 Days",
  },
];

export const agingDetailData = [
  {
    id: "1",
    customer: "PT ABC Industries",
    current: "Rp 458 jt",
    days130: "Rp 125 jt",
    days3160: "Rp 0",
    days6190: "Rp 0",
    days90Plus: "Rp 0",
    total: "Rp 575 jt",
    status: "Healthy",
    statusColor: "#52C41A",
    statusBg: "#F6FFED",
  },
  {
    id: "2",
    customer: "CV XYZ Trading",
    current: "Rp 328 jt",
    days130: "Rp 188 jt",
    days3160: "Rp 91 jt",
    days6190: "Rp 0",
    days90Plus: "Rp 0",
    total: "Rp 595 jt",
    status: "Monitor",
    statusColor: "#FAAD14",
    statusBg: "#FFFBE6",
  },
  {
    id: "3",
    customer: "PT Global Solutions",
    current: "Rp 288 jt",
    days130: "Rp 0",
    days3160: "Rp 0",
    days6190: "Rp 0",
    days90Plus: "Rp 288 jt",
    total: "Rp 288 jt",
    status: "High Risk",
    statusColor: "#E7000B",
    statusBg: "#FFF1F0",
  },
  {
    id: "4",
    customer: "UD Sejahtera Makmur",
    current: "Rp 158 jt",
    days130: "Rp 123 jt",
    days3160: "Rp 91 jt",
    days6190: "Rp 45 jt",
    days90Plus: "Rp 0",
    total: "Rp 534 jt",
    status: "Healthy",
    statusColor: "#52C41A",
    statusBg: "#F6FFED",
  },
  {
    id: "5",
    customer: "PT Mitra Bisnis",
    current: "Rp 428 jt",
    days130: "Rp 95 jt",
    days3160: "Rp 0",
    days6190: "Rp 0",
    days90Plus: "Rp 0",
    total: "Rp 513 jt",
    status: "Healthy",
    statusColor: "#52C41A",
    statusBg: "#F6FFED",
  },
];

export const actionRequiredAlerts = [
  {
    id: "1",
    type: "error",
    title: "Action Required",
    description: "PT Global Solutions - Rp 288 jt overdue 60+ days - immediate collection action",
    severity: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "UD Sejahtera Makmur",
    description: "Rp 45 jt due within 30 days - follow-up recommended",
    severity: "medium",
  },
  {
    id: "3",
    type: "info",
    title: "CV XYZ Trading",
    description: "Rp 91 jt due within 60 days - follow up recommended",
    severity: "low",
  },
];
