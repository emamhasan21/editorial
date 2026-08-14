export const systemRoles = [
  "owner",
  "admin",
  "managing_editor",
  "editor",
  "writer",
  "contributor",
  "reader",
] as const;

export type SystemRole = (typeof systemRoles)[number];

export const roleLabels: Record<SystemRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  managing_editor: "Managing editor",
  editor: "Editor",
  writer: "Writer",
  contributor: "Contributor",
  reader: "Reader",
};

export function asSystemRole(value: unknown): SystemRole {
  return systemRoles.includes(value as SystemRole) ? (value as SystemRole) : "reader";
}

export function roleLabel(value: unknown) {
  return roleLabels[asSystemRole(value)];
}

export function canAccessStudio(role: unknown) {
  return asSystemRole(role) !== "reader";
}

export function canCreateContent(role: unknown) {
  return ["owner", "admin", "managing_editor", "editor", "writer", "contributor"].includes(asSystemRole(role));
}

export function canPublishContent(role: unknown) {
  return ["owner", "admin", "managing_editor", "editor"].includes(asSystemRole(role));
}

export function canManageAuthors(role: unknown) {
  return ["owner", "admin", "managing_editor", "editor"].includes(asSystemRole(role));
}

export function canManageRoles(role: unknown) {
  return ["owner", "admin"].includes(asSystemRole(role));
}
