"use client"

import { useState } from "react"

import { CheckIcon, CopyIcon } from "lucide-react"

/** Copies the given text to the clipboard (e.g. the transaction ID). */
export default function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable (e.g. insecure context) — nothing to do
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label ?? "Copy to clipboard"}
      className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? <CheckIcon className="size-4 text-emerald-400" /> : <CopyIcon className="size-4" />}
    </button>
  )
}
