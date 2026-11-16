"use client"

import { useState } from "react"

import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { JobFormData, JobStatus } from "@/types/jobs"
import { currencies, jobCategories, jobTypes } from "@/lib/job-options"

// Re-exported for backward compatibility — new code should import from "@/types/jobs"
export type { JobFormData, JobStatus } from "@/types/jobs"
export type Jobstatus = JobStatus // legacy alias (old spelling), kept so nothing breaks
import { createJob } from "./../../lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

const initialFormData: JobFormData = {
  title: "",
  category: "software-development",
  type: "full-time",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  location: "",
  remote: false,
  deadline: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "active",
  applicantsCount: 0,
  datePosted: "",
  recruiterId: "",
}

export default function AddJobForm() {
  const [form, setForm] = useState<JobFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  const router = useRouter()

  // one tiny helper drives every text/number field
  function handleChange(field: keyof JobFormData) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  // same helper, reused by the Selects (they hand us the value directly)
  function handleSelect(field: keyof JobFormData) {
    return (value: string | null) =>
      setForm((prev) => ({ ...prev, [field]: value ?? "" }))
  }
  const { data: session } = useSession()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setInfo(null)
    setIsSubmitting(true)

    const payload: JobFormData & { status: string } = {
      ...form,
      status: "active",
      recruiterId: session?.user.id ?? ("" as string),

      datePosted: new Date().toISOString().split("T")[0],
    }

    const result = await createJob(payload)

    if (result.insertedId) {
      toast.add({
        title: "Job Create",
        description: "Job Create Succesfull",
      })
      router.push("/dashboard/recruiter/jobs")
    }

    await new Promise((resolve) => setTimeout(resolve, 500)) // fake request latency
    setInfo("Job saved (stub) — wire the API call next.")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Company — auto-filled from the recruiter's registered company */}
      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <legend className="px-1 text-sm font-semibold text-white/80">
          Company
        </legend>
        <p className="mb-3 text-xs text-white/40">
          Auto-filled from your registered company profile.
        </p>
        <Input
          disabled
          placeholder="Your company name appears here"
          className="bg-input/30 text-white"
        />
      </fieldset>

      {/* Job info */}
      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <legend className="px-1 text-sm font-semibold text-white/80">
          Job Info
        </legend>

        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="job-title" className="text-white/80">
              Job Title
            </Label>
            <Input
              id="job-title"
              name="title"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={form.title}
              onChange={handleChange("title")}
              className="bg-input/30 text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="job-category" className="text-white/80">
              Category
            </Label>
            <Select
              items={jobCategories}
              value={form.category}
              onValueChange={handleSelect("category")}
            >
              <SelectTrigger id="job-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="job-type" className="text-white/80">
              Job Type
            </Label>
            <Select
              items={jobTypes}
              value={form.type}
              onValueChange={handleSelect("type")}
            >
              <SelectTrigger id="job-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="salary-min" className="text-white/80">
                Salary (min)
              </Label>
              <Input
                id="salary-min"
                name="salaryMin"
                type="number"
                min={0}
                required
                placeholder="30000"
                value={form.salaryMin}
                onChange={handleChange("salaryMin")}
                className="bg-input/30 text-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="salary-max" className="text-white/80">
                Salary (max)
              </Label>
              <Input
                id="salary-max"
                name="salaryMax"
                type="number"
                min={0}
                required
                placeholder="60000"
                value={form.salaryMax}
                onChange={handleChange("salaryMax")}
                className="bg-input/30 text-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="salary-currency" className="text-white/80">
                Currency
              </Label>
              <Select
                items={currencies}
                value={form.currency}
                onValueChange={handleSelect("currency")}
              >
                <SelectTrigger id="salary-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deadline" className="text-white/80">
              Application Deadline
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              required
              value={form.deadline}
              onChange={handleChange("deadline")}
              className="bg-input/30 text-white"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 sm:justify-start sm:gap-3">
            <Label htmlFor="remote" className="text-white/80">
              Fully remote
            </Label>
            <Switch
              id="remote"
              checked={form.remote}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, remote: checked }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="location" className="text-white/80">
              Location{" "}
              {form.remote ? "(not needed for remote)" : "(City, Country)"}
            </Label>
            <Input
              id="location"
              name="location"
              required={!form.remote}
              disabled={form.remote}
              placeholder={
                form.remote ? "Remote — anywhere" : "e.g. Dhaka, Bangladesh"
              }
              value={form.location}
              onChange={handleChange("location")}
              className="bg-input/30 text-white"
            />
          </div>
        </div>
      </fieldset>

      {/* Job description */}
      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <legend className="px-1 text-sm font-semibold text-white/80">
          Job Description
        </legend>

        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="responsibilities" className="text-white/80">
              Responsibilities
            </Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              required
              rows={4}
              placeholder="One per line — e.g. Build and maintain UI components…"
              value={form.responsibilities}
              onChange={handleChange("responsibilities")}
              className="bg-input/30 text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="requirements" className="text-white/80">
              Requirements
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              required
              rows={4}
              placeholder="One per line — e.g. 3+ years with React…"
              value={form.requirements}
              onChange={handleChange("requirements")}
              className="bg-input/30 text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="benefits" className="text-white/80">
              Benefits{" "}
              <span className="font-normal text-white/40">(optional)</span>
            </Label>
            <Textarea
              id="benefits"
              name="benefits"
              rows={2}
              placeholder="One per line — e.g. Health insurance, yearly bonus…"
              value={form.benefits}
              onChange={handleChange("benefits")}
              className="bg-input/30 text-white"
            />
          </div>
        </div>
      </fieldset>

      {info && (
        <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {info}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600"
        >
          {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
          Post Job
        </Button>
      </div>
    </form>
  )
}
