// Shared date formatting helpers — the single implementation for every
// dashboard and public page (previously duplicated in three files).

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/** ISO date → "Nov 14, 2026". Returns "—" for empty values and the raw
 *  input when it can't be parsed. */
export function formatDate(iso: string) {
  if (!iso) return "—"
  const [year, month, day] = iso.split("T")[0].split("-").map(Number)
  if (!year || !month || !day) return iso
  return `${monthNames[month - 1]} ${day}, ${year}`
}

/** ISO date → relative wording — "Just now", "2 hours ago", "1 day ago",
 *  "1 week ago", "2 months ago". */
export function formatRelative(iso: string) {
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) return iso
  const diffMs = Date.now() - timestamp
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffHours < 1) return "Just now"
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
  }
  const months = Math.floor(diffDays / 30)
  return months === 1 ? "1 month ago" : `${months} months ago`
}
