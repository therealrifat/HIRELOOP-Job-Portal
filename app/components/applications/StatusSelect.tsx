"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateApplicationStatus } from "@/lib/actions/jobs"
import type { ApplicationStatus } from "@/types/applications"

import { applicationStatuses } from "./StatusBadge"

type Props = {
  applicationId: string
  /** Current status from the DB — the dropdown's initial value */
  status: ApplicationStatus
}

/** Status dropdown for the recruiter's applicant pipeline.
 *  On change it calls updateApplicationStatus (currently a stub — the DB
 *  write is implemented later); the local state keeps the UI responsive
 *  in the meantime. */
export default function StatusSelect({ applicationId, status }: Props) {
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(status)
  const [isSaving, setIsSaving] = useState(false)

  async function handleStatusChange(nextStatus: ApplicationStatus) {
    setCurrentStatus(nextStatus)
    
    setIsSaving(true)
    const resutl =await updateApplicationStatus(applicationId, {status: nextStatus})
    console.log(resutl)
    setIsSaving(false)
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => handleStatusChange(value as ApplicationStatus)}
    >
      <SelectTrigger
        size="sm"
        disabled={isSaving}
        aria-label="Change application status"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(applicationStatuses) as ApplicationStatus[]).map(
          (statusKey) => (
            <SelectItem key={statusKey} value={statusKey}>
              {applicationStatuses[statusKey].label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  )
}
