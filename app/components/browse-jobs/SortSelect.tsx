"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sortOptions = [
  { value: "most-recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary-high-to-low", label: "Salary: High to Low" },
  { value: "salary-low-to-high", label: "Salary: Low to High" },
]

/** "Sort by" dropdown in the browse-jobs header. */
export default function SortSelect() {
  const [value, setValue] = useState(sortOptions[0].value)

  return (
    <div className="flex items-center gap-2 text-sm text-white/60">
      <span className="shrink-0">Sort by:</span>
      <Select
        items={sortOptions}
        value={value}
        onValueChange={(next) => {
          setValue(next ?? sortOptions[0].value)
          // TODO: push the sort value into the URL query — intentionally left
          // unimplemented for now; the local state only drives the dropdown UI.
        }}
      >
        <SelectTrigger className="border-white/10 bg-white/[0.04] text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
