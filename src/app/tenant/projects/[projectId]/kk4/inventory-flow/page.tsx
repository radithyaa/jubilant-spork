import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import PphTab from "./components/PphTab";
import TrendTab from "./components/TrendTab";
import PpnTab from "./components/PpnTab";

export default function CashFlowPage() {
	return (
		<div className="flex flex-col gap-[30px]">
			<div className="space-y-8 rounded-2xl p-6">
				<Tabs defaultValue="Overview" className="w-full">
					<TabsList className="w-full rounded-2xl bg-gray-200">
						<TabsTrigger
							value="Overview"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="Pph"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
						KK 4.5.1: Barang vs PPh
						</TabsTrigger>
						<TabsTrigger
							value="Ppn"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
						KK 4.5.2: Barang vs PPN
						</TabsTrigger>
						<TabsTrigger
							value="Trend"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
						Trend Analysis
						</TabsTrigger>
					</TabsList>

					<TabsContent value="Overview">
						<OverviewTab />
					</TabsContent>

					<TabsContent value="Pph">
						<PphTab />
					</TabsContent>

					<TabsContent value="Ppn">
						<PpnTab />
					</TabsContent>

					<TabsContent value="Trend">
						<TrendTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
