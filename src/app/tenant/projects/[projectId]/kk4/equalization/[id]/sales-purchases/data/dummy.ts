export interface InvoiceItem {
  id: string;
  nomorFaktur: string;
  tanggal: string;
  npwpSupplier: string;
  supplierName: string;
  poNumber?: string;
  dpp: number;
  ppn: number;
  status: "Doc OK" | "Calc OK" | "Doc Missing" | "No Match" | "Doc Incomplete" | "Calc Missing";
  docStatus: "complete" | "partial" | "missing";
  calcStatus: "match" | "variance" | "mismatch";
  variancePercent?: number;
  isImported?: boolean;
  aiReady?: boolean;
  notes?: string;
}

export interface UnmatchedInvoiceItem {
  id: string;
  invoiceNumber: string;
  tanggal: string;
  supplierName: string;
  totalAmount: number;
  ppnAmount: number;
  invoiceAmount: string;
  status: "pending" | "ready";
}

export interface SalesPurchasesData {
  output: InvoiceItem[];
  input: InvoiceItem[];
  unmatched: UnmatchedInvoiceItem[];
  summary: {
    totalPpnKeluaran: number;
    totalPpnMasukan: number;
    outputStats: {
      complete: number;
      partial: number;
      missing: number;
      matchCount: number;
      varianceCount: number;
      mismatchCount: number;
      fullyMatched: number;
      totalRecords: number;
      aiSuggestions: number;
    };
    inputStats: {
      complete: number;
      partial: number;
      missing: number;
      matchCount: number;
      varianceCount: number;
      mismatchCount: number;
      fullyMatched: number;
      totalRecords: number;
      aiSuggestions: number;
    };
  };
  requireAction: InvoiceItem[];
}

export const dummyData: SalesPurchasesData = {
  output: [
    {
      id: "001",
      nomorFaktur: "018.000-24.00000001",
      tanggal: "2024-09-03",
      npwpSupplier: "11.222.333.4-555.000",
      supplierName: "PT Mitra Sejahtera",
      poNumber: "PO-2024-0512",
      dpp: 175000000,
      ppn: 19250000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "match",
      aiReady: false,
    },
    {
      id: "002",
      nomorFaktur: "018.000-24.00000002",
      tanggal: "2024-09-10",
      npwpSupplier: "22.333.444.5-666.000",
      supplierName: "CV Mandiri Jaya",
      dpp: 65000000,
      ppn: 7150000,
      status: "No Match",
      docStatus: "complete",
      calcStatus: "mismatch",
      aiReady: false,
    },
    {
      id: "003",
      nomorFaktur: "011.900-24.00000203",
      tanggal: "2024-09-15",
      npwpSupplier: "33.444.555.6-777.000",
      supplierName: "PT Import Global",
      poNumber: "IMP-2024-0089",
      dpp: 250000000,
      ppn: 27500000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "match",
      isImported: true,
      aiReady: false,
    },
    {
      id: "004",
      nomorFaktur: "020.000-24.00000104",
      tanggal: "2024-09-18",
      npwpSupplier: "44.555.666.7-888.000",
      supplierName: "PT Logistik Express",
      poNumber: "PO-2024-0621",
      dpp: 95000000,
      ppn: 10450000,
      status: "Doc Incomplete",
      docStatus: "partial",
      calcStatus: "variance",
      variancePercent: 3.26,
      aiReady: false,
    },
    {
      id: "005",
      nomorFaktur: "020.000-24.00000105",
      tanggal: "2024-09-20",
      npwpSupplier: "55.666.777.8-999.000",
      supplierName: "CV Bahan Baku",
      poNumber: "PO-2024-0634",
      dpp: 180000000,
      ppn: 19800000,
      status: "Doc Missing",
      docStatus: "missing",
      calcStatus: "mismatch",
      variancePercent: 2.86,
      aiReady: false,
    },
    {
      id: "006",
      nomorFaktur: "020.000-24.00000106",
      tanggal: "2024-09-22",
      npwpSupplier: "66.777.888.9-000.000",
      supplierName: "PT Teknologi Maju",
      poNumber: "PO-2024-0645",
      dpp: 150000000,
      ppn: 16500000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "match",
      aiReady: false,
    },
    {
      id: "007",
      nomorFaktur: "020.000-24.00000107",
      tanggal: "2024-09-25",
      npwpSupplier: "77.888.999.0-111.000",
      supplierName: "CV Cemerlang",
      poNumber: "PO-2024-0658",
      dpp: 72000000,
      ppn: 7920000,
      status: "Doc Incomplete",
      docStatus: "partial",
      calcStatus: "variance",
      variancePercent: 2.86,
      aiReady: false,
    },
  ],
  input: [
    {
      id: "i001",
      nomorFaktur: "010.000-24.00000001",
      tanggal: "2024-09-03",
      npwpSupplier: "01.234.567.8-901.000",
      supplierName: "PT Supplier Utama",
      poNumber: "INV-2024-0512",
      dpp: 175000000,
      ppn: 19250000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "match",
      aiReady: false,
    },
    {
      id: "i002",
      nomorFaktur: "010.000-24.00000002",
      tanggal: "2024-09-10",
      npwpSupplier: "02.345.678.9-012.000",
      supplierName: "CV Berkah Jaya",
      dpp: 85000000,
      ppn: 9350000,
      status: "No Match",
      docStatus: "complete",
      calcStatus: "mismatch",
      notes: "No matching invoice found in system",
      aiReady: false,
    },
    {
      id: "i003",
      nomorFaktur: "010.000-24.00000003",
      tanggal: "2024-09-12",
      npwpSupplier: "03.456.789.0-123.000",
      supplierName: "PT Global Solutions",
      poNumber: "INV-2024-0923",
      dpp: 95000000,
      ppn: 10450000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "variance",
      variancePercent: 5.26,
      aiReady: true,
      notes: "DPP variance: +Rp 5.000.000 (+5.26%)",
    },
    {
      id: "i004",
      nomorFaktur: "010.000-24.00000004",
      tanggal: "2024-09-15",
      npwpSupplier: "04.567.890.1-234.000",
      supplierName: "PT Mitra Sejahtera",
      poNumber: "INV-2024-0901",
      dpp: 125000000,
      ppn: 13750000,
      status: "Doc Incomplete",
      docStatus: "partial",
      calcStatus: "match",
      aiReady: false,
      notes: "Possible duplicate with FPK-001",
    },
    {
      id: "i005",
      nomorFaktur: "010.000-24.00000005",
      tanggal: "2024-09-20",
      npwpSupplier: "05.678.901.2-345.000",
      supplierName: "UD Sentosa",
      poNumber: "INV-2024-0945",
      dpp: 45000000,
      ppn: 4950000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "match",
      aiReady: false,
    },
    {
      id: "i006",
      nomorFaktur: "010.000-24.00000006",
      tanggal: "2024-09-22",
      npwpSupplier: "06.789.012.3-456.000",
      supplierName: "PT Teknologi Maju",
      poNumber: "INV-2024-0967",
      dpp: 150000000,
      ppn: 16500000,
      status: "Doc Missing",
      docStatus: "missing",
      calcStatus: "match",
      notes: "Physical faktur not yet uploaded",
      aiReady: false,
    },
    {
      id: "i007",
      nomorFaktur: "010.000-24.00000007",
      tanggal: "2024-09-25",
      npwpSupplier: "07.890.123.4-567.000",
      supplierName: "CV Cemerlang",
      poNumber: "INV-2024-0982",
      dpp: 72000000,
      ppn: 7920000,
      status: "Doc Incomplete",
      docStatus: "partial",
      calcStatus: "variance",
      variancePercent: 2.86,
      aiReady: true,
      notes: "Scanned copy only\nDPP variance: +Rp 2.000.000 (+2.86%)",
    },
  ],
  unmatched: [
    {
      id: "u001",
      invoiceNumber: "INV/2024/09/009 - 2024-09-25",
      tanggal: "2024-09-25",
      supplierName: "PT Tech Invoices",
      totalAmount: 127650000,
      ppnAmount: 0,
      invoiceAmount: "Rp 127.650.000",
      status: "pending",
    },
    {
      id: "u002",
      invoiceNumber: "INV/2024/09/010 - 2024-09-25",
      tanggal: "2024-09-25",
      supplierName: "PT Tech Invoices",
      totalAmount: 127650000,
      ppnAmount: 0,
      invoiceAmount: "Rp 127.650.000",
      status: "pending",
    },
    {
      id: "u003",
      invoiceNumber: "INV/2024/09/011 - 2024-09-25",
      tanggal: "2024-09-25",
      supplierName: "PT Tech Invoices",
      totalAmount: 127650000,
      ppnAmount: 0,
      invoiceAmount: "Rp 127.650.000",
      status: "pending",
    },
    {
      id: "u004",
      invoiceNumber: "INV/2024/09/012 - 2024-09-25",
      tanggal: "2024-09-25",
      supplierName: "PT Tech Invoices",
      totalAmount: 127650000,
      ppnAmount: 0,
      invoiceAmount: "Rp 127.650.000",
      status: "pending",
    },
    {
      id: "u005",
      invoiceNumber: "PO/2024/08/989 - 2024-09-29",
      tanggal: "2024-09-29",
      supplierName: "PT Supplier Baru",
      totalAmount: 97680000,
      ppnAmount: 0,
      invoiceAmount: "Rp 97.680.000",
      status: "pending",
    },
  ],
  summary: {
    totalPpnKeluaran: 76670000,
    totalPpnMasukan: 84150000,
    outputStats: {
      complete: 4,
      partial: 2,
      missing: 1,
      matchCount: 4,
      varianceCount: 2,
      mismatchCount: 1,
      fullyMatched: 2,
      totalRecords: 7,
      aiSuggestions: 2,
    },
    inputStats: {
      complete: 3,
      partial: 1,
      missing: 1,
      matchCount: 2,
      varianceCount: 2,
      mismatchCount: 1,
      fullyMatched: 2,
      totalRecords: 5,
      aiSuggestions: 3,
    },
  },
  requireAction: [
    {
      id: "002",
      nomorFaktur: "018.000-24.00000002",
      tanggal: "2024-09-10",
      npwpSupplier: "22.333.444.5-666.000",
      supplierName: "CV Berkah Jaya",
      dpp: 85000000,
      ppn: 9350000,
      status: "No Match",
      docStatus: "complete",
      calcStatus: "mismatch",
      notes: "No matching invoice found in system",
    },
    {
      id: "003",
      nomorFaktur: "010.000-24.00000003",
      tanggal: "2024-09-12",
      npwpSupplier: "03.456.789.0-123.000",
      supplierName: "PT Global Solutions",
      dpp: 95000000,
      ppn: 10450000,
      status: "Doc OK",
      docStatus: "complete",
      calcStatus: "variance",
      variancePercent: 5.26,
      aiReady: true,
      notes: "DPP variance: +Rp 5.000.000 (+5.26%)",
    },
    {
      id: "004",
      nomorFaktur: "010.000-24.00000004",
      tanggal: "2024-09-15",
      npwpSupplier: "04.567.890.1-234.000",
      supplierName: "PT Mitra Sejahtera",
      dpp: 125000000,
      ppn: 13750000,
      status: "Doc Incomplete",
      docStatus: "partial",
      calcStatus: "match",
      notes: "Possible duplicate with FPK-001",
    },
    {
      id: "006",
      nomorFaktur: "010.000-24.00000006",
      tanggal: "2024-09-22",
      npwpSupplier: "06.789.012.3-456.000",
      supplierName: "PT Teknologi Maju",
      dpp: 150000000,
      ppn: 16500000,
      status: "Doc Missing",
      docStatus: "missing",
      calcStatus: "match",
      notes: "Physical faktur not yet uploaded",
    },
    {
      id: "007",
      nomorFaktur: "010.000-24.00000007",
      tanggal: "2024-09-25",
      npwpSupplier: "07.890.123.4-567.000",
      supplierName: "CV Cemerlang",
      dpp: 72000000,
      ppn: 7920000,
      status: "Doc Incomplete",
      docStatus: "partial",
      calcStatus: "variance",
      variancePercent: 2.86,
      aiReady: true,
      notes: "Scanned copy only\nDPP variance: +Rp 2.000.000 (+2.86%)",
    },
  ],
};
