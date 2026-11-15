"use client"

import { useState } from "react"

import { Loader2Icon } from "lucide-react"

import type { PlanId } from "@/types/billing"

/** Pay button — eventually redirects to Stripe Checkout.
 *  TODO: replace the stub with:
 *    const res = await fetch("/api/stripe/checkout-session", {
 *      method: "POST",
 *      body: JSON.stringify({ planId }),
 *    })
 *    const { url } = await res.json()
 *    window.location.href = url   // ← Stripe-hosted checkout page
 */
export default function PayButton({ planId }: { planId: PlanId }) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  async function handlePay() {
    setIsRedirecting(true)
    console.log(`[stripe] would create checkout session for plan: ${planId}`)
    await new Promise((resolve) => setTimeout(resolve, 800)) // fake request latency
    setIsRedirecting(false)
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={isRedirecting}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:from-violet-600 hover:to-indigo-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {isRedirecting && <Loader2Icon className="size-4 animate-spin" />}
      {isRedirecting ? "Redirecting…" : `Pay — Subscribe`}
    </button>
  )
}
