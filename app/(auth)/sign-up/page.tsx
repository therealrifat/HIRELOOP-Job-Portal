import type { Metadata } from "next"

import AuthForm from "@/components/shared/auth-form"

export const metadata: Metadata = {
  title: "Sign Up — HireLoop",
  description: "Create a HireLoop account and find your dream job today.",
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}
