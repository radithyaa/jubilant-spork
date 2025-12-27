import RBAC from "@/components/rbac/RBAC";
import { DirectorDashboard } from "./components/DirectorDashboard";

export default function DashboardPage() {
	return (
		<RBAC requiredRole="direktur">
			<DirectorDashboard />
		</RBAC>
	);
}
