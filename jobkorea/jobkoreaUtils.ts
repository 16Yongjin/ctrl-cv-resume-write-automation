import { Page } from "puppeteer";

import { clickAll, existSelector } from "../utils";

export const resetForm = (page: Page) => async (
  formId,
  formLength
): Promise<void> => {
  const licenseExisted = await existSelector(page)(
    `button.button-field-remove[data-linked_form_id="${formId}"]`
  );

  if (!licenseExisted) {
    await page.click(`button[data-linked_form_id="${formId}"]`);
  }

  console.log(`${formId} 초기화`);
  await clickAll(page)(`#${formId} .buttonDeleteField`);

  for (let index = 0; index < formLength; index++) {
    await page.click(`#${formId} .buttonAddField`);
  }

  return null;
};
