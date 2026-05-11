import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  // Agent statuses
  ok: {
    label: "Healthy",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  failing: {
    label: "Failing",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  offline: {
    label: "Offline",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  // Company statuses
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  prospect: {
    label: "Prospect",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  // Client statuses
  lead: {
    label: "Lead",
    className: "bg-violet-100 text-violet-800 border-violet-200",
  },
  // Project statuses
  discovery: {
    label: "Discovery",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  paused: {
    label: "Paused",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  // Audit statuses
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  expired: {
    label: "Expired",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  // Impact levels
  high: {
    label: "High",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  low: {
    label: "Low",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
} as const;

type StatusType = keyof typeof statusConfig;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
