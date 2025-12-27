import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import StatsCard from "./components/StatsCard";
import OverviewTab from "./components/OverviewTab";
import PeriodTab from "./components/PeriodTab";
import PphTab from "./components/PphTab";

export default function Form1771IVPage() {
	return (
		<div className="flex flex-col gap-[30px]">
			<StatsCard />

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
							value="Period"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							KK 4.3.1: PPh Badan vs PPN
						</TabsTrigger>
						<TabsTrigger
							value="Pph"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							KK 4.3.2: PPh Badan vs P2PPh
						</TabsTrigger>
					</TabsList>

					<TabsContent value="Overview">
						<OverviewTab />
					</TabsContent>

					<TabsContent value="Period">
						<PeriodTab />
					</TabsContent>

					<TabsContent value="Pph">
						<PphTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
