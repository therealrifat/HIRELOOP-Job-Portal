// Auth-related types shared across the app.
// "UserRole" mirrors the better-auth additionalFields.role config in lib/auth.ts
// ("seeker" | "recruiter" | "admin") — keep the two in sync.

export type UserRole = "seeker" | "recruiter" | "admin"

/** Which auth page the shared AuthForm renders ("signin" | "signup") */
export type AuthMode = "signin" | "signup"

/** Data collected by the sign-up form (sign-in uses email + password only) */
export type AuthFormData = {
  name: string
  email: string
  password: string
  role: UserRole
}
