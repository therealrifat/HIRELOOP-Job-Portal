export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative grid min-h-svh place-items-center bg-neutral-950 px-4 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,oklch(0.4_0.15_275/0.4),transparent)]" />
      {children}
    </main>
  )
}
