import type { UserRole } from "@/types/auth"

// TODO: implement — persist the role change (better-auth admin API:
// auth.api.setRole({ userId, role }) or a direct DB update). Called by
// RoleSelect in the admin Users table; until then it only resolves so
// the UI flow can be built and tested.
export const updateUserRole = async (userId: string, role: UserRole) => {
  console.log(`[stub] updateUserRole(${userId}, ${role})`)
  return { userId, role, updated: false }
}
