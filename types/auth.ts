// Auth-related types shared across the app.
// "UserRole" mirrors the better-auth additionalFields.role config in lib/auth.ts
// ("seeker" | "recruiter" | "admin") — keep the two in sync.

export type UserRole = "seeker" | "recruiter" | "admin"

/** Display projection of a better-auth user for the admin Users table.
 *  Deliberately not the raw better-auth shape — listUsers returns extra
 *  fields (image, banned, …) that the UI doesn't need. `createdAt` arrives
 *  as a Date from auth.api but as an ISO string from serialized sources. */
export type AdminUser = {
  id: string
  name: string
  email: string
  /** additionalField with defaultValue "seeker" at signup — legacy users
   *  created before the field existed may have no role at all */
  role?: UserRole
  createdAt: string | Date
  emailVerified?: boolean
}

/** Which auth page the shared AuthForm renders ("signin" | "signup") */
export type AuthMode = "signin" | "signup"

/** Data collected by the sign-up form (sign-in uses email + password only) */
export type AuthFormData = {
  name: string
  email: string
  password: string
  role: UserRole
}
