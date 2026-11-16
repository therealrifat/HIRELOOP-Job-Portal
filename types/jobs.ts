// Job-related types shared between the Post-a-Job form, the API layer
// (lib/actions/jobs.ts, lib/api/jobs.ts) and the dashboards.
// Keep this file the single source of truth — components re-export these
// names for convenience but must not re-declare them.

/** Lifecycle status of a job post */
export type JobStatus = "active" | "closed" | "draft"

/** One <SelectItem> entry for a base-ui Select */
export type SelectOption = {
  value: string
  label: string
}

/** A job as collected by the Post-a-Job form and persisted by the API.
 *  The form pre-fills status/applicantsCount/datePosted with defaults;
 *  the payload marks the job "active" and stamps datePosted on submit. */
export type JobFormData = {
  title: string
  category: string
  type: string
  salaryMin: string
  salaryMax: string
  currency: string
  location: string
  remote: boolean
  deadline: string
  responsibilities: string
  requirements: string
  benefits: string
  status: JobStatus
  applicantsCount: number
  datePosted: string // ISO date
  recruiterId: string
}

/** A stored job — the persisted shape plus the Mongo document id */
export type ManagedJob = JobFormData & {
  _id: string
}
