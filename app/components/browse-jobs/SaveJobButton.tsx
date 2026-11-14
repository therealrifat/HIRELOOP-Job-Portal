"use client"

import { BookmarkIcon } from "lucide-react"

/** Bookmark toggle on a job card. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `jobId` is used once the save API is implemented
export default function SaveJobButton({ jobId }: { jobId: string }) {
  // TODO: save/unsave the job — intentionally left unimplemented for now.
  function handleClick() {}

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Save job"
      className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
    >
      <BookmarkIcon className="size-4" />
    </button>
  )
}
