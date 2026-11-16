import type { ApplicationStatus } from "@/types/applications"

import { cn } from "cn"

/** Status → pill wording + colors (matches the Figma).
 *  Single source of truth for the pipeline: StatusBadge renders it as a pill,
 *  StatusSelect lists the same statuses/labels in the dropdown. */
export const applicationStatuses: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: {
    label: "Applied",
    className: "border-white/15 bg-white/10 text-white/70",
  },
  "under-review": {
    label: "Review",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-sky-600/60 bg-sky-600 text-white",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-600/60 bg-red-600 text-white",
  },
  offered: {
    label: "Offered",
    className: "border-emerald-600/60 bg-emerald-600 text-white",
  },
}

/** Colored status pill for an application's pipeline stage. */
export default function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  const meta = applicationStatuses[status]

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-0.5 text-xs font-medium",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
