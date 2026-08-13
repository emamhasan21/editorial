import { expect, test } from "@playwright/test";

test("moves through the public app without a document reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /ideas deserve/i })).toBeVisible();
  if ((page.viewportSize()?.width ?? 1280) < 768) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "Latest stories", exact: true }).click();
  } else {
    await page.getByRole("link", { name: "Writing", exact: true }).first().click();
  }
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { name: /thoughtful publishing/i })).toBeVisible();
});

test("opens the block editor and formats content", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(process.env.SEED_OWNER_EMAIL ?? "owner@editorial.local");
  await page.getByLabel("Password", { exact: true }).fill(process.env.SEED_OWNER_PASSWORD ?? "ChangeMe-Editorial-2026");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/studio");
  await page.goto("/studio/new");
  await expect(page.getByPlaceholder("Release title")).toBeVisible();
  await page.getByPlaceholder("Release title").fill("A browser test post");
  await page.getByRole("button", { name: "Add block" }).click();
  await expect(page.getByRole("button", { name: /Heading 2/ })).toBeVisible();
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByText("A browser test post")).toBeVisible();
});

test("reads a seeded book chapter and returns to its contents", async ({ page }) => {
  await page.goto("/books/nodir-opare");
  await expect(page.getByRole("heading", { name: "নদীর ওপারে", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /প্রথম যাত্রা/ }).first().click();
  await expect(page.getByRole("heading", { name: "প্রথম যাত্রা" })).toBeVisible();
  await expect(page.locator(".literary-verse")).toBeVisible();
});
