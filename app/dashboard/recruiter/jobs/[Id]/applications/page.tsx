import Link from "next/link"

import { ArrowLeftIcon, BriefcaseBusinessIcon, MapPinIcon } from "lucide-react"

import ApplicantsTable from "@/app/components/applications/ApplicantsTable"
import { getJobById, getMyApplications } from "@/lib/api/jobs"
import { jobTypes } from "@/lib/job-options"
import type { ManagedJob } from "@/types/jobs"

type Props = { params: Promise<{ Id: string }> }

/** Recruiter's View Applicants — all applications for one job post
 *  (linked from the eye icon on each Manage Jobs row). */
export default async function JobApplicationsPage({ params }: Props) {
  const { Id: jobId } = await params

  // Job context (header) and the applicant list can load in parallel
  const [job, applications] = await Promise.all([
    getJobById(jobId) as Promise<ManagedJob | null>,
    // getMyApplications is the generic GET /applications client —
    // filtered by job for the recruiter's pipeline
    getMyApplications(`jobId=${jobId}`),
  ])

  if (!job?._id) {
    return (
      <div className="dark grid min-h-svh place-items-center bg-neutral-950 p-6 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Job not found</h1>
          <p className="mt-1.5 text-sm text-white/50">
            This job post doesn&apos;t exist (or was deleted).
          </p>
          <Link
            href="/dashboard/recruiter/jobs"
            className="mt-5 inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            Back to Manage Jobs
          </Link>
        </div>
      </div>
    )
  }

  const typeLabel =
    jobTypes.find((type) => type.value === job.type)?.label ?? job.type
  const applicantCount = applications.length

  return (
    <div className="dark min-h-svh bg-neutral-950 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Manage Jobs
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusinessIcon className="size-3.5" />
                {typeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="size-3.5" />
                {job.remote ? "Remote" : job.location}
              </span>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
          </span>
        </div>

        {/* Pipeline table */}
        <div className="mt-6">
          <ApplicantsTable applications={applications} />
        </div>
      </div>
    </div>
  )
}
