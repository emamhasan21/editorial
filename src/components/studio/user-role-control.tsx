"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { roleLabels, systemRoles, type SystemRole } from "@/lib/permissions";

export function UserRoleControl({ userId, currentRole, disabled }: { userId: string; currentRole: SystemRole; disabled: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState<SystemRole>(currentRole);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/users/${userId}/role`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    const result = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok) {
      setMessage(result?.error?.message ?? "Role could not be updated");
      return;
    }
    setMessage("Saved");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <select aria-label="User role" value={role} onChange={(event) => setRole(event.target.value as SystemRole)} disabled={disabled || pending} className="h-9 border bg-background px-2 text-xs disabled:opacity-60">
        {systemRoles.map((value) => <option key={value} value={value}>{roleLabels[value]}</option>)}
      </select>
      <button type="button" onClick={save} disabled={disabled || pending || role === currentRole} className="inline-flex h-9 items-center gap-1.5 bg-foreground px-3 text-xs font-medium text-background disabled:opacity-40">{pending && <LoaderCircle className="size-3 animate-spin" />}Save</button>
      {message && <span className="w-full text-right text-[10px] text-muted-foreground">{message}</span>}
    </div>
  );
}
