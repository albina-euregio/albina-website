import { test, expect } from "@playwright/test";

test("bulletin/2018-12-04", async ({ page }) => {
  const details = page.locator(".bulletin-map-details");
  const pictos = details.locator(".bulletin-report-picto");

  await page.goto("/bulletin/2018-12-04");
  await page.goto("/bulletin/2018-12-04?region=IT-32-TN-12");
  await details.waitFor({ state: "visible" });
  await expect(details).toHaveText(/Prealps/);
  await expect(pictos).toHaveCount(2);
  await expect(pictos.getByAltText("Danger level: No snow")).toHaveAttribute(
    "src",
    "/images/pro/warning-pictos/levels_0_0.webp"
  );
  await expect(pictos.getByAltText("Favourable situation")).toHaveAttribute(
    "src",
    "/images/pro/avalanche-problems/favourable_situation.webp"
  );

  await page.goto("/bulletin/2018-12-04?region=AT-07-14");
  await details.waitFor({ state: "visible" });
  await expect(details).toHaveText(/Northern Oetz and Stubai Alps/);
  await expect(pictos).toHaveCount(2);
  await expect(pictos.getByAltText("Danger level: 1–low")).toHaveAttribute(
    "src",
    "/images/pro/warning-pictos/levels_1_1.webp"
  );
  await expect(pictos.getByAltText("Wind slab problem")).toHaveAttribute(
    "src",
    "/images/pro/avalanche-problems/wind_slab.webp"
  );
});
