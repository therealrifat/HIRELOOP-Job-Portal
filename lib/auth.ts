import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGO_DB_CLIENT as string)
const db = client.db("hireloop")

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    // Persists the extra "role" field sent by the signup form
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"] as const,
        input: true, // must be true, otherwise better-auth rejects the client-provided value
        defaultValue: "seeker",
      },
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin() 
  ]
})
