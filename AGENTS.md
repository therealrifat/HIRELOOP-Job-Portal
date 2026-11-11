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
- `app/components/` — project-specific components (DashboradSideBar.tsx)
- `app/(auth)/` — route group: `/sign-in`, `/sign-up`
- `app/dashboard/` — role dashboards (layout with SidebarProvider + DashboradSideBar)
- `lib/auth.ts` — better-auth server config; `lib/auth-client.ts` — browser client

## Better-auth specifics

- The user has an `additionalFields.role` config (`"seeker" | "recruiter" | "admin"`, `input: true`, `defaultValue: "seeker"`). The signup form sends it via `authClient.signUp.email({ ..., role })`.
- The client knows this field through the `inferAdditionalFields<typeof auth>()` plugin in `lib/auth-client.ts`. The server `auth` is imported there **type-only** — a runtime import would bundle MongoDB into the browser.
- `baseURL` is optional (API lives on the same domain); `process.env.BETTER_AUTH_URL` may be unset.
- Known gap: admin role is self-selectable at signup — acceptable for development, gate it before production.

## Pending/quirks

- Resolved: the dashboard folder misspelling (`app/dashborad`) was renamed to `app/dashboard`, and the temporary redirect `middleware.ts` was deleted.
- `DashboradSideBar.tsx` derives the menu from `session.user.role`, defaulting to `seeker` while the session loads — gate on `isPending` with a skeleton if the flicker matters.
- Recruiter "View Applicants" menu item points to a placeholder; the real page is dynamic (`/dashboard/jobs/:jobId/applicants`).
- Sidebar menu buttons currently render `<a href>` (full reloads); switch to `render={<Link href={item.url} />}` when routes exist.
