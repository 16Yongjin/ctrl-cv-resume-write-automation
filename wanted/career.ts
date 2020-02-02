import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickText, clickHasText, clickXPath, click$x } from "../utils";

const fillCareer = (page: Page) => async ({ careers }: IResumeData) => {
  for (let index = 0; index < careers.length; index++) {
    const career = careers[index];

    const parentPath = `.careers .list-group-item:nth-of-type(1)`;
    const parentXPath = `//div[contains(@class, "careers")]//li[contains(@class, "list-group-item")][1]`;

    console.log("경력 추가", index + 1);

    await page.waitForXPath(
      '//*[contains(@class, "careers")]//button[text()="+ 추가"][not(@disabled)]'
    );
    await clickText(page)(".careers", "button")("+ 추가");
    await page.waitFor(`.careers .list-group-item:nth-of-type(${index + 1})`);

    console.log("경력 기간 입력");
    const startYear = career.careerStart.substring(0, 4);
    const startMonth = career.careerStart.substring(4, 6);
    await page.type(`${parentPath} .start-time .year`, startYear);
    await page.type(`${parentPath} .start-time .month`, startMonth);

    const endYear = career.careerStart.substring(0, 4);
    const endMonth = career.careerStart.substring(4, 6);
    await page.type(`${parentPath} .end-time .year`, endYear);
    await page.type(`${parentPath} .end-time .month`, endMonth);

    if (!career.retired) {
      await page.click(`${parentPath} input[label="현재 재직중"]`);
    }

    console.log("회사명 입력");
    await page.type(`${parentPath} .company_name`, career.companyName);

    console.log("부서명 / 직책 입력");
    await page.type(
      `${parentPath} .title`,
      [career.jobDepartment, career.jobGrade, career.jobDuty]
        .filter(i => i)
        .join(" / ")
    );
  }
};

export default fillCareer;
