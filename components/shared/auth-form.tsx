"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import {
  BriefcaseBusinessIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  ShieldIcon,
  UserIcon,
} from "lucide-react"

import logoImg from "@/app/images/logo.png"
import { authClient } from "@/lib/auth-client"
import type { AuthFormData, AuthMode, UserRole } from "@/types/auth"

const roleOptions: Array<{
  value: UserRole
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Find and apply to jobs",
    icon: UserIcon,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs and hire",
    icon: BriefcaseBusinessIcon,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the platform",
    icon: ShieldIcon,
  },
]

function Toggle({ mode }: { mode: AuthMode }) {
  return (
    <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
      <Link
        href="/sign-in"
        aria-current={mode === "signin" ? "page" : undefined}
        className={`rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
          mode === "signin"
            ? "bg-white/10 text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        aria-current={mode === "signup" ? "page" : undefined}
        className={`rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors ${
          mode === "signup"
            ? "bg-white/10 text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        Sign Up
      </Link>
    </div>
  )
}

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignIn = mode === "signin"
  const [form, setForm] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof AuthFormData) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)

    if (!isSignIn && form.password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = isSignIn
        ? (await authClient.signIn.email({ email: form.email, password: form.password, callbackURL: "/"}))
        : (await authClient.signUp.email({
            name: form.name,
            email: form.email,
            password: form.password,
            // role is a better-auth "additionalField" (see lib/auth.ts) —
            // it needs `input: true` there or the server rejects it
            role: form.role,
          }))

      if (data) {
        console.log(data)
        setInfo(isSignIn ? "Signed in successfully." : "Account created successfully.")
      }
      if (error) {
        console.log(error)
        setError(error.message ?? "Something went wrong. Please try again.")
      }
    } catch (caught) {
      // e.g. network failure — without this the button would stay disabled forever
      console.log(caught)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-indigo-500/60 focus:bg-white/10"

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-md sm:p-8">
      <div className="mb-6">
        <Link href="/" className="inline-block">
          <Image src={logoImg} alt="HireLoop" className="h-8 w-auto" />
        </Link>
        <h1 className="mt-5 text-2xl font-bold text-white">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-sm text-white/50">
          {isSignIn
            ? "Sign in to continue your job hunt."
            : "Join thousands of candidates finding their dream role."}
        </p>
      </div>

      <Toggle mode={mode} />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {!isSignIn && (
          <>
            {/* Role picker */}
            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-sm font-medium text-white/80">
                I&apos;m joining as
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = form.role === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      title={option.description}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role: option.value }))
                      }
                      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-colors ${
                        isActive
                          ? "border-indigo-500/60 bg-indigo-500/10 text-white"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
                      }`}
                    >
                      <Icon
                        className={`size-5 ${isActive ? "text-indigo-400" : "text-white/40"}`}
                      />
                      <span className="text-xs font-medium leading-tight">
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-name"
                className="text-sm font-medium text-white/80"
              >
                Full name
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Rifat Islam"
                value={form.name}
                onChange={handleChange("name")}
                className={inputClasses}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="auth-email"
            className="text-sm font-medium text-white/80"
          >
            Email
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="auth-password"
            className="text-sm font-medium text-white/80"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              placeholder={isSignIn ? "Your password" : "At least 8 characters"}
              value={form.password}
              onChange={handleChange("password")}
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 hover:text-white/80"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {!isSignIn && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="auth-confirm-password"
              className="text-sm font-medium text-white/80"
            >
              Confirm password
            </label>
            <input
              id="auth-confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Repeat the password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClasses}
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:from-violet-600 hover:to-indigo-600 disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
          {isSignIn ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        {isSignIn ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/signup" : "/signin"}
          className="font-medium text-indigo-400 hover:text-indigo-300"
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  )
}
