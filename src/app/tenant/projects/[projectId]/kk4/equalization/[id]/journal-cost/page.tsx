import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import SummaryCard from "./components/SummaryCard";
import OverviewTab from "./components/OverviewTab";
import ExpensesTab from "./components/ExpensesTab";
import WittholdingTaxTab from "./components/WittholdingTaxTab";

export default function Form1771IVPage() {
	return (
		<div className="flex flex-col gap-[30px]">
			<SummaryCard />

			<div className="space-y-8 rounded-2xl p-6">
				<Tabs defaultValue="Overview" className="w-full">
					<TabsList className="w-full rounded-2xl bg-gray-200">
						<TabsTrigger
							value="Overview"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Overview by pasal
						</TabsTrigger>
						<TabsTrigger
							value="Expenses"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Journal Expenses
						</TabsTrigger>
						<TabsTrigger
							value="WittholdingTax"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Bukti Potong
						</TabsTrigger>
					</TabsList>

					<TabsContent value="Overview">
						<OverviewTab />
					</TabsContent>

					<TabsContent value="Expenses">
						<ExpensesTab />
					</TabsContent>

					<TabsContent value="WittholdingTax">
						<WittholdingTaxTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
