import { pickTime } from "./jobplanetHelpers";
import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import {
  clickText,
  clickHasText,
  clickXPath,
  click$x,
  existXPath,
  fill
} from "../utils";

// const puppeteer = require("puppeteer");
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.goto("https://www.jobplanet.co.kr/profile/resumes");

//   await page.setViewport({ width: 1368, height: 802 });

//   await page.waitForSelector(
//     ".rsm_section:nth-child(1) > div > .rsm_body > .flexible_resume_row:nth-child(1) > .resume_left_flexible > .group_date > .month_picker:nth-child(1) > .input_resume"
//   );
//   await page.click(
//     ".rsm_section:nth-child(1) > div > .rsm_body > .flexible_resume_row:nth-child(1) > .resume_left_flexible > .group_date > .month_picker:nth-child(1) > .input_resume"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );
//   await page.click(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(7) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(7) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(3) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(3) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".rsm_section:nth-child(1) > div > .rsm_body > .flexible_resume_row:nth-child(1) > .resume_left_flexible > .group_date > .month_picker:nth-child(3) > .input_resume"
//   );
//   await page.click(
//     ".rsm_section:nth-child(1) > div > .rsm_body > .flexible_resume_row:nth-child(1) > .resume_left_flexible > .group_date > .month_picker:nth-child(3) > .input_resume"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );
//   await page.click(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(11) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(11) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(12) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(12) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".flexible_resume_row:nth-child(2) > .resume_left_flexible > .group_date > .month_picker:nth-child(1) > .input_resume"
//   );
//   await page.click(
//     ".flexible_resume_row:nth-child(2) > .resume_left_flexible > .group_date > .month_picker:nth-child(1) > .input_resume"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );
//   await page.click(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(7) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(7) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(4) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(4) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".flexible_resume_row:nth-child(2) > .resume_left_flexible > .group_date > .month_picker:nth-child(3) > .input_resume"
//   );
//   await page.click(
//     ".flexible_resume_row:nth-child(2) > .resume_left_flexible > .group_date > .month_picker:nth-child(3) > .input_resume"
//   );

//   await page.waitForSelector(
//     ".group_date > .month_picker > .date_picker > .dt_hd > .title"
//   );
//   await page.click(
//     ".group_date > .month_picker > .date_picker > .dt_hd > .title"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );
//   await page.click(
//     ".month_picker > .date_picker > .dt_hd > .left_arrow > .ico_go2"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(11) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(11) > .btn_date"
//   );

//   await page.waitForSelector(
//     ".month_picker > .date_picker > ul > .item:nth-child(12) > .btn_date"
//   );
//   await page.click(
//     ".month_picker > .date_picker > ul > .item:nth-child(12) > .btn_date"
//   );

//   await browser.close();
// })();

const fillEducation = (page: Page) => async ({ educations }: IResumeData) => {
  for (let index = 0; index < educations.length; index++) {
    await clickText(page)("button")("+ 학력 추가");
    try {
      await page.waitForNavigation({
        waitUntil: "networkidle0",
        timeout: 2000
      });
    } catch {}
  }

  for (let index = 0; index < educations.length; index++) {
    const education = educations[index];

    const parentPath = `.rsm_section:nth-child(1) .flexible_resume_row:nth-child(${index +
      1})`;

    console.log("연도, 달 입력");
    const startMonthPicker = `${parentPath} .month_picker:nth-child(1) .input_resume`;
    await pickTime(page)(startMonthPicker, education.schoolEntrance);

    if (education.educationState === "재학중") {
      await page.click(`${parentPath} .cscheck`);
    } else {
      const endMonthPicker = `${parentPath} .month_picker:nth-child(3) .input_resume`;
      await pickTime(page)(endMonthPicker, education.schoolGraduation);
    }

    console.log("학교명 입력");
    await page.type(`${parentPath} .input_resume_text1`, education.schoolName);

    console.log("전공명 입력");
    await page.type(
      `${parentPath} .input_resume_text2`,
      [education.majorName, education.minorName].filter(i => i).join(", ")
    );
  }
};

export default fillEducation;
