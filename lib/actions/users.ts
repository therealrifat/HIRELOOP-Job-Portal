import type { UserRole } from "@/types/auth"

const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL
// TODO: implement — persist the role change (better-auth admin API:
// auth.api.setRole({ userId, role }) or a direct DB update). Called by
// RoleSelect in the admin Users table; until then it only resolves so
// the UI flow can be built and tested.
export const updateUserRole = async (userId: string, role: UserRole) => {

  const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({role})
  })
  return response.json()




  // console.log(`[stub] updateUserRole(${userId}, ${role})`)
  // return { userId, role, updated: false }
}
