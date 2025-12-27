import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import DocumentTab from "./components/DocumentTab";

export default function Form1771IVPage() {
	return (
		<div className="flex flex-col gap-[30px]">
			<div className="space-y-8 rounded-2xl  p-6">
				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="w-full rounded-2xl bg-gray-200">
						<TabsTrigger
							value="overview"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Overview
						</TabsTrigger>
						<TabsTrigger
							value="document"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Document
						</TabsTrigger>
					</TabsList>

					<TabsContent value="overview">
						<OverviewTab />
					</TabsContent>

					<TabsContent value="document">
						<DocumentTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
