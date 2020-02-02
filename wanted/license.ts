import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickText, clickHasText, clickXPath, click$x } from "../utils";

const fillLicense = (page: Page) => async ({ licenses }: IResumeData) => {
  for (let index = 0; index < licenses.length; index++) {
    const license = licenses[index];

    const parentPath = `.activities .list-group-item:nth-of-type(1)`;
    const parentXPath = `//div[contains(@class, "activities")]//li[contains(@class, "list-group-item")][1]`;

    console.log("수상 및 기타 추가", index + 1);
    await page.waitForXPath(
      '//*[contains(@class, "activities")]//button[text()="+ 추가"][not(@disabled)]'
    );
    await clickText(page)(".activities", "button")("+ 추가");
    await page.waitFor(
      `.activities .list-group-item:nth-of-type(${index + 1})`
    );

    console.log("일자 추가");
    const startYear = license.licenseObtainDate.substring(0, 4);
    const startMonth = license.licenseObtainDate.substring(4, 6);
    await page.type(`${parentPath} .start-time .year`, startYear);
    await page.type(`${parentPath} .start-time .month`, startMonth);

    console.log("자격증명 입력");

    await page.type(`${parentPath} .title`, license.licenseName);
    await page.type(`${parentPath} .description`, license.licensePublicOrg);
  }
};

export default fillLicense;
