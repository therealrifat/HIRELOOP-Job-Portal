import type { Metadata } from "next"

import AddJobForm from "@/app/components/AddJobForm"

export const metadata: Metadata = {
  title: "Post a Job — HireLoop",
  description: "Create a new job post for your company.",
}

export default function AddJobPage() {
  return (
    <div className="dark min-h-svh bg-neutral-950 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">Post a Job</h1>
        <p className="mt-1 text-sm text-white/50">
          Fill in the details below — your company is attached automatically.
        </p>

        <div className="mt-6">
          <AddJobForm />
        </div>
      </div>
    </div>
  )
}
