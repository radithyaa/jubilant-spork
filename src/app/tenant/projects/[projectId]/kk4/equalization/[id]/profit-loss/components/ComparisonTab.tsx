'use client';

import { useState, useMemo } from 'react';
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { AlertCircle, Eye, Search, Filter, MoreHorizontal } from 'lucide-react';

interface ComparisonItem {
	code: string;
	description: string;
	sptAmount: number;
	glAmount: number;
	variance: number;
	variancePercent: number;
	status: 'matched' | 'warning' | 'critical';
}

const comparisonData: ComparisonItem[] = [
	{
		code: '1771-1.1',
		description: 'Penerimaan Usaha (Revenue)',
		sptAmount: 121_000_000_000,
		glAmount: 124_271_000_000,
		variance: 3_271_000_000,
		variancePercent: 2.63,
		status: 'matched',
	},
	{
		code: '1771-1.2',
		description: 'Harga Pokok Penjualan',
		sptAmount: 78_000_000_000,
		glAmount: 77_000_000_000,
		variance: -1_000_000_000,
		variancePercent: -1.27,
		status: 'matched',
	},
	{
		code: '1771-1.3',
		description: 'Laba/Rugi Bruto',
		sptAmount: 47_000_000_000,
		glAmount: 48_871_000_000,
		variance: 1_871_000_000,
		variancePercent: 3.84,
		status: 'matched',
	},
	{
		code: '1771-1.4',
		description: 'Biaya Usaha Lainnya',
		sptAmount: 24_100_000_000,
		glAmount: 22_700_000_000,
		variance: -1_400_000_000,
		variancePercent: -5.80,
		status: 'warning',
	},
	{
		code: '1771-1.5',
		description: 'Laba/Rugi Usaha',
		sptAmount: 18_100_000_000,
		glAmount: 17_471_000_000,
		variance: -629_000_000,
		variancePercent: -3.47,
		status: 'critical',
	},
	{
		code: '1771-1.6',
		description: 'Penghasilan dari Luar Usaha',
		sptAmount: 856_000_000,
		glAmount: 656_000_000,
		variance: -200_000_000,
		variancePercent: 0,
		status: 'matched',
	},
	{
		code: '1771-1.7',
		description: 'Biaya dari Luar Usaha',
		sptAmount: 235_000_000,
		glAmount: 421_000_000,
		variance: -186_000_000,
		variancePercent: 79.15,
		status: 'critical',
	},
];

const attentionItems = [
	{
		code: '1771-1.4',
		description: 'Biaya Usaha Lainnya',
		variance: -768_000_000,
		variancePercent: 3.45,
		status: 'warning',
	},
	{
		code: '1771-1.5',
		description: 'Laba/Rugi Usaha',
		variance: -821_000_000,
		variancePercent: 3.48,
		status: 'critical',
	},
	{
		code: '1771-1.7',
		description: 'Biaya dari Luar Usaha',
		variance: -185_000_000,
		variancePercent: 24.71,
		status: 'critical',
	},
];

const summaryStats = [
	{ label: 'Total Positions', value: '7', color: 'bg-blue-100 dark:bg-blue-900' },
	{ label: 'Matched', value: '4', color: 'bg-green-100 dark:bg-green-900' },
	{ label: 'Warning', value: '1', color: 'bg-yellow-100 dark:bg-yellow-900' },
	{ label: 'Critical', value: '2', color: 'bg-red-100 dark:bg-red-900' },
	{ label: 'Total Variance', value: 'Rp 1.880.600.000', color: 'bg-purple-100 dark:bg-purple-900' },
];

const getStatusBadge = (status: string) => {
	switch (status) {
		case 'matched':
			return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Matched</Badge>;
		case 'warning':
			return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Warning</Badge>;
		case 'critical':
			return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Critical</Badge>;
		default:
			return null;
	}
};

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
};

export default function ComparisonTab() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');

	const filteredData = useMemo(() => {
		return comparisonData.filter((item) => {
			const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.code.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [searchQuery, statusFilter]);

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

					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="matched">Matched</SelectItem>
							<SelectItem value="warning">Warning</SelectItem>
							<SelectItem value="critical">Critical</SelectItem>
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

			{/* Table */}
			<Card>
				<CardContent className="overflow-x-auto pt-6">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[120px]">POSITION CODE</TableHead>
								<TableHead>DESCRIPTION</TableHead>
								<TableHead className="text-right">SPT AMOUNT</TableHead>
								<TableHead className="text-right">GL AMOUNT</TableHead>
								<TableHead className="text-right">VARIANCE</TableHead>
								<TableHead className="text-right">%</TableHead>
								<TableHead>STATUS</TableHead>
								<TableHead className="w-[50px]">ACTION</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredData.map((item) => (
								<TableRow key={item.code}>
									<TableCell className="font-medium">{item.code}</TableCell>
									<TableCell className="text-sm text-gray-700 dark:text-gray-300">
										{item.description}
									</TableCell>
									<TableCell className="text-right text-sm">
										{formatCurrency(item.sptAmount)}
									</TableCell>
									<TableCell className="text-right text-sm">
										{formatCurrency(item.glAmount)}
									</TableCell>
									<TableCell className={`text-right text-sm font-semibold ${
										item.variance >= 0 ? 'text-green-600' : 'text-red-600'
									}`}>
										{item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
									</TableCell>
									<TableCell className={`text-right text-sm ${
										item.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'
									}`}>
										{item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(2)}%
									</TableCell>
									<TableCell>{getStatusBadge(item.status)}</TableCell>
									<TableCell>
										<Button variant="ghost" size="icon">
											<Eye className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Attention Alert */}
			<Card className="border-orange-200 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/10">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-400">
						<AlertCircle className="h-5 w-5" />
						3 Position(s) Require Attention
					</CardTitle>
					<p className="mt-1 text-sm text-orange-600 dark:text-orange-300">
						Review variances and create adjustments or add justification notes
					</p>
				</CardHeader>
				<CardContent className="space-y-2">
					{attentionItems.map((item) => (
						<div
							key={item.code}
							className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-navy-800"
						>
							<div className="flex items-center gap-3">
								<Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
									{item.status === 'warning' ? 'Warning' : 'Critical'}
								</Badge>
								<div>
									<p className="font-semibold text-gray-900 dark:text-white">{item.code} {item.description}</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Possible mis-allocation expected
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold text-red-600">
									{item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
								</p>
								<p className="text-sm text-red-600">{item.variancePercent.toFixed(2)}%</p>
								<Button variant="link" className="mt-1 h-auto p-0 text-xs">
									Details
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
