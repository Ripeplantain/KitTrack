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
