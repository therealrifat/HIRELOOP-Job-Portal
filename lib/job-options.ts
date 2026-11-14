// Shared option lists for the Post-a-Job form and the browse-jobs filters.
// Keep this file the single source of truth — don't re-declare these lists
// in components.
import type { SelectOption } from "@/types/jobs"

export const jobCategories: SelectOption[] = [
  { value: "software-development", label: "Software Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "customer-support", label: "Customer Support" },
  { value: "finance", label: "Finance" },
  { value: "human-resources", label: "Human Resources" },
]

export const jobTypes: SelectOption[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "remote", label: "Remote" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
]

export const currencies: SelectOption[] = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "BDT", label: "BDT (৳)" },
]
