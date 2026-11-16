

import Link from "next/link"


import {
  EyeIcon,
  FilePenIcon,
  PencilIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"

import type { ManagedJob } from "@/types/jobs"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getJobs } from "@/lib/api/jobs"

import DeleteJobDialog from "./../../../components/deleteJobDialog"
import { getSession } from "@/lib/core/servet"

// Backward-compatible re-export — deleteJobDialog used to import this from here;
// new code should import from "@/types/jobs"
export type { ManagedJob } from "@/types/jobs"



const planLimit = 10


function formatSalary(job: ManagedJob) {
  return `${job.currency} ${Number(job.salaryMin).toLocaleString("en-US")}–${Number(
    job.salaryMax
  ).toLocaleString("en-US")}`
}

const statusStyles: Record<ManagedJob["status"], string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  closed: "border-white/15 bg-white/5 text-white/50",
  draft: "border-amber-500/30 bg-amber-500/10 text-amber-300",
}

export default async function ManageJobsPage() {
  const session = await getSession()
console.log(session?.user.id)
  const jobs:ManagedJob[] = await getJobs(`recruiterId=${session?.user?.id}`)
  // const [jobs, setJobs] = useState<ManagedJob[]>(jobss)
  const activeCount = jobs.filter((job: ManagedJob) => job.status === "active").length



  return (
    <div className="dark min-h-svh bg-neutral-950 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Manage Job Posts</h1>
            <p className="mt-1 text-sm text-white/50">
              {activeCount} / {planLimit} active job posts used on your plan
            </p>
            {/* Plan usage bar */}
            <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                style={{ width: `${Math.min((activeCount / planLimit) * 100, 100)}%` }}
              />
            </div>
          </div>

          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600"
          >
            <PlusIcon />
            Post New Job
          </Button>
        </div>

        {/* Table — scrolls horizontally on small screens; extra columns hide */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/50">Job Title</TableHead>
                <TableHead className="text-white/50">Status</TableHead>
                <TableHead className="hidden text-white/50 md:table-cell">
                  Salary
                </TableHead>
                <TableHead className="hidden text-white/50 md:table-cell">
                  Deadline
                </TableHead>
                <TableHead className="text-white/50">Applicants</TableHead>
                <TableHead className="hidden text-white/50 lg:table-cell">
                  Date Posted
                </TableHead>
                <TableHead className="text-right text-white/50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id} className="border-white/10">
                  <TableCell>
                    <div className="font-medium">{job.title}</div>
                    <div className="mt-0.5 text-xs text-white/40">
                      {job.remote
                        ? "Remote"
                        : job.location}{" "}
                      · {job.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatSalary(job)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {job.deadline}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5">
                      <UsersIcon className="size-4 text-white/40" />
                      {job.applicantsCount}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {job.datePosted}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={<Link href={`/dashboard/recruiter/jobs/${job._id}/edit`} />}
                        aria-label={`Edit ${job.title}`}
                        title="Edit"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                          <Link
                            href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                          />
                        }
                        aria-label={`View applicants for ${job.title}`}
                        title="View Applicants"
                      >
                        <EyeIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        // onClick={() => toggleStatus(job.id)}
                        aria-label={
                          job.status === "closed"
                            ? `Reopen ${job.title}`
                            : `Close ${job.title}`
                        }
                        title={job.status === "closed" ? "Reopen" : "Close"}
                      >
                        <FilePenIcon />
                      </Button>
                    
                      <DeleteJobDialog job={job}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {jobs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-sm text-white/40"
                  >
                    No job posts yet — click Post New Job to create your first one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
