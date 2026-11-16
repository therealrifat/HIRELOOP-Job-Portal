"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateUserRole } from "@/lib/actions/users"
import type { UserRole } from "@/types/auth"

import { roles } from "./RoleBadge"

type Props = {
  userId: string
  /** Current role from the DB — the dropdown's initial value */
  role: UserRole
}

/** Role dropdown for the admin Users table ("make this user seeker /
 *  recruiter / admin"). On change it calls updateUserRole (currently a
 *  stub — the DB write is implemented later); local state keeps the UI
 *  responsive in the meantime. */
export default function RoleSelect({ userId, role }: Props) {
  const [currentRole, setCurrentRole] = useState<UserRole>(role)
  const [isSaving, setIsSaving] = useState(false)

  async function handleRoleChange(nextRole: UserRole) {
    setCurrentRole(nextRole)
    setIsSaving(true)
    await updateUserRole(userId, nextRole)
    setIsSaving(false)
  }

  return (
    <Select
      value={currentRole}
      onValueChange={(value) => handleRoleChange(value as UserRole)}
    >
      <SelectTrigger
        size="sm"
        disabled={isSaving}
        aria-label="Change user role"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(roles) as UserRole[]).map((roleKey) => (
          <SelectItem key={roleKey} value={roleKey}>
            {roles[roleKey].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
