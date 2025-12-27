import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import ComparisonTab from "./components/ComparisonTab";
import CoaTab from "./components/CoaTab";

export default function Form1771IVPage() {
	return (
		<div className="flex flex-col gap-[30px]">
			<div className="space-y-8 rounded-2xl  p-6">
				<Tabs defaultValue="comparison" className="w-full">
					<TabsList className="w-full rounded-2xl bg-gray-200">
						<TabsTrigger
							value="comparison"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Comparison
						</TabsTrigger>
						<TabsTrigger
							value="coa"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							COA Mapping
						</TabsTrigger>
					</TabsList>

					<TabsContent value="comparison">
						<ComparisonTab />
					</TabsContent>

					<TabsContent value="coa">
						<CoaTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
