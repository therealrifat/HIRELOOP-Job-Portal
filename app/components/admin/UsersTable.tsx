import { ShieldCheckIcon, UserXIcon } from "lucide-react"

import RoleSelect from "@/app/components/admin/RoleSelect"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/format"
import type { AdminUser } from "@/types/auth"

/** The admin's Users table — every account with a role toggle per row.
 *  Role changes save through updateUserRole (stubbed until implemented). */
export default function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 w-5xl bg-white/[0.03]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-white/50">User</TableHead>
            <TableHead className="text-white/50">Role</TableHead>
            <TableHead className="hidden text-white/50 sm:table-cell">
              Joined
            </TableHead>
            <TableHead className="hidden text-white/50 md:table-cell">
              Verified
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initial = user.name?.trim()?.[0]?.toUpperCase() ?? "?"

            return (
              <TableRow key={user.id} className="border-white/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {user.name || "Unnamed user"}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-white/40">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {/* Legacy users without a role display as seeker */}
                  <RoleSelect userId={user.id} role={user.role ?? "seeker"} />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
                      <ShieldCheckIcon className="size-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-white/40">
                      <UserXIcon className="size-4" />
                      No
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}

          {users.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-12 text-center text-sm text-white/40"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
