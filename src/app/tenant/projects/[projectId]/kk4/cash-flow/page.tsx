import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import SalesTab from "./components/SalesTab";
import AgingTab from "./components/AgingTab";
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
							value="Sales"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
						KK 4.4.1: Arus Uang vs Penjualan
						</TabsTrigger>
						<TabsTrigger
							value="Ppn"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
						KK 4.4.2: Arus Uang vs PPN
						</TabsTrigger>
						<TabsTrigger
							value="Aging"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
						Aging
						</TabsTrigger>
					</TabsList>

					<TabsContent value="Overview">
						<OverviewTab />
					</TabsContent>

					<TabsContent value="Sales">
						<SalesTab />
					</TabsContent>

					<TabsContent value="Ppn">
						<PpnTab />
					</TabsContent>

					<TabsContent value="Aging">
						<AgingTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
