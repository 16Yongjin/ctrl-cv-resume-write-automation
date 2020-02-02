import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickText, clickHasText, clickXPath, click$x } from "../utils";

const fillEducation = (page: Page) => async ({ educations }: IResumeData) => {
  for (let index = 0; index < educations.length; index++) {
    const education = educations[index];

    const parentPath = `.educations .list-group-item:nth-of-type(1)`;
    const parentXPath = `//div[contains(@class, "educations")]//li[contains(@class, "list-group-item")][1]`;

    console.log("학력 추가", index + 1);

    await page.waitForXPath(
      '//*[contains(@class, "educations")]//button[text()="+ 추가"][not(@disabled)]'
    );
    await clickText(page)(".educations", "button")("+ 추가");
    await page.waitFor(
      `.educations .list-group-item:nth-of-type(${index + 1})`
    );

    console.log("재학 기간 입력");
    const startYear = education.schoolEntrance.substring(0, 4);
    const startMonth = education.schoolEntrance.substring(4, 6);
    await page.type(`${parentPath} .start-time .year`, startYear);
    await page.type(`${parentPath} .start-time .month`, startMonth);

    const endYear = education.schoolGraduation.substring(0, 4);
    const endMonth = education.schoolGraduation.substring(4, 6);
    await page.type(`${parentPath} .end-time .year`, endYear);
    await page.type(`${parentPath} .end-time .month`, endMonth);

    if (education.educationState === "재학중") {
      await page.click(`${parentPath} input[label="현재 재학중"]`);
    }

    console.log("학교명 입력");
    await page.type(`${parentPath} .school_name`, education.schoolName);

    console.log("전공 입력");
    await page.type(
      `${parentPath} .major`,
      [education.majorName, education.minorName].filter(i => i).join(", ")
    );
  }
};

export default fillEducation;
