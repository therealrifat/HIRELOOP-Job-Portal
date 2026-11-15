// Billing/payment types shared by the payment page, pricing and billing pages.

/** Slug used in URLs (?plan=pro) — must match keys in lib/plan-options.ts */
export type PlanId = "pro" | "premium" | "growth" | "enterprise"

/** Who the plan is for — drives dashboard-specific billing pages */
export type PlanAudience = "seeker" | "recruiter"

export type PlanInfo = {
  id: PlanId
  name: string
  price: number // monthly price in the currency below
  currency: string
  audience: PlanAudience
  /** One-line list of what the plan includes (shown on the payment page) */
  features: string[]
}
