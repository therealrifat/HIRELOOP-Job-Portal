import {
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  SquareUserRoundIcon,
} from "lucide-react"

import { cn } from "cn"
import { jobTypes } from "@/lib/job-options"
import type { JobStatus, ManagedJob } from "@/types/jobs"

import SaveJobButton from "./SaveJobButton"

/** Small pill with an optional leading icon, styled per Figma. */
function Badge({
  icon: Icon,
  children,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70",
        className
      )}
    >
      {Icon && <Icon className="size-3" />}
      {children}
    </span>
  )
}

/** "$14k" for 14000, "$9.5k" for 9500, "$500" for 500. */
function formatSalary(value: string) {
  const amount = Number(value)
  if (!value || Number.isNaN(amount)) return null
  return amount >= 1000 ? `$${Math.round(amount / 1000)}k` : `$${amount}`
}

/** Maps a stored job status to its badge wording + colors. */
const statusBadges: Record<JobStatus, { label: string; className: string }> = {
  active: {
    label: "Open",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  draft: {
    label: "Draft",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  closed: {
    label: "Closed",
    className: "text-white/50",
  },
}

/** One job card in the browse-jobs list. */
export default function JobCard({ job }: { job: ManagedJob }) {
  const salary = [formatSalary(job.salaryMin), formatSalary(job.salaryMax)]
    .filter(Boolean)
    .join(" - ")
  const typeLabel = jobTypes.find((type) => type.value === job.type)?.label ?? job.type
  const status = statusBadges[job.status]

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-4">
        {/* Company logo placeholder — no company field exists on JobFormData yet */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <SquareUserRoundIcon className="size-5 text-white/60" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">{job.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
            <MapPinIcon className="size-3.5" />
            {job.remote ? "Remote" : job.location || "Location not specified"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {salary && <Badge icon={DollarSignIcon}>{salary}</Badge>}
            <Badge icon={ClockIcon}>{typeLabel}</Badge>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
        </div>

        <SaveJobButton jobId={job._id} />
      </div>
    </article>
  )
}
