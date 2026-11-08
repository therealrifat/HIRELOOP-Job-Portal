import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

// Type-only import: keeps the server code (MongoDB client) out of the client
// bundle while letting the client types know about server additional fields,
// e.g. the "role" field sent during sign-up
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
    /** base URL is optional when the API runs on the same domain (/api/auth) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, useSession } = authClient
