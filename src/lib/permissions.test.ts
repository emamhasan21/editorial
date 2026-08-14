import { describe, expect, it } from "vitest";
import { canAccessStudio, canManageAuthors, canManageRoles, canPublishContent, roleLabel } from "./permissions";

describe("role permissions", () => {
  it("keeps reader accounts outside the publishing studio", () => {
    expect(canAccessStudio("reader")).toBe(false);
    expect(canPublishContent("reader")).toBe(false);
    expect(canManageRoles("reader")).toBe(false);
  });

  it("allows owners and administrators to manage roles", () => {
    expect(canManageRoles("owner")).toBe(true);
    expect(canManageRoles("admin")).toBe(true);
    expect(canManageRoles("editor")).toBe(false);
  });

  it("allows editorial roles to manage literary authors", () => {
    expect(canManageAuthors("managing_editor")).toBe(true);
    expect(canManageAuthors("writer")).toBe(false);
  });

  it("normalizes unknown roles to reader", () => {
    expect(roleLabel("unknown")).toBe("Reader");
  });
});
