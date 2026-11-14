
import Link from "next/link"

import {
  ArrowLeftIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  SquareUserRoundIcon,
} from "lucide-react"

import JobCard from "@/app/components/browse-jobs/JobCard"
import SaveJobButton from "@/app/components/browse-jobs/SaveJobButton"
import { getJobById, getJobs } from "@/lib/api/jobs"
import { jobCategories, jobTypes } from "@/lib/job-options"
import type { ManagedJob } from "@/types/jobs"

import JobApply from "./component/JobApply"

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/** "$60k" for 60000, "$500" for 500 (same style as JobCard). */
function formatSalary(value: string) {
  const amount = Number(value)
  if (!value || Number.isNaN(amount)) return "—"
  return amount >= 1000 ? `$${Math.round(amount / 1000)}k` : `$${amount}`
}

function formatDate(iso: string) {
  if (!iso) return "—"
  const [year, month, day] = iso.split("T")[0].split("-").map(Number)
  if (!year || !month || !day) return iso
  return `${monthNames[month - 1]} ${day}, ${year}`
}

/** Turns a stored multi-line string into list items. */
function toListItems(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

/** Section card with a title and bullet list (Responsibilities, Requirements…). */
function ListCard({
  title,
  items,
  emptyHint,
}: {
  title: string
  items: string[]
  emptyHint: string
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-white/40">{emptyHint}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-relaxed text-white/70"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

/** Label + value row for the overview card. */
function OverviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  )
}

const JobDetailsPage = async ({ params }: { params: Promise<{ Id: string }> }) => {
  const { Id } = await params

  const job = (await getJobById(Id)) as ManagedJob | null
 


  // API returned nothing/error — show a friendly empty state
  if (!job?._id) {
    return (
      <main className="grid min-h-screen place-items-center bg-neutral-950 px-4 text-white">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Job not found</h1>
          <p className="mt-2 text-sm text-white/50">
            This job may have been removed or the link is broken.
          </p>
          <Link
            href="/browse-jobs"
            className="mt-4 inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Back to Browse Jobs
          </Link>
        </div>
      </main>
    )
  }

  const typeLabel = jobTypes.find((type) => type.value === job.type)?.label ?? job.type
  const categoryLabel =
    jobCategories.find((category) => category.value === job.category)?.label ??
    job.category
  const statusLabel = job.status === "active" ? "Open" : job.status === "draft" ? "Draft" : "Closed"

  // Similar jobs: same category, excluding this one (guarded in case the list API fails)
  const similarResult = await getJobs().catch(() => [])
  const similarSource = Array.isArray(similarResult) ? (similarResult as ManagedJob[]) : []
  const similarJobs = similarSource
    .filter((item) => item._id !== job._id && item.category === job.category)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Browse Jobs
        </Link>

        {/* Header card */}
        <article className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-start gap-4">
            {/* Company logo placeholder — no company field exists on the job yet */}
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <SquareUserRoundIcon className="size-6 text-white/60" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <Building2Icon className="size-4" />
                  Company
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="size-4" />
                  {job.remote ? "Remote" : job.location || "Location not specified"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="size-4" />
                  Posted {formatDate(job.datePosted)}
                </span>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-300">
                  <DollarSignIcon className="size-3" />
                  {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} /{" "}
                  {job.currency}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                  <ClockIcon className="size-3" />
                  {typeLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                  <BriefcaseBusinessIcon className="size-3" />
                  {categoryLabel}
                </span>
                <span
                  className={`inline-flex rounded-md border px-2 py-0.5 text-xs ${
                    job.status === "active"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : job.status === "draft"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                        : "border-white/10 text-white/50"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <SaveJobButton jobId={job._id} />
              {/* TODO: apply flow — opens the apply modal / application form.
                  For now it sends guests to sign-in (apply requires login). */}
            
              <JobApply job={job}/>
            </div>
          </div>
        </article>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Description column */}
          <div className="flex flex-col gap-4">
            <ListCard
              title="Responsibilities"
              items={toListItems(job.responsibilities)}
              emptyHint="No responsibilities provided."
            />
            <ListCard
              title="Requirements"
              items={toListItems(job.requirements)}
              emptyHint="No requirements provided."
            />
            <ListCard
              title="Benefits"
              items={toListItems(job.benefits)}
              emptyHint="No benefits listed for this role."
            />
          </div>

          {/* Sidebar column */}
          <div className="flex flex-col gap-4">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-base font-semibold text-white">Job Overview</h2>
              <div className="mt-4 flex flex-col gap-2.5">
                <OverviewRow
                  label="Salary"
                  value={`${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)} ${job.currency}`}
                />
                <OverviewRow label="Job Type" value={typeLabel} />
                <OverviewRow label="Category" value={categoryLabel} />
                <OverviewRow
                  label="Location"
                  value={job.remote ? "Remote" : job.location || "—"}
                />
                <OverviewRow label="Deadline" value={formatDate(job.deadline)} />
                <OverviewRow label="Posted" value={formatDate(job.datePosted)} />
              </div>
            </article>

            {/* Company info card — company fields don't exist on the job yet */}
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-base font-semibold text-white">About Company</h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <SquareUserRoundIcon className="size-5 text-white/60" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">Company</p>
                  <p className="text-xs text-white/40">
                    Company profile details coming soon
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Similar jobs — same category, excluding this one */}
        {similarJobs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white">Similar Jobs</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarJobs.map((item) => (
                <JobCard key={item._id} job={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default JobDetailsPage
