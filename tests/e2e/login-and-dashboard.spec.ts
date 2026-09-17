import { test, expect } from "@playwright/test";

/**
 * Requires the backend running with an admin seeded via `python scripts/seed_admin.py`, and
 * NEXT_PUBLIC_API_BASE_URL pointed at it. Not executed as part of this project's build/CI in
 * this environment (no browser binaries installed here) — run locally with
 * `npx playwright install && npx playwright test` once both servers are up.
 */
test("admin can log in and reach the overview page", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL ?? "admin@example.com");
  await page.getByLabel("Password").fill(process.env.E2E_ADMIN_PASSWORD ?? "change-me-now");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Overview")).toBeVisible();
  await expect(page.getByText("Booked Appointments")).toBeVisible();
});

test("unauthenticated visitor is redirected to login", async ({ page }) => {
  await page.goto("/calls");
  await expect(page).toHaveURL(/\/login/);
});
