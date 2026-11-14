import { jobCategories, jobTypes } from "@/lib/job-options"
import type { ManagedJob, SelectOption } from "@/types/jobs"

import FilterSidebar from "@/app/components/browse-jobs/FilterSidebar"
import JobCard from "@/app/components/browse-jobs/JobCard"
import JobSearchBar from "@/app/components/browse-jobs/JobSearchBar"
import Pagination from "@/app/components/browse-jobs/Pagination"
import SortSelect from "@/app/components/browse-jobs/SortSelect"
import { getJobs } from "@/lib/api/jobs"

const JOBS_PER_PAGE = 6

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/** Flattens Next.js' search params into a query string for the API. */
function toQueryString(params: Record<string, string | string[] | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) value.forEach((item) => search.append(key, item))
    else if (value !== undefined) search.set(key, value)
  }
  return search.toString()
}

/** How many stored jobs match each filter option value. */
function countJobsBy(jobs: ManagedJob[], field: "type" | "category", options: SelectOption[]) {
  return Object.fromEntries(
    options.map(({ value }) => [value, jobs.filter((job) => job[field] === value).length])
  )
}

const BrowseJobsPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams
  const query = toQueryString(params)
  const jobs: ManagedJob[] = await getJobs(query)

  const currentPage = Math.max(1, Number(params.page) || 1)
  const typeCounts = countJobsBy(jobs, "type", jobTypes)
  const categoryCounts = countJobsBy(jobs, "category", jobCategories)
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE))

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <JobSearchBar />

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          <FilterSidebar typeCounts={typeCounts} categoryCounts={categoryCounts} />

          <section>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-lg font-semibold text-white/60">
                Found <span className="text-white">{jobs.length}</span> Professional
                Jobs
              </h1>
              <SortSelect />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {jobs.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/50">
                  No jobs found. Try adjusting your search or filters.
                </p>
              ) : (
                jobs.map((job) => <JobCard key={job._id} job={job} />)
              )}
            </div>

            {jobs.length > 0 && (
              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default BrowseJobsPage
