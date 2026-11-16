<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop — project conventions

Job hunting platform (client). Marketing pages are public; each role gets its own dashboard section under `/dashboard/<role>`.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 (CSS-first config in `app/globals.css`, `@theme inline` tokens)
- shadcn/ui, style "base-nova" — built on **@base-ui/react**, not Radix
- better-auth (email/password + GitHub) with MongoDB adapter (`hireloop` db)

## Commands

- `npm run dev` / `build` / `typecheck` / `lint`
- On this machine run npm in shells as `npm.cmd` (PowerShell execution policy blocks `npm.ps1`)

## base-ui shadcn idioms (differs from classic shadcn)

- Use the `render` prop instead of `asChild`: `<Button render={<Link href="..." />}>Get Started</Button>`
- To reuse Button styles on a non-button element, call the exported class generator: `buttonVariants({ variant, className })`
- `cn` is imported from `"cn"` (alias `@/lib/utils` also works)
- Prefer theme tokens (`bg-card`, `border-border`, `text-foreground`) over hardcoded colors so both themes work. Dark marketing sections (hero, auth, dashboards) may hardcode `bg-neutral-950` + white text.
- Images are statically imported from `app/images/` (e.g. `import globeImg from "@/app/images/globe.png"`), not served from `public/`

## File map

- `components/shared/` — navbar (default export, sticky pill bar), hero, auth-form (`<AuthForm mode="signin" | "signup" />`)
- `components/ui/` — shadcn primitives (button, sheet, separator, sidebar, …)
- `app/components/` — project-specific components (DashboradSideBar.tsx); `app/components/applications/` holds the applicant-pipeline pieces (`StatusBadge`, `StatusSelect`, `ApplicantsTable`); `app/components/admin/` holds the admin users pieces (`RoleBadge`, `RoleSelect`, `UsersTable`)
- `app/(auth)/` — route group: `/sign-in`, `/sign-up`
- `app/dashboard/` — role dashboards (layout with SidebarProvider + DashboradSideBar); recruiter "View Applicants" page is dynamic: `app/dashboard/recruiter/jobs/[Id]/applications/page.tsx` (linked from each Manage Jobs row's eye icon)
- `lib/auth.ts` — better-auth server config; `lib/auth-client.ts` — browser client
- `lib/actions/` — mutation fetchers: `jobs.ts` (createJob, deleteJob, applytoAJob, checkoutVerify, `updateApplicationStatus` stub), `users.ts` (`updateUserRole` stub)
- `lib/format.ts` — shared `formatDate` / `formatRelative` (single implementation; don't re-declare date helpers in pages; both accept `string | Date`)
- `lib/job-options.ts` — job categories/types/currencies; `lib/plan-options.ts` — `PLANS` catalog for pricing/billing/payment
- `types/` — the single source of truth for shared domain types: `types/auth.ts` (`UserRole`, `AuthMode`, `AuthFormData`, `AdminUser` — display projection of a better-auth user with optional `role` for legacy users), `types/jobs.ts` (`JobStatus`, `JobFormData`, `ManagedJob`, `SelectOption`), `types/applications.ts` (`ApplicationStatus`, `ApplicationData`, `JobApplication` incl. optional denormalized `applicantName`, `ApplyToJobPayload`), `types/billing.ts` (`PlanId`, `PlanAudience`, `PlanInfo`), `types/navigation.ts` (`MenuItem`). Components may re-export these for convenience but never re-declare them; `app/components/AddJobForm.tsx` keeps a legacy `Jobstatus` alias (old spelling) for backward compatibility.

## Better-auth specifics

- The user has an `additionalFields.role` config (`"seeker" | "recruiter" | "admin"`, `input: true`, `defaultValue: "seeker"`). The signup form sends it via `authClient.signUp.email({ ..., role })`.
- The client knows this field through the `inferAdditionalFields<typeof auth>()` plugin in `lib/auth-client.ts`. The server `auth` is imported there **type-only** — a runtime import would bundle MongoDB into the browser.
- `baseURL` is optional (API lives on the same domain); `process.env.BETTER_AUTH_URL` may be unset.
- Known gap: admin role is self-selectable at signup — acceptable for development, gate it before production.

## Pending/quirks

- Resolved: the dashboard folder misspelling (`app/dashborad`) was renamed to `app/dashboard`, and the temporary redirect `middleware.ts` was deleted.
- `DashboradSideBar.tsx` derives the menu from `session.user.role`, defaulting to `seeker` while the session loads — gate on `isPending` with a skeleton if the flicker matters.
- Recruiter "View Applicants" menu item points at `/dashboard/recruiter/jobs` (Manage Jobs), whose rows link to the dynamic pipeline page `/dashboard/recruiter/jobs/:jobId/applications`.
- **Status update is a stub**: `updateApplicationStatus` in `lib/actions/jobs.ts` only logs and resolves — implement the real DB write there (e.g. `PATCH /applications/:id`) and the StatusSelect dropdown in the pipeline goes live. Older applications (seeded before the feature) lack `applicantName` and render their email as the identifier.
- **Role update is a stub**: `updateUserRole` in `lib/actions/users.ts` only logs and resolves — implement it (better-auth admin API `auth.api.setRole({ userId, role })` with session headers) and the RoleSelect dropdown in `app/dashboard/admin/users` goes live. Admin pages need an admin session; `getUsers` (`auth.api.listUsers`) throws otherwise (the page shows a fallback).
- Sidebar menu buttons currently render `<a href>` (full reloads); switch to `render={<Link href={item.url} />}` when routes exist.
