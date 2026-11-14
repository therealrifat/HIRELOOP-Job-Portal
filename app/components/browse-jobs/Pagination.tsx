"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "cn"

type PaginationProps = {
  currentPage: number
  totalPages: number
}

/** "1 2 3 … 42" page list; a 3-page window around the current page plus the last page. */
function getPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const start = Math.min(Math.max(1, current - 1), total - 2)
  const window = [start, start + 1, start + 2].filter((page) => page <= total)

  const list: (number | "ellipsis")[] = [...window]
  const last = window[window.length - 1]
  if (last < total - 1) list.push("ellipsis")
  if (last < total) list.push(total)
  return list
}

const pageButtonClassName =
  "flex size-8 items-center justify-center rounded-lg border border-white/10 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"

/** Bottom pagination for the browse-jobs list. */
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  // TODO: navigate to the selected page via the URL query — intentionally left
  // unimplemented for now.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `page` is used once URL sync is implemented
  function goToPage(page: number) {}

  return (
    <nav aria-label="Job pages" className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(pageButtonClassName, "disabled:opacity-40")}
      >
        <ChevronLeftIcon className="size-4" />
      </button>

      {getPageList(currentPage, totalPages).map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-white/40">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => goToPage(page)}
            className={cn(
              pageButtonClassName,
              page === currentPage &&
                "border-white bg-white font-medium text-neutral-950 hover:bg-white hover:text-neutral-950"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(pageButtonClassName, "disabled:opacity-40")}
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  )
}
