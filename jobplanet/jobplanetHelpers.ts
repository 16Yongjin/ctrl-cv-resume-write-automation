import { existSelector } from "../utils";
import { Page } from "puppeteer";
import { existXPath, clickXPath } from "../utils";

const pickerXPath = d => `//*[contains(@class, "btn_date")][text()="${d}"]`;

export const pickTime = (page: Page) => async (pickerSelector, YYYYMM) => {
  const year = YYYYMM.slice(0, 4);
  const month = YYYYMM.slice(4).replace("0", "");

  await page.click(pickerSelector);

  for (let i = 0; i < 5; i++) {
    await page.click(".ico_go2");

    const hasYear = await existXPath(page)(pickerXPath(year));
    if (hasYear) {
      await clickXPath(page)(pickerXPath(year));
      break;
    }
  }

  await clickXPath(page)(pickerXPath(month));
};

export const resetForms = async (page: Page) => {
  console.log("양식 리셋");

  while (await existSelector(page)(".flexible_resume_row")) {
    const resumeForms = await page.$$(".flexible_resume_row");

    for (const form of resumeForms) {
      await form.hover();
      await page.waitFor(".ico_trash");
      const deleteBtn = await form.$(".ico_trash");
      if (!deleteBtn) continue;

      await deleteBtn.click();
      await page.waitFor(".resume_pop .btn_ty1");
      await page.click(".resume_pop .btn_ty1");
      try {
        await page.waitForNavigation({
          waitUntil: "networkidle0",
          timeout: 2000
        });
      } catch {}
    }
  }
};
