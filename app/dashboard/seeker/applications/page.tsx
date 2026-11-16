import Link from "next/link"

import {
  BriefcaseBusinessIcon,
  CloudIcon,
  CodeIcon,
  CpuIcon,
  DatabaseIcon,
  DownloadIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react"

import Pagination from "@/app/components/browse-jobs/Pagination"
import StatusBadge from "@/app/components/applications/StatusBadge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatRelative } from "@/lib/format"
import { jobTypes } from "@/lib/job-options"
import type { JobApplication } from "@/types/applications"
import { getMyApplications } from "@/lib/api/jobs"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"



const dummyApplications: JobApplication[] = [
  {
    _id: "app_01",
    jobId: "job_01",
    userId: "user_me",
    email: "me@example.com",
    status: "applied",
    jobTitle: "Senior Frontend Engineer",
    companyName: "Stark Industries",
    jobLocation: "Remote",
    jobType: "full-time",
    dateApplied: "2026-11-14T09:00:00.000Z",
    lastUpdated: "2026-11-14T09:00:00.000Z",
  },
  {
    _id: "app_02",
    jobId: "job_02",
    userId: "user_me",
    email: "me@example.com",
    status: "under-review",
    jobTitle: "Product Designer",
    companyName: "Cyberdyne Systems",
    jobLocation: "Hybrid",
    jobType: "contract",
    dateApplied: "2026-11-13T11:00:00.000Z",
    lastUpdated: "2026-11-13T11:00:00.000Z",
  },
  {
    _id: "app_03",
    jobId: "job_03",
    userId: "user_me",
    email: "me@example.com",
    status: "shortlisted",
    jobTitle: "Lead Data Scientist",
    companyName: "Wayne Enterprises",
    jobLocation: "On-site",
    jobType: "full-time",
    dateApplied: "2026-11-10T11:00:00.000Z",
    lastUpdated: "2026-11-12T11:00:00.000Z",
  },
  {
    _id: "app_04",
    jobId: "job_04",
    userId: "user_me",
    email: "me@example.com",
    status: "rejected",
    jobTitle: "Cloud Architect",
    companyName: "Oscorp Tech",
    jobLocation: "Remote",
    jobType: "full-time",
    dateApplied: "2026-11-07T11:00:00.000Z",
    lastUpdated: "2026-11-09T11:00:00.000Z",
  },
  {
    _id: "app_05",
    jobId: "job_05",
    userId: "user_me",
    email: "me@example.com",
    status: "offered",
    jobTitle: "AI Research Engineer",
    companyName: "Hocil Corp",
    jobLocation: "Hybrid",
    jobType: "full-time",
    dateApplied: "2026-10-31T11:00:00.000Z",
    lastUpdated: "2026-11-05T11:00:00.000Z",
  },
]




// Decorative icon tile per row — pure UI, not part of the application record
const rowDecor = [
  { icon: CodeIcon, className: "bg-indigo-500/15 text-indigo-300" },
  { icon: UserIcon, className: "bg-white/10 text-white/60" },
  { icon: DatabaseIcon, className: "bg-white/5 text-white/50" },
  { icon: CloudIcon, className: "bg-red-500/15 text-red-300" },
  { icon: CpuIcon, className: "bg-emerald-500/15 text-emerald-300" },
]

const APPLICATIONS_PER_PAGE = 6




const MyApplication = async() => {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})

  // TODO: replace with a real fetch — e.g. getMyApplications() filtered by session user
  // const applications = dummyApplications
  const applications = await getMyApplications(`applicantId=${session?.user.id}`)

  const totalApplied = applications.length
  const shortlisted = applications.filter((app) => app.status === "shortlisted").length
  // "Interviews" = applications that reached the interview stage (shortlisted)
  const interviews = shortlisted
  const successRate = totalApplied
    ? Math.round((applications.filter((app) => app.status === "offered").length / totalApplied) * 100)
    : 0

  const totalPages = Math.max(1, Math.ceil(totalApplied / APPLICATIONS_PER_PAGE))
  const visibleApplications = applications.slice(0, APPLICATIONS_PER_PAGE)

  const statCards = [
    { label: "Total Applied", value: String(totalApplied), className: "text-white" },
    { label: "Shortlisted", value: String(shortlisted), className: "text-white" },
    { label: "Interviews", value: String(interviews), className: "text-amber-400" },
    { label: "Success Rate", value: `${successRate}%`, className: "text-emerald-400" },
  ]

  return (
    <div className="dark min-h-svh bg-neutral-950 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="mt-1 text-sm text-white/50">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* TODO: archived filter — applications have no "archived" status yet */}
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                aria-current="true"
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors"
              >
                Active
              </button>
              <button
                type="button"
                className="rounded-lg px-4 py-1.5 text-sm text-white/50 transition-colors hover:text-white"
              >
                Archived
              </button>
            </div>

            {/* TODO: wire PDF export once a PDF lib is added */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-white/90"
            >
              <DownloadIcon className="size-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className={`mt-1.5 text-2xl font-bold ${stat.className}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/50">Job Title</TableHead>
                  <TableHead className="hidden text-white/50 sm:table-cell">
                    Company
                  </TableHead>
                  <TableHead className="text-white/50">Applied</TableHead>
                  <TableHead className="text-white/50">Status</TableHead>
                  <TableHead className="text-right text-white/50">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleApplications.map((app, index) => {
                  const decor = rowDecor[index % rowDecor.length]
                  const DecorIcon = decor.icon
                  const typeLabel =
                    jobTypes.find((type) => type.value === app.jobType)?.label ??
                    app.jobType
                  const meta = [typeLabel, app.jobLocation].filter(Boolean).join(" • ")

                  return (
                    <TableRow key={app._id} className="border-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${decor.className}`}
                          >
                            <DecorIcon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{app.jobTitle}</div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/40">
                              <BriefcaseBusinessIcon className="size-3" />
                              {meta}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {app.companyName ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div>{formatRelative(app.dateApplied)}</div>
                        <div className="mt-0.5 hidden items-center gap-1.5 text-xs text-white/40 sm:flex">
                          <MapPinIcon className="size-3" />
                          {app.jobLocation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/browse-jobs/${app.jobId}`}
                          className="text-sm text-white/70 transition-colors hover:text-white"
                        >
                          Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}

                {visibleApplications.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-sm text-white/40"
                    >
                      No applications yet — browse jobs and apply to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-4">
            <p className="text-sm text-white/50">
              Showing 1-{visibleApplications.length} of {totalApplied} applications
            </p>
            <Pagination currentPage={1} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyApplication
