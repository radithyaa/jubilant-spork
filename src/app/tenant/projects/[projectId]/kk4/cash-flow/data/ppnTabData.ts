// Cash Flow PpnTab Data (KK 4.4.2: Uji Arus Uang vs PPN Penyerahan)

export interface PpnStatCard {
  id: string;
  label: string;
  value: string;
  subText: string;
  icon: string;
  iconColor: string;
  bgColor?: string;
  borderColor?: string;
}

export interface InvoiceRecord {
  id: string;
  fakturnomer: string;
  customer: {
    name: string;
    npwp: string;
  };
  dpp: string;
  ppn: string;
  total: string;
  kasMasuk: string;
  selisih: string;
  realisasi: number;
  tglPenyerahan: string;
  tglBayar: string;
  status: "Lunas" | "Parsial" | "Belum Bayar" | "Overdue";
  statusColor: string;
  statusBg: string;
}

export interface AgingBucket {
  id: string;
  label: string;
  value: number;
  bgColor: string;
  borderColor: string;
}

export interface CashFlowRatio {
  rasioRealisasi: string;
  totalPenyerahan: string;
  kasDiterima: string;
  outstanding: string;
  needsAttention: boolean;
}

// Stat Cards Data
export const ppnStatCards: PpnStatCard[] = [
  {
    id: "dpp",
    label: "Total DPP",
    value: "Rp 2.5 M",
    subText: "+12% from last month",
    icon: "DollarSign",
    iconColor: "#155DFC",
    bgColor: "#EFF6FF",
  },
  {
    id: "ppn",
    label: "Total PPN",
    value: "Rp 275 Jt",
    subText: "+12% from last month",
    icon: "Receipt",
    iconColor: "#9810FA",
    bgColor: "#FAF5FF",
  },
  {
    id: "kasDiterima",
    label: "Kas Diterima",
    value: "Rp 2.3 M",
    subText: "92% realisasi",
    icon: "TrendingUp",
    iconColor: "#00A63E",
    bgColor: "#F6FFED",
  },
  {
    id: "mismatch",
    label: "Total Mismatch",
    value: "Rp 145 Jt",
    subText: "5.8% of total",
    icon: "AlertTriangle",
    iconColor: "#E7000B",
    bgColor: "#FFF1F0",
    borderColor: "#F5222D",
  },
  {
    id: "pending",
    label: "Faktur Pending",
    value: "12 Faktur",
    subText: "Rp 450 Jt outstanding",
    icon: "Clock",
    iconColor: "#CA3500",
    bgColor: "#FFFBE6",
  },
];

// Invoice Table Data
export const invoiceRecords: InvoiceRecord[] = [
  {
    id: "1",
    fakturnomer: "PKP/2024/001",
    customer: {
      name: "PT Maju Jaya",
      npwp: "11.222.333.444-555.666",
    },
    dpp: "Rp 500 Jt",
    ppn: "Rp 55 Jt",
    total: "Rp 555 Jt",
    kasMasuk: "Rp 555 Jt",
    selisih: "Rp 0",
    realisasi: 100,
    tglPenyerahan: "01 Jan 2024",
    tglBayar: "05 Jan 2024",
    status: "Lunas",
    statusColor: "#00A63E",
    statusBg: "#F6FFED",
  },
  {
    id: "2",
    fakturnomer: "PKP/2024/002",
    customer: {
      name: "CV Sukses Bersama",
      npwp: "22.333.444.555-666.777",
    },
    dpp: "Rp 350 Jt",
    ppn: "Rp 38.5 Jt",
    total: "Rp 388.5 Jt",
    kasMasuk: "Rp 250 Jt",
    selisih: "Rp 138.5 Jt",
    realisasi: 64,
    tglPenyerahan: "05 Jan 2024",
    tglBayar: "20 Jan 2024",
    status: "Parsial",
    statusColor: "#FAAD14",
    statusBg: "#FFFBE6",
  },
  {
    id: "3",
    fakturnomer: "PKP/2024/003",
    customer: {
      name: "PT Global Niaga",
      npwp: "33.444.555.666-777.888",
    },
    dpp: "Rp 600 Jt",
    ppn: "Rp 66 Jt",
    total: "Rp 666 Jt",
    kasMasuk: "Rp 0",
    selisih: "Rp 666 Jt",
    realisasi: 0,
    tglPenyerahan: "10 Jan 2024",
    tglBayar: "—",
    status: "Belum Bayar",
    statusColor: "#155DFC",
    statusBg: "#EFF6FF",
  },
  {
    id: "4",
    fakturnomer: "PKP/2024/004",
    customer: {
      name: "PT Indonesia Makmur",
      npwp: "44.555.666.777-888.999",
    },
    dpp: "Rp 425 Jt",
    ppn: "Rp 46.75 Jt",
    total: "Rp 471.75 Jt",
    kasMasuk: "Rp 200 Jt",
    selisih: "Rp 271.75 Jt",
    realisasi: 42,
    tglPenyerahan: "08 Jan 2024",
    tglBayar: "—",
    status: "Overdue",
    statusColor: "#E7000B",
    statusBg: "#FFF1F0",
  },
  {
    id: "5",
    fakturnomer: "PKP/2024/005",
    customer: {
      name: "PT Sentosa Raya",
      npwp: "55.666.777.888-999.000",
    },
    dpp: "Rp 280 Jt",
    ppn: "Rp 30.8 Jt",
    total: "Rp 310.8 Jt",
    kasMasuk: "Rp 310.8 Jt",
    selisih: "Rp 0",
    realisasi: 100,
    tglPenyerahan: "12 Jan 2024",
    tglBayar: "15 Jan 2024",
    status: "Lunas",
    statusColor: "#00A63E",
    statusBg: "#F6FFED",
  },
  {
    id: "6",
    fakturnomer: "PKP/2024/006",
    customer: {
      name: "CV Citra Mandiri",
      npwp: "66.777.888.999-000.111",
    },
    dpp: "Rp 375 Jt",
    ppn: "Rp 41.25 Jt",
    total: "Rp 416.25 Jt",
    kasMasuk: "Rp 416.25 Jt",
    selisih: "Rp 0",
    realisasi: 100,
    tglPenyerahan: "02 Jan 2024",
    tglBayar: "10 Jan 2024",
    status: "Lunas",
    statusColor: "#00A63E",
    statusBg: "#F6FFED",
  },
  {
    id: "7",
    fakturnomer: "PKP/2024/007",
    customer: {
      name: "PT Harapan Jaya",
      npwp: "77.888.999.000-111.222",
    },
    dpp: "Rp 520 Jt",
    ppn: "Rp 57.2 Jt",
    total: "Rp 577.2 Jt",
    kasMasuk: "Rp 400 Jt",
    selisih: "Rp 177.2 Jt",
    realisasi: 69,
    tglPenyerahan: "07 Jan 2024",
    tglBayar: "—",
    status: "Parsial",
    statusColor: "#FAAD14",
    statusBg: "#FFFBE6",
  },
  {
    id: "8",
    fakturnomer: "PKP/2024/008",
    customer: {
      name: "PT Kesempatan Emas",
      npwp: "88.999.000.111-222.333",
    },
    dpp: "Rp 445 Jt",
    ppn: "Rp 48.95 Jt",
    total: "Rp 493.95 Jt",
    kasMasuk: "Rp 0",
    selisih: "Rp 493.95 Jt",
    realisasi: 0,
    tglPenyerahan: "15 Jan 2024",
    tglBayar: "—",
    status: "Belum Bayar",
    statusColor: "#155DFC",
    statusBg: "#EFF6FF",
  },
];

// Aging Buckets Data
export const agingBuckets: AgingBucket[] = [
  {
    id: "current",
    label: "Current",
    value: 3,
    bgColor: "#F6FFED",
    borderColor: "#00A63E",
  },
  {
    id: "days31-60",
    label: "31-60 Days",
    value: 2,
    bgColor: "#FFFBE6",
    borderColor: "#FAAD14",
  },
  {
    id: "days61-90",
    label: "61-90 Days",
    value: 2,
    bgColor: "#FFF7E6",
    borderColor: "#FF7A45",
  },
  {
    id: "days90plus",
    label: ">90 Days",
    value: 1,
    bgColor: "#FFF1F0",
    borderColor: "#F5222D",
  },
];

// Cash Flow Ratio Data
export const cashFlowRatioData: CashFlowRatio = {
  rasioRealisasi: "92%",
  totalPenyerahan: "Rp 2.5 M",
  kasDiterima: "Rp 2.3 M",
  outstanding: "Rp 200 Jt",
  needsAttention: false,
};
