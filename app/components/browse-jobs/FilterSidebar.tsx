"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jobCategories, jobTypes } from "@/lib/job-options"
import { useRouter } from "next/navigation"

type OptionCounts = Record<string, number>

type FilterSidebarProps = {
  /** Number of jobs per option value, used to show counts next to labels. */
  typeCounts?: OptionCounts
  categoryCounts?: OptionCounts
}

/** One checkbox row (used for independent toggles like "Remote only"). */
function FilterCheckboxRow({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70 hover:text-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="size-4 accent-white"
      />
      <span className="flex-1">{label}</span>
    </label>
  )
}

/** One radio row: check + label + optional count (e.g. "Full-time  12k").
 *  Radio semantics — only one option per group can be selected. */
function FilterRadioRow({
  groupName,
  label,
  count,
  checked,
  onSelect,
}: {
  groupName: string
  label: string
  count?: number
  checked: boolean
  onSelect: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70 hover:text-white">
      <input
        type="radio"
        name={groupName}
        checked={checked}
        onChange={onSelect}
        // radios can't be unchecked by clicking again natively — undo it here
        onClick={(event) => {
          if (checked) {
            event.preventDefault()
            onSelect()
          }
        }}
        className="size-4 accent-white"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-white/40">{count}</span>
      )}
    </label>
  )
}

/** One titled group of filter controls inside the sidebar. */
function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-white/80">{title}</h3>
      <div className="mt-2.5 flex flex-col gap-2.5">{children}</div>
    </section>
  )
}

/** Left-hand filters panel: job type, category, remote and salary range. */
export default function FilterSidebar({
  typeCounts = {},
  categoryCounts = {},
}: FilterSidebarProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")

  const router = useRouter()
  // TODO: sync the selected filters into the URL query — intentionally left
  // unimplemented for now; the local state only drives the filter UI.
  function handleClearFilters() {
    setSelectedType(null)
    setSelectedCategory(null)
    setRemoteOnly(false)
    setSalaryMin("")
    setSalaryMax("")
  }

  const inputClassName = "border-white/10 bg-white/5 text-white"

  return (
    <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-base font-semibold text-white">Filters</h2>

      <div className="mt-4 flex flex-col gap-5">
        <FilterSection title="Job Type">
          {jobTypes.map((option) => (
            <FilterRadioRow
              key={option.value}
              groupName="job-type"
              label={option.label}
              count={typeCounts[option.value]}
              checked={selectedType === option.value}
              onSelect={() => {
                const value =
                  selectedType === option.value ? null : option.value
                setSelectedType(value)
                const params = new URLSearchParams(window.location.search)

                if (value) {
                  params.set("type", value)
                } else {
                  params.delete("type")
                }
                router.push(`/browse-jobs?${params.toString()}`)
              }}
            />
          ))}
        </FilterSection>

        <FilterSection title="Category">
          {jobCategories.map((option) => (
            <FilterRadioRow
              key={option.value}
              groupName="job-category"
              label={option.label}
              count={categoryCounts[option.value]}
              checked={selectedCategory === option.value}
              onSelect={() => {
                const value =
                  selectedCategory === option.value ? null : option.value

                setSelectedCategory(value)

                const params = new URLSearchParams(window.location.search)

                if (value) {
                  params.set("category", value)
                } else {
                  params.delete("category")
                }

                router.push(`/browse-jobs?${params.toString()}`)
              }}
            />
          ))}
        </FilterSection>

        <FilterSection title="Workplace">
          <FilterCheckboxRow
            label="Remote only"
            checked={remoteOnly}
            onToggle={() => {
              const value = !remoteOnly

              setRemoteOnly(value)

              const params = new URLSearchParams(window.location.search)

              if (value) {
                params.set("remote", "true")
              } else {
                params.delete("remote")
              }

              router.push(`/browse-jobs?${params.toString()}`)
            }}
          />
        </FilterSection>

        <FilterSection title="Salary Range">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              aria-label="Minimum salary"
              value={salaryMin}
              onChange={(event) => setSalaryMin(event.target.value)}
              className={inputClassName}
            />
            <Input
              type="number"
              min={0}
              placeholder="Max"
              aria-label="Maximum salary"
              value={salaryMax}
              onChange={(event) => setSalaryMax(event.target.value)}
              className={inputClassName}
            />
          </div>
        </FilterSection>

        <Button
          type="button"
          variant="outline"
          onClick={handleClearFilters}
          className="border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
        >
          Clear Filters
        </Button>
      </div>
    </aside>
  )
}
