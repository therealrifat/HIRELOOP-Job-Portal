import { NextResponse, type NextRequest } from "next/server"

// The dashboard route folder used to be named "dashborad" (misspelled).
// This redirects those URLs to the canonical "/dashboard/..." paths used by
// the project spec and the sidebar menu items.
// NOTE: once the folder is safely renamed to app/dashboard (dev server stopped),
// this middleware becomes a no-op and can be deleted.

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const newPathname = url.pathname.replace("/dashborad",)
  return NextResponse.redirect(new URL(newPathname + url.search, url), 308)
}

export const config = {
  matcher: ["/dashborad", "/dashborad/:path*"],
}
