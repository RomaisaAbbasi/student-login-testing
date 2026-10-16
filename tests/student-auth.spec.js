const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("TC-01: Student can register successfully", async ({ page }) => {
  await page.locator("#registerTab").click();
  await page.locator("#studentName").fill("Ayesha Khan");
  await page.locator("#registerEmail").fill("ayesha.test@example.com");
  await page.locator("#registerPassword").fill("Ayesha123");
  await page.locator('#registerForm button[type="submit"]').click();
  await expect(page.locator("#loginForm")).toBeVisible();
  await expect(page.locator("#message")).toContainText("Account created successfully");
  await expect(page.locator("#loginEmail")).toHaveValue("ayesha.test@example.com");
});

test("TC-02: Registration rejects empty fields", async ({ page }) => {
  await page.locator("#registerTab").click();
  await page.locator('#registerForm button[type="submit"]').click();
  await expect(page.locator("#message")).toContainText("Please fill in all fields");
});

test("TC-03: Registration rejects an invalid email", async ({ page }) => {
  await page.locator("#registerTab").click();
  await page.locator("#studentName").fill("Test Student");
  await page.locator("#registerEmail").fill("invalid-email");
  await page.locator("#registerPassword").fill("Student123");
  await page.locator('#registerForm button[type="submit"]').click();
  await expect(page.locator("#message")).toContainText("valid email address");
});

test("TC-04: Student can log in with demo account", async ({ page }) => {
  await page.locator("#loginEmail").fill("demo@student.com");
  await page.locator("#loginPassword").fill("Student123");
  await page.locator('#loginForm button[type="submit"]').click();
  await expect(page.locator("#dashboard")).toBeVisible();
  await expect(page.locator("#dashboardName")).toHaveText("Demo Student");
});

test("TC-05: Login rejects an incorrect password", async ({ page }) => {
  await page.locator("#loginEmail").fill("demo@student.com");
  await page.locator("#loginPassword").fill("WrongPassword");
  await page.locator('#loginForm button[type="submit"]').click();
  await expect(page.locator("#message")).toContainText("Invalid email or password");
  await expect(page.locator("#dashboard")).toBeHidden();
});

test("TC-06: Student can log out", async ({ page }) => {
  await page.locator("#loginEmail").fill("demo@student.com");
  await page.locator("#loginPassword").fill("Student123");
  await page.locator('#loginForm button[type="submit"]').click();
  await expect(page.locator("#dashboard")).toBeVisible();
  await page.locator("#logoutButton").click();
  await expect(page.locator("#authCard")).toBeVisible();
  await expect(page.locator("#loginForm")).toBeVisible();
});
