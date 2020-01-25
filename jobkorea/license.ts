import { Page } from "puppeteer";

import { IResumeData } from "../IResume";
import {
  clickAll,
  fill,
  existSelector,
  clickText,
  fillIfEmpty
} from "../utils";

const fillLicense = (page: Page) => async ({ licenses }: IResumeData) => {
  const licenseExisted = await existSelector(page)(
    'button.button-field-remove[data-linked_form_id="formLicense"]'
  );

  if (!licenseExisted) {
    await page.click('button[data-linked_form_id="formLicense"]');
  }

  console.log("자격증 초기화");
  await clickAll(page)("#formLicense .buttonDeleteField");

  for (let index = 0; index < licenses.length; index++) {
    await page.click("#formLicense .buttonAddField");
  }

  for (let index = 0; index < licenses.length; index++) {
    const license = licenses[index];

    const parentPath = `#license_containers .container${index + 1}`;
    const inputPath = startId => `${parentPath} input[id^="${startId}"]`;

    console.log("==== 자격증 추가 ====", index + 1);

    await fill(page)(inputPath("License_Search"), license.licenseName);
    await page.waitForSelector(".autocomplete:not(.hidden)");
    const hasCompany = await existSelector(page)(
      ".autocomplete:not(.hidden) li:nth-child(1) button"
    );
    if (hasCompany) {
      await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
    } else {
      console.log("자격증 이름 직접 입력");
      await page.click(".autocomplete:not(.hidden) .buttonDirect");
    }

    if (license.licensePublicOrg)
      await fill(page)(inputPath("License_Lc_Pub"), license.licensePublicOrg);
    else await page.type(inputPath("License_Lc_Pub"), license.licensePublicOrg);

    await page.type(inputPath("License_Lc_YYMM"), license.licenseObtainDate);
  }

  return null;
};

export default fillLicense;
