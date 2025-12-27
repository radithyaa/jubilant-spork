'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingDown, Clock } from 'lucide-react';

interface Module {
	id: string;
	code: string;
	status: 'new' | 'in-progress' | 'completed';
	title: string;
	description: string;
	lastUpdated: string;
	variance: number;
	features: string[];
}

const modulesData: Module[] = [
	{
		id: '1',
		code: 'KK 4.2.1',
		status: 'in-progress',
		title: 'Equalisasi SPT PPh Badan vs Laba Rugi',
		description: 'Membandingkan penghasilan SPT 1771 PPh Badan dengan Laba Rugi dari KK2',
		lastUpdated: 'Last on 2025-10-14 10:15',
		variance: 125000000,
		features: [
			'Automatic tax 1771 + Laba Rugi (KK3 mapping)',
			'Perbandingan data + reclass varians calculation',
			'Auto-suggest untuk balance head',
			'Staging adjustments & workflow approval',
		],
	},
	{
		id: '2',
		code: 'KK 4.2.2',
		status: 'in-progress',
		title: 'Equalisasi SPT PPh vs Perjalanan & Pernikahan',
		description: 'Membandingkan perjalanan service SPT PPh (1771) dengan beban garap dan pertukaran',
		lastUpdated: 'Last on 2025-10-14 10:15',
		variance: 45000000,
		features: [
			'March budget push dengan revised whitelist/blacklist',
			'Fuzzy matching: SPPT name labels match by whitelist',
			'Auto-suggest untuk balance head',
			'Staging adjustments & workflow approval',
		],
	},
	{
		id: '3',
		code: 'KK 4.2.3',
		status: 'completed',
		title: 'Equalisasi SPT PPPh vs Jurnal Biaya',
		description: 'Menyesuaikan konsistensi PPh pemberian (1735/2025) dengan jurnal biaya',
		lastUpdated: 'Last on 2025-10-14 10:15',
		variance: 8500000,
		features: [
			'Mapping PPh excel + skate transporation imports',
			'Direct mismatch to-do listing in SPPT',
			'Auto-suggest untuk balance head',
			'Validation per-journal & locked perio adjustment',
		],
	},
];

const summaryStats = [
	{ label: 'Sub Modules', value: '3', icon: null, color: 'bg-blue-100 dark:bg-blue-900' },
	{ label: 'Total Variances', value: '12', icon: AlertCircle, color: 'bg-yellow-100 dark:bg-yellow-900' },
	{ label: 'Needs Attention', value: '2', icon: TrendingDown, color: 'bg-orange-100 dark:bg-orange-900' },
	{ label: 'Last Analysis', value: 'Today, 10:15', icon: Clock, color: 'bg-purple-100 dark:bg-purple-900' },
];

export default function EqualizationPage() {
	const [activeTab, setActiveTab] = useState('overview');

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-navy-700 dark:text-white">
					KK 4.2 - Equalisasi SPT vs Laporan Keuangan
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Dengan detail per-modul equalisasi antara SPT 2025 dengan Laporan Keuangan (PL) dari KK2
				</p>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{summaryStats.map((stat, idx) => {
					const Icon = stat.icon;
					return (
						<Card key={idx} className={`${stat.color}`}>
							<CardContent className="flex items-center justify-between pt-6">
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
									<p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
								</div>
								{Icon && <Icon className="h-6 w-6 text-gray-500" />}
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="modules">Modules</TabsTrigger>
					<TabsTrigger value="details">Details</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="mt-6 space-y-4">
					{modulesData.map((module) => (
						<Card key={module.id} className="overflow-hidden">
							<CardHeader className="pb-4">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-2">
											<Badge variant={module.status === 'completed' ? 'default' : 'secondary'}>
												{module.code}
											</Badge>
											<Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
												{module.status === 'completed' ? 'Completed' : 'In Progress'}
											</Badge>
										</div>
										<CardTitle className="text-lg">{module.title}</CardTitle>
										<CardDescription className="mt-1">{module.description}</CardDescription>
									</div>
									<div className="text-right">
										<p className="text-xs text-gray-500 dark:text-gray-400">{module.lastUpdated}</p>
										<p className="mt-2 text-lg font-bold text-brand-500">
											Rp {module.variance.toLocaleString('id-ID')}
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Key Features</h4>
									<ul className="space-y-1">
										{module.features.map((feature, idx) => (
											<li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
												<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
												{feature}
											</li>
										))}
									</ul>
								</div>
								<Button className="w-full bg-brand-500 hover:bg-brand-600">Open Module</Button>
							</CardContent>
						</Card>
					))}
				</TabsContent>

				{/* Modules Tab */}
				<TabsContent value="modules" className="mt-6">
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-gray-500 dark:text-gray-400">
								Modules detailed view coming soon
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Details Tab */}
				<TabsContent value="details" className="mt-6">
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-gray-500 dark:text-gray-400">
								Details view coming soon
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
