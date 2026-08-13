import { expect, test } from "@playwright/test";

test("moves through the public app without a document reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /ideas deserve/i })).toBeVisible();
  await page.getByRole("link", { name: "Writing", exact: true }).first().click();
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
  await expect(page.getByPlaceholder("Post title")).toBeVisible();
  await page.getByPlaceholder("Post title").fill("A browser test post");
  await page.getByRole("button", { name: "Add block" }).click();
  await expect(page.getByRole("button", { name: /Heading 2/ })).toBeVisible();
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.getByText("A browser test post")).toBeVisible();
});
