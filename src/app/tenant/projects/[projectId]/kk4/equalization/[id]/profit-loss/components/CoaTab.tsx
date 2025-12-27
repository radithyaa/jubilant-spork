'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronRight, Search, Filter, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

interface CoaMapping {
	code: string;
	name: string;
	subItems: CoaSubItem[];
	isExpanded?: boolean;
}

interface CoaSubItem {
	code: string;
	name: string;
	journals: number;
	amount: number;
	deleted?: boolean;
}

const coaData: CoaMapping[] = [
	{
		code: '1771-1.1',
		name: 'Penerimaan Usaha (Revenue)',
		isExpanded: true,
		subItems: [
			{ code: '4-10180', name: 'Penjualan Barang', journals: 1245, amount: 95_600_000_000 },
			{ code: '4-10200', name: 'Penjualan Jasa', journals: 450, amount: 25_100_000_000 },
			{ code: '4-10300', name: 'Penjualan Lainnya', journals: 89, amount: 4_875_000_000 },
		],
	},
	{
		code: '1771-1.2',
		name: 'Harga Pokok Penjualan',
		isExpanded: false,
		subItems: [
			{ code: '5-10180', name: 'Harga Pokok Penjualan', journals: 856, amount: 78_000_000_000 },
			{ code: '5-10200', name: 'Unknown Account', journals: 0, amount: 0, deleted: true },
		],
	},
	{
		code: '1771-1.3',
		name: 'Laba/Rugi Bruto',
		isExpanded: false,
		subItems: [
			{
				code: 'CALCULATED',
				name: 'No COA mapped yet. Click "Add COA" to start mapping',
				journals: 0,
				amount: 0,
			},
		],
	},
	{
		code: '1771-1.4',
		name: 'Biaya Usaha Lainnya',
		isExpanded: false,
		subItems: [
			{ code: '6-10180', name: 'Biaya Gaji & Tunggakan', journals: 324, amount: 15_200_000_000 },
			{ code: '6-20180', name: 'Biaya Entertainment', journals: 156, amount: 3_500_000_000 },
			{ code: '6-30180', name: 'Biaya Perjalanan', journals: 24, amount: 725_000_000 },
		],
	},
	{
		code: '1771-1.5',
		name: 'Laba/Rugi Usaha',
		isExpanded: false,
		subItems: [
			{
				code: 'CALCULATED',
				name: 'No COA mapped yet. Click "Add COA" to start mapping',
				journals: 0,
				amount: 0,
			},
		],
	},
	{
		code: '1771-1.6',
		name: 'Penghasilan dari Luar Usaha',
		isExpanded: false,
		subItems: [
			{ code: '7-10180', name: 'Penghasilan Bunga', journals: 12, amount: 456_400_000 },
			{ code: '7-20180', name: 'Keutungan Selisih Kurs', journals: 45, amount: 400_200_000 },
		],
	},
	{
		code: '1771-1.7',
		name: 'Biaya dari Luar Usaha',
		isExpanded: false,
		subItems: [
			{ code: '8-10180', name: 'Biaya Bunga', journals: 24, amount: 425_000_000 },
		],
	},
];

const summaryStats = [
	{ label: 'Total Positions', value: '7', color: 'bg-blue-100 dark:bg-blue-900' },
	{ label: 'Matched', value: '4', color: 'bg-green-100 dark:bg-green-900' },
	{ label: 'Warning', value: '1', color: 'bg-yellow-100 dark:bg-yellow-900' },
	{ label: 'Critical', value: '2', color: 'bg-red-100 dark:bg-red-900' },
	{ label: 'Total Variance', value: 'Rp 1.880.600.000', color: 'bg-purple-100 dark:bg-purple-900' },
];

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
};

export default function CoaTab() {
	const [expandedItems, setExpandedItems] = useState<string[]>(['1771-1.1']);
	const [searchQuery, setSearchQuery] = useState('');

	const toggleExpand = (code: string) => {
		setExpandedItems((prev) =>
			prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
		);
	};

	const filteredData = coaData.filter((item) =>
		item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		item.code.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Summary Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-5">
				{summaryStats.map((stat, idx) => (
					<Card key={idx} className={`${stat.color}`}>
						<CardContent className="flex items-center justify-between pt-6">
							<div>
								<p className="text-xs font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
								<p className="mt-1 text-base font-bold text-navy-900 dark:text-white">{stat.value}</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Controls */}
			<Card>
				<CardContent className="flex flex-wrap gap-3 pt-6">
					<Select defaultValue="20">
						<SelectTrigger className="w-[70px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>

					<div className="relative flex-1">
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Cari nama user"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>

					<Select defaultValue="all">
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
						</SelectContent>
					</Select>

					<Select defaultValue="all">
						<SelectTrigger className="w-[100px]">
							<SelectValue placeholder="All Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Type</SelectItem>
						</SelectContent>
					</Select>

					<Button variant="outline" size="icon">
						<Filter className="h-4 w-4" />
					</Button>

					<Button variant="ghost" size="icon">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</CardContent>
			</Card>

			{/* COA Mapping List */}
			<div className="space-y-2">
				{filteredData.map((mainItem) => (
					<Card key={mainItem.code} className="overflow-hidden">
						{/* Main Item Header */}
						<div
							className="flex cursor-pointer items-center justify-between bg-gradient-to-r from-gray-50 to-white p-4 dark:from-navy-800 dark:to-navy-900"
							onClick={() => toggleExpand(mainItem.code)}
						>
							<div className="flex flex-1 items-center gap-3">
								{mainItem.subItems.length > 0 ? (
									expandedItems.includes(mainItem.code) ? (
										<ChevronDown className="h-5 w-5 text-gray-400" />
									) : (
										<ChevronRight className="h-5 w-5 text-gray-400" />
									)
								) : (
									<div className="w-5" />
								)}
								<div className="flex flex-1 items-center gap-4">
									<span className="font-semibold text-navy-900 dark:text-white">
										{mainItem.code}
									</span>
									<span className="text-sm text-gray-700 dark:text-gray-300">
										{mainItem.name}
									</span>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="ml-auto"
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<Plus className="h-4 w-4" />
								Add COA
							</Button>
						</div>

						{/* Expanded Sub Items */}
						{expandedItems.includes(mainItem.code) && mainItem.subItems.length > 0 && (
							<CardContent className="border-t pt-4">
								<div className="space-y-2">
									{mainItem.subItems.map((subItem, idx) => (
										<div
											key={idx}
											className={`flex items-center justify-between rounded-lg border p-3 ${
												subItem.deleted
													? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
													: 'border-gray-200 bg-white dark:border-navy-700 dark:bg-navy-800'
											}`}
										>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium text-gray-900 dark:text-white">
														{subItem.code}
													</span>
													<span className="text-sm text-gray-600 dark:text-gray-400">
														{subItem.name}
													</span>
													{subItem.deleted && (
														<Badge variant="outline" className="bg-red-100 dark:bg-red-900/30">
															Deleted
														</Badge>
													)}
												</div>
												<div className="mt-1 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
													<span>{subItem.journals} journals</span>
													<span>{formatCurrency(subItem.amount)}</span>
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</CardContent>
						)}

						{/* No COA Message */}
						{expandedItems.includes(mainItem.code) &&
							mainItem.subItems.length === 0 && (
								<CardContent className="border-t py-4 text-center text-sm text-gray-600 dark:text-gray-400">
									No COA mapped yet. Click "Add COA" to start mapping
								</CardContent>
							)}
					</Card>
				))}
			</div>
		</div>
	);
}
