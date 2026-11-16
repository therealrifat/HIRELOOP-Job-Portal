import type { UserRole } from "@/types/auth"

import { cn } from "cn"

/** Role → pill wording + colors.
 *  Single source of truth for role UI: RoleBadge renders it as a pill,
 *  RoleSelect lists the same roles/labels in the dropdown. */
export const roles: Record<UserRole, { label: string; className: string }> = {
  seeker: {
    label: "Seeker",
    className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  },
  recruiter: {
    label: "Recruiter",
    className: "border-violet-500/40 bg-violet-500/15 text-violet-300",
  },
  admin: {
    label: "Admin",
    className: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  },
}

/** Colored role pill for a user (admin Users table). */
export default function RoleBadge({
  role,
  className,
}: {
  role: UserRole
  className?: string
}) {
  const meta = roles[role]

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-0.5 text-xs font-medium",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
