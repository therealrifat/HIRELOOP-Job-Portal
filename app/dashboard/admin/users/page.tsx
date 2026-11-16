import UsersTable from "@/app/components/admin/UsersTable"
import { roles } from "@/app/components/admin/RoleBadge"
import { getUsers } from "@/lib/core/servet"
import type { AdminUser, UserRole } from "@/types/auth"

type StatCard = {
  label: string
  value: string
  className: string
}

const AdminUserPage = async () => {
  // listUsers requires an admin session — show a friendly fallback instead
  // of a 500 when it fails
  let result: Awaited<ReturnType<typeof getUsers>> | null = null
  try {
    result = await getUsers()
  } catch {
    result = null
  }
  // listUsers returns { users: [...] } — normalize once for the table:
  // legacy users without a role count and display as seekers
  const users: AdminUser[] = ((result?.users ?? []) as AdminUser[]).map(
    (user) => ({ ...user, role: user.role ?? "seeker" })
  )

  if (users.length === 0 && !result) {
    return (
      <div className="dark grid min-h-svh place-items-center bg-neutral-950 p-6 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Couldn&apos;t load users</h1>
          <p className="mt-1.5 text-sm text-white/50">
            You need to be signed in as an admin to manage users.
          </p>
        </div>
      </div>
    )
  }

  const countByRole = (role: UserRole) =>
    users.filter((user) => user.role === role).length

  const statCards: StatCard[] = [
    { label: "Total Users", value: String(users.length), className: "text-white" },
    {
      label: "Seekers",
      value: String(countByRole("seeker")),
      className: roles.seeker.className.match(/text-\S+/)?.[0] ?? "text-indigo-300",
    },
    {
      label: "Recruiters",
      value: String(countByRole("recruiter")),
      className: roles.recruiter.className.match(/text-\S+/)?.[0] ?? "text-violet-300",
    },
    {
      label: "Admins",
      value: String(countByRole("admin")),
      className: roles.admin.className.match(/text-\S+/)?.[0] ?? "text-amber-300",
    },
  ]

  return (
    <div className="dark min-h-svh bg-neutral-950 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-sm text-white/50">
            Manage roles and access for everyone on HireLoop.
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className={`mt-1.5 text-2xl font-bold ${stat.className}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="mt-6">
          <UsersTable users={users} />
        </div>
      </div>
    </div>
  )
}

export default AdminUserPage
