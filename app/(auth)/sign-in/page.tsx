import type { Metadata } from "next"

import AuthForm from "@/components/shared/auth-form"

export const metadata: Metadata = {
  title: "Sign In — HireLoop",
  description: "Sign in to your HireLoop account and continue your job hunt.",
}

export default function SignInPage() {
  return <AuthForm mode="signin" />
}
