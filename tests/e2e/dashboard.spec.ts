import { expect, test } from "@playwright/test";

test("captain can see jersey accountability and mark a jersey returned", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Good evening, Kofi." }),
  ).toBeVisible();
  await expect(page.getByText("Jersey collection")).toBeVisible();

  await page.getByRole("button", { name: "Mark returned" }).first().click();
  await expect(page.getByText("Checked in").first()).toBeVisible();
});

test("captain can create a game", async ({ page }) => {
  await page.goto("/games");
  await page.getByRole("button", { name: "Create game", exact: true }).click();
  await page.getByLabel("Opponent").fill("Warriors");
  await page.getByLabel("Venue").fill("Test Arena");
  await page
    .getByRole("button", { name: "Create game", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: "Leopards vs Warriors" }),
  ).toBeVisible();
});

test("captain can register a jersey and add a roster member", async ({
  page,
}) => {
  await page.goto("/jerseys");
  await page.getByRole("button", { name: "Register jersey" }).click();
  await page.getByLabel("Number").fill("31");
  await page.getByLabel("Size").fill("M");
  await page
    .getByRole("button", { name: "Register jersey", exact: true })
    .last()
    .click();
  await expect(page.getByText("#31")).toBeVisible();

  await page.goto("/roster");
  await page.getByRole("button", { name: "Add member" }).click();
  await page.getByLabel("Name").fill("Test Player");
  await page
    .getByRole("button", { name: "Add member", exact: true })
    .last()
    .click();
  await expect(page.getByText("Test Player")).toBeVisible();
});

test("notifications, profile, and checklist export controls have outcomes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(
    page.getByText(/issued jerseys still need to be returned/),
  ).toBeVisible();

  await page.getByRole("button", { name: /Kofi Asante/ }).click();
  await expect(page.getByRole("link", { name: "Open roster" })).toBeVisible();

  await page.goto("/games/game-titans");
  await page.getByRole("button", { name: "Copy plain text" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
});
