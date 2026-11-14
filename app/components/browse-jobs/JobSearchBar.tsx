"use client"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

/** Top search bar for the browse-jobs page. */
export default function JobSearchBar() {
  const router = useRouter()

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    const search = data.q
    const params = new URLSearchParams()
    params.set("search", search as string)

    router.push(`/browse-jobs?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4"
    >
      <SearchIcon className="size-4 shrink-0 text-white/40" />
      <input
        type="text"
        name="q"
        placeholder="Search by job title, keywords..."
        className="h-9 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
      />
      <Button
        type="submit"
        size="lg"
        className="rounded-full bg-white text-neutral-950 hover:bg-white/90"
      >
        Search Jobs
      </Button>
    </form>
  )
}
