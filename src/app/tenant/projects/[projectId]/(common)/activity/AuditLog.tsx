import { useEffect, useState } from "react";
import { auditLogService, AuditLog as IAuditLog } from "@/services/audit-log.service";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface AuditLogProps {
  projectId: string;
}

export function AuditLog({ projectId }: AuditLogProps) {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const response = await auditLogService.getLogs(projectId);
        if (response.success && response.data) {
          setLogs(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [projectId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading activity...</div>;
  }

  if (logs.length === 0) {
    return <div className="text-sm text-gray-500">No activity found.</div>;
  }

  return (
    <div className="flex items-start gap-[5px] self-stretch">
      {/* Timeline */}
      <div className="flex w-[31px] flex-col items-center">
        {logs.map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="h-[15px] w-[15px] rounded-full border border-[#404040]" />
            {index < logs.length - 1 && (
              <div className="h-[57px] w-px bg-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col items-start justify-center gap-2.5">
        {logs.map((item, index) => {
           // Get initials from user name
           const userName = item.users?.name || "Unknown User";
           const initials = userName
             .split(" ")
             .map((n) => n[0])
             .join("")
             .toUpperCase()
             .slice(0, 2);
            
           // Format time
           const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id });

           return (
            <div
              key={item.id || index}
              className="flex w-[227px] flex-col items-end justify-center gap-2.5"
            >
              <span className="self-stretch text-xs leading-4 tracking-[0.4px] text-primary">
                {timeAgo}
              </span>
              <div className="flex flex-col items-end self-stretch">
                <div className="flex items-center gap-[5px] self-stretch">
                  <div className="flex h-5 w-5 flex-col items-start justify-center gap-2.5 rounded-[50px] bg-primary">
                    <span className="self-stretch text-center font-dm text-xs leading-[30px] tracking-[-0.24px] text-white">
                      {initials}
                    </span>
                  </div>
                  <div className="flex w-[183px] items-center gap-2">
                    <span className="text-sm leading-5 tracking-[0.25px] text-primary font-semibold">
                      {userName}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start self-stretch pl-[25px]">
                    <span className="text-xs font-medium leading-4 tracking-[0.4px] text-primary">
                      {item.action}
                    </span>
                    <span className="w-[202px] text-xs leading-4 tracking-[0.4px] text-primary truncate" title={item.entity_name || item.entity_id}>
                      {item.entity_name || item.entity_id}
                    </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
