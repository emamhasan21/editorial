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

export function asSystemRole(value: unknown): SystemRole {
  return systemRoles.includes(value as SystemRole) ? (value as SystemRole) : "reader";
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
