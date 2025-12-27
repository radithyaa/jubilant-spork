import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CircleCheck, File, FileText } from "lucide-react";
import OutputTab from "./components/OutputTab";
import InputTab from "./components/InputTab";
import UnmatchedTab from "./components/UnmatchedTab";

export default function Form1771IVPage() {
	return (
		<div className="flex flex-col gap-[30px]">
			<div className="space-y-8 rounded-2xl  p-6">
				<Tabs defaultValue="Output" className="w-full">
					<TabsList className="w-full rounded-2xl bg-gray-200">
						<TabsTrigger
							value="Output"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Output
						</TabsTrigger>
						<TabsTrigger
							value="Input"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Input Mapping
						</TabsTrigger>
						<TabsTrigger
							value="Unmatched"
							className="flex-1 gap-2 items-center rounded-2xl"
						>
							Unmatched
						</TabsTrigger>
					</TabsList>

					<TabsContent value="Output">
						<OutputTab />
					</TabsContent>

					<TabsContent value="Input">
						<InputTab />
					</TabsContent>

					<TabsContent value="Unmatched">
						<UnmatchedTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
