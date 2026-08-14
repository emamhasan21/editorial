import { expect, test } from "@playwright/test";

test("moves through the public app without exposing private workspace links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /ideas deserve/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in", exact: true })).toBeVisible();
  if ((page.viewportSize()?.width ?? 1280) < 768) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("link", { name: "Settings", exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: "সকল বই", exact: true }).click();
  } else {
    await expect(page.getByText("Workspace", { exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: "বই", exact: true }).first().click();
  }
  await expect(page).toHaveURL(/\/books$/);
  await expect(page.getByRole("heading", { name: /Choose a book/i })).toBeVisible();
});

test("signs an owner into a structured dashboard and opens the editor", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(process.env.SEED_OWNER_EMAIL ?? "owner@editorial.local");
  await page.getByLabel("Password", { exact: true }).fill(process.env.SEED_OWNER_PASSWORD ?? "ChangeMe-Editorial-2026");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/studio");
  await expect(page.getByRole("heading", { name: /Welcome,/ })).toBeVisible();
  await page.getByRole("button", { name: "Open account menu" }).click();
  await expect(page.getByText("Owner", { exact: true }).first()).toBeVisible();
  if ((page.viewportSize()?.width ?? 1280) < 768) {
    await page.getByRole("button", { name: "Dashboard navigation" }).click();
  }
  await expect(page.getByRole("link", { name: "Dashboard", exact: true }).first()).toBeVisible();
  await page.goto("/studio/new");
  await expect(page.getByPlaceholder("Release title")).toBeVisible();
  await page.getByPlaceholder("Release title").fill("A browser test post");
  await page.getByRole("button", { name: "Add block" }).click();
  await expect(page.getByRole("button", { name: /Heading 2/ })).toBeVisible();
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByText("A browser test post")).toBeVisible();
});

test("reads a seeded Bangla book chapter", async ({ page }) => {
  await page.goto("/books/nodir-opare");
  await expect(page.getByRole("heading", { name: "নদীর ওপারে", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /প্রথম যাত্রা/ }).first().click();
  await expect(page.getByRole("heading", { name: "প্রথম যাত্রা" })).toBeVisible();
  await expect(page.locator(".literary-verse")).toBeVisible();
});
