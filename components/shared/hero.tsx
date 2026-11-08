import Image from "next/image"
import Link from "next/link"

import { BriefcaseIcon, MapPinIcon, SearchIcon } from "lucide-react"

import globeImg from "@/app/images/globe.png"
import { Separator } from "@/components/ui/separator"

const trendingPositions = [
  { label: "Product Designer", href: "/browse-jobs?role=product-designer" },
  { label: "AI Engineering", href: "/browse-jobs?role=ai-engineering" },
  { label: "Dev-ops Engineer", href: "/browse-jobs?role=dev-ops-engineer" },
]

function HeroSearch() {
  return (
    <form
      action="/browse-jobs"
      className="flex h-14 w-full max-w-3xl items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-md sm:gap-3 sm:p-2.5"
    >
      <SearchIcon className="ml-2 hidden size-5 shrink-0 text-white/50 sm:block" />
      <input
        id="hero-keyword"
        name="q"
        type="search"
        placeholder="Job title, skill or company"
        aria-label="Job title, skill or company"
        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
      />

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <Separator
          orientation="vertical"
          className="hidden data-vertical:h-6 data-vertical:self-center data-vertical:bg-white/15 sm:block"
        />
        <MapPinIcon className="hidden size-5 shrink-0 text-white/50 sm:block" />
        <input
          id="hero-location"
          name="location"
          type="search"
          placeholder="Location or Remote"
          aria-label="Location or Remote"
          className="hidden min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40 sm:block sm:text-base"
        />
      </div>

      <button
        type="submit"
        aria-label="Search jobs"
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors hover:from-indigo-400 hover:to-indigo-500"
      >
        <SearchIcon className="size-5 text-white" />
      </button>
    </form>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Planet/glow backdrop via globe.png — pinned to the hero's bottom edge */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
        <Image
          src={globeImg}
          alt=""
          className="h-auto w-full translate-y-[12%] opacity-80 sm:opacity-100"
        />
      </div>

      {/* Fade the planet's top edge so the headline area stays near-black */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-1/2 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-transparent"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 text-center sm:px-6 sm:pt-28">
        {/* Badge */}
        <div className="flex items-center">
          <div className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/20 md:block" />
          <div className="flex items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-sm tracking-[0.2em] text-white/50 uppercase sm:tracking-[0.3em]">
            <BriefcaseIcon className="size-4 shrink-0 text-amber-500" />
            <span className="font-bold tracking-[0.1em] text-white sm:tracking-[0.2em]">
              50,000+
            </span>{" "}
            new jobs this month
          </div>
          <div className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/20 md:block" />
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-pretty sm:text-6xl md:text-7xl">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl text-base text-white/60 sm:text-lg">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <div className="mt-10 flex w-full justify-center">
          <HeroSearch />
        </div>

        {/* Trending chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pb-40 sm:pb-52">
          <span className="mr-2 text-sm text-white/60">Trending Position</span>
          {trendingPositions.map((position) => (
            <Link
              key={position.label}
              href={position.href}
              className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/15"
            >
              {position.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
