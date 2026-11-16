import Link from "next/link"

import {
  ExternalLinkIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react"

import StatusSelect from "@/app/components/applications/StatusSelect"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatRelative } from "@/lib/format"
import type { JobApplication } from "@/types/applications"

/** The recruiter's applicant pipeline for one job.
 *  Applicant / Applied / Resume / Status / Details — status is a live
 *  dropdown (StatusSelect) whose save is stubbed until the DB update lands. */
export default function ApplicantsTable({
  applications,
}: {
  applications: JobApplication[]
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/50">Applicant</TableHead>
            <TableHead className="hidden text-white/50 sm:table-cell">
              Applied
            </TableHead>
            <TableHead className="hidden text-white/50 md:table-cell">
              Resume
            </TableHead>
            <TableHead className="text-white/50">Status</TableHead>
            <TableHead className="text-right text-white/50">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => {
            // Without a denormalized applicantName (older applications), the
            // email is the best identifier we have
            const displayName = app.applicantName ?? app.email

            return (
              <TableRow key={app._id} className="border-white/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/60">
                      <UsersIcon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{displayName}</div>
                      {app.applicantName ? (
                        <div className="mt-0.5 truncate text-xs text-white/40">
                          {app.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div>{formatRelative(app.dateApplied)}</div>
                  <div className="mt-0.5 text-xs text-white/40">
                    {formatDate(app.dateApplied)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {app.resumeUrl ? (
                    <Link
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                      <FileTextIcon className="size-3.5" />
                      Resume
                    </Link>
                  ) : (
                    <span className="text-sm text-white/40">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusSelect applicationId={app._id} status={app.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/browse-jobs/${app.jobId}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    Job
                    <ExternalLinkIcon className="mb-0.5 ml-1 inline size-3" />
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}

          {applications.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center text-sm text-white/40"
              >
                No applications yet for this job.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
