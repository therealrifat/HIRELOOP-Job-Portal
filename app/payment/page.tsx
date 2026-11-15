import type { Metadata } from "next"
import Link from "next/link"

import { CheckIcon, LockIcon } from "lucide-react"

import PayButton from "@/app/components/PayButton"
import { getPlan } from "@/lib/plan-options"

export const metadata: Metadata = {
  title: "Payment — HireLoop",
  description: "Complete your subscription payment.",
}

type SearchParams = Promise<{ plan?: string; canceled?: string }>

/** Simple payment page — a Stripe-hosted checkout page will replace the
 *  final step; the Pay button will redirect there once wired up. */
const PaymentPage = async ({
  searchParams,
}: {
  searchParams: SearchParams
}) => {
  const { plan: planParam } = await searchParams
  const plan = getPlan(planParam)

  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    )
  }

  return (
    <main className="grid min-h-svh place-items-center bg-neutral-950 px-4 py-16 text-white">
      <div className="w-full max-w-md">
        <Link
          href="/pricing"
          className="text-sm text-white/50 hover:text-white"
        >
          ← Back to pricing
        </Link>

        {/* Order summary */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-sm text-white/50">Order summary</p>
          <h1 className="mt-1 text-2xl font-bold">{plan.name} Plan</h1>
          <p className="mt-0.5 text-xs text-white/40">
            Billed monthly · cancel anytime
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            {plan.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5 text-sm text-white/70"
              >
                <CheckIcon className="size-4 shrink-0 text-emerald-400" />
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Due today</span>
              <span className="text-2xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-white/40">
                  /{plan.currency.toLowerCase()}
                </span>
              </span>
            </div>
          </div>

          {/* TODO: Stripe Checkout redirect lives in PayButton */}

          <form action="/api/checkout_sessions" method="POST">
            <section>
              <button
                type="submit"
                role="link"

                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:from-violet-600 hover:to-indigo-600 disabled:pointer-events-none disabled:opacity-60"
              >
                Pay — Subscribe ${plan.price} 
              </button>
            </section>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-white/40">
            <LockIcon className="size-3.5" />
            Payments are processed securely by Stripe
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-white/30">
          By subscribing you agree to the HireLoop Terms of Service. You can
          cancel or switch plans at any time.
        </p>
      </div>
    </main>
  )
}

export default PaymentPage
