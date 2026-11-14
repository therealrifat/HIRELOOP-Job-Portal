// Job-application types shared across the apply flow, the seeker dashboard
// ("My Applications") and the recruiter's applicant pipeline.
//
// Pattern matches types/jobs.ts: `ApplicationData` is the payload the seeker
// submits when applying; `JobApplication` is the stored document the APIs return.

/** The applicant pipeline a job moves through (set by the recruiter,
 *  see /dashboard/jobs/:jobId/applicants). Changing a status emails the seeker. */
export type ApplicationStatus =
  | "applied"
  | "under-review"
  | "shortlisted"
  | "rejected"
  | "offered"

/** What the seeker submits from the Apply button on a job details page
 *  (JobApply.tsx → applytoAJob in lib/actions/jobs.ts). Kept lean: the
 *  references are all the DB needs — everything else is joined at read time. */
export type ApplicationData = {
  /** Reference to the job post being applied to (jobs._id) */
  jobId: string
  /** Reference to the applicant — the better-auth user id (users._id) */
  userId: string
  /** Applicant email snapshot (denormalized for recruiter views + status emails) */
  email: string
  /** Optional cover letter / note — the apply modal can add this later */
  coverLetter?: string
  /** Resume link snapshot from the seeker's profile at apply time
   *  (set in Seeker Settings → resume upload) */
  resumeUrl?: string
}

/** The stored application document.
 *  Display fields (jobTitle etc.) are denormalized where they're cheap and
 *  available at apply time; the rest is joined from the job/user by the API. */
export type JobApplication = ApplicationData & {
  _id: string
  status: ApplicationStatus // "applied" on create; recruiter changes it afterwards
  /** Denormalized job snapshot */
  jobTitle: string
  jobLocation?: string
  jobType?: string
  /** Company name if the job record carried it — optional for now since
   *  jobs don't have company fields yet */
  companyName?: string
  dateApplied: string // ISO date — stamped by the server, not the client
  /** Last time the status changed — used for "Updated X days ago" */
  lastUpdated: string // ISO date
}

/** Payload for POST /applications (applytoAJob in lib/actions/jobs.ts).
 *  The client sends the references + snapshot; the server stamps _id,
 *  status ("applied"), dateApplied and lastUpdated itself — never trust
 *  the client with those. */
export type ApplyToJobPayload = Omit<
  JobApplication,
  "_id" | "status" | "dateApplied" | "lastUpdated"
>
