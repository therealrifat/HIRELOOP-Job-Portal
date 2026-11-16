import Link from "next/link"

import { CheckIcon, XIcon } from "lucide-react"

import CopyButton from "@/app/components/CopyButton"
import { checkoutVerify } from "@/lib/actions/jobs"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

type SearchParams = Promise<{ session_id?: string }>

/** Stripe Checkout return page — verifies the session server-side,
 *  records the purchase, and shows the receipt. */
async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...)`')

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })
  } catch {
    return <CheckoutStateCard
      title="Payment could not be verified"
      description="We couldn't find this checkout session. If you were charged, please contact support with your receipt email."
    />
  }

  const { status, payment_status, customer_email, metadata, payment_intent } = session

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete" && payment_status === "paid") {
    const result = await checkoutVerify(session_id)
    console.log({ result })

    // payment_intent is expanded — it can also arrive as a plain id string
    const paymentIntentId =
      typeof payment_intent === "string" ? payment_intent : payment_intent?.id

    const planName = metadata?.plan ?? "Subscription"
    const paidAt = payment_intent && typeof payment_intent !== "string"
      ? new Date(payment_intent.created * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null

    return (
      <main className="grid min-h-svh place-items-center bg-neutral-950 px-4 py-16 text-white">
        <div className="w-full max-w-md">
          {/* Success badge */}
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15">
              <CheckIcon className="size-7 text-emerald-400" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Payment successful!</h1>
            <p className="mt-1.5 text-sm text-white/50">
              Thank you for your business — your {planName} plan is now active.
            </p>
          </div>

          {/* Receipt */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-sm font-semibold text-white/80">Receipt</h2>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/50">Transaction ID</span>
                <span className="flex items-center gap-1 font-mono text-xs text-white">
                  {paymentIntentId ?? "—"}
                  {paymentIntentId && (
                    <CopyButton text={paymentIntentId} label="Copy transaction ID" />
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-white/50">Plan</span>
                <span className="font-medium text-white">{planName}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-white/50">Email</span>
                <span className="max-w-[60%] truncate font-medium text-white">
                  {customer_email ?? "—"}
                </span>
              </div>

              {paidAt && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/50">Date</span>
                  <span className="font-medium text-white">{paidAt}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <span className="text-white/50">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-300">
                  Paid
                </span>
              </div>
            </div>

            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/40">
              A confirmation email will be sent to{" "}
              {customer_email ?? "your inbox"}. If you have any questions,
              please email{" "}
              <a href="mailto:orders@example.com" className="text-indigo-400 hover:text-indigo-300">
                orders@example.com
              </a>
              .
            </p>
          </div>

          {/* Next steps */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-violet-600 hover:to-indigo-600"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/browse-jobs"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Session exists but the payment didn't go through (e.g. expired/abandoned)
  return (
    <CheckoutStateCard
      title="Payment not completed"
      description="Your payment didn't go through — you haven't been charged. You can try subscribing again anytime."
    />
  )
}

/** Shared card for the non-success outcomes (unverifiable / unpaid sessions). */
function CheckoutStateCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="grid min-h-svh place-items-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/15">
          <XIcon className="size-7 text-amber-400" />
        </div>
        <h1 className="mt-4 text-xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-white/50">{description}</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}

export default CheckoutSuccessPage
