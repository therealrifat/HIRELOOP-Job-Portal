// Plan catalog — single source of truth for pricing, billing and payment pages.
// Don't re-declare plan data in components; import from here.
// Values follow the pricing tiers in Project requirements.md.

import type { PlanId, PlanInfo } from "@/types/billing"

export const PLANS: Record<PlanId, PlanInfo> = {
  pro: {
    id: "pro",
    name: "Pro",
    price: 19,
    currency: "USD",
    audience: "seeker",
    features: [
      "Apply to up to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 39,
    currency: "USD",
    audience: "seeker",
    features: [
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    price: 49,
    currency: "USD",
    audience: "recruiter",
    features: [
      "Up to 10 active job posts",
      "Applicant tracking",
      "Basic analytics",
      "Email support",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 149,
    currency: "USD",
    audience: "recruiter",
    features: [
      "Up to 50 active job posts",
      "Advanced analytics",
      "Featured job listings",
      "Team collaboration & custom branding",
      "Priority support",
    ],
  },
}

export function getPlan(planId: string | undefined): PlanInfo {
  return (planId && planId in PLANS && PLANS[planId as PlanId]) || PLANS.pro
}
