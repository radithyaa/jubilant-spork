"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditLog } from "./AuditLog";
import { Discussion } from "./Discussion";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function ActivityPage() {
	const params = useParams();
	const projectId = params.projectId as string;

	return (
		<Card className="flex flex-col gap-5 p-4">
			{/* Page Header */}
			<div className="flex flex-col items-start">
				<h1 className="font-dm text-2xl font-bold leading-8 tracking-[-0.48px] text-primary">
					Activity Feed
				</h1>
				<p className=" text-xs leading-4 tracking-[0.4px] text-primary">
					Tinjau riwayat aktivitas dan diskusi di dalam project
				</p>
			</div>

			{/* Activity Tabs */}
			<Tabs defaultValue="audit-log" className="w-full">
				<TabsList className="grid h-auto w-full grid-cols-2 gap-5 bg-transparent p-0">
					<TabsTrigger
						value="audit-log"
						className="rounded-[5px] border-0 bg-transparent px-3 py-2 font-public-sans text-sm font-semibold leading-[22px] text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
					>
						Audit Log
					</TabsTrigger>
					<TabsTrigger
						value="discussion"
						className="rounded-[5px] border-0 bg-transparent px-3 py-2 font-public-sans text-sm font-semibold leading-[22px] text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
					>
						Discussion
					</TabsTrigger>
				</TabsList>

				<TabsContent value="audit-log" className="mt-6">
					<AuditLog projectId={projectId} />
				</TabsContent>

				<TabsContent value="discussion" className="mt-6">
					<Discussion />
				</TabsContent>
			</Tabs>
		</Card>
	);
}
