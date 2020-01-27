import { Page } from "puppeteer";

import { IResumeData } from "../IResume";
import { fill, existSelector, clickText } from "../utils";
import { resetForm } from "./jobkoreaUtils";

const fillCareer = (page: Page) => async ({ careers }: IResumeData) => {
  await resetForm(page)("formCareer", careers.length);

  for (let index = 0; index < careers.length; index++) {
    const career = careers[index];

    const parentPath = `#career_containers .container${index + 1}`;
    const inputPath = startId => `${parentPath} input[id^="${startId}"]`;

    console.log("==== 경력 추가 ====", index + 1);

    console.log("회사 이름 입력");
    await fill(page)(inputPath("Career_C_Name"), career.companyName);
    await page.waitForSelector(".autocomplete:not(.hidden)");
    const hasCompany = await existSelector(page)(
      ".autocomplete:not(.hidden) li:nth-child(1) button"
    );
    if (hasCompany) {
      await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
    } else {
      console.log("회사 이름 직접 입력");
      await page.click(".autocomplete:not(.hidden) .buttonDirect");
    }

    console.log("부서명 입력");
    await page.type(inputPath("Career_C_Part"), career.jobDepartment);

    console.log("입사, 퇴사일 입력");
    await page.type(inputPath("Career_CSYM"), career.careerStart);
    await page.type(inputPath("Career_CEYM"), career.careerEnd);

    if (!career.retired) {
      await page.click(inputPath("Career_RetireSt"));
    }

    // ['사원','주임/계장','대리','과장','차장','부장','임원','연구원','주임연구원','선임연구원','책임연구원','수석연구원','연구소장','사원','주임/계장','대리','과장','차장','부장','임원','연구원','주임연구원','선임연구원','책임연구원','수석연구원','연구소장']
    console.log("직급/직책 선택");
    await page.click(`${parentPath} .dropdown-career-position .buttonChoose`);
    await page.waitForSelector(".visible");
    await clickText(page)(".visible", "label")(career.jobGrade);
    await clickText(page)(".visible", "label")(career.jobDuty);

    // if (career.jobGrade === '프리랜서') {
    //   await page.click('.visible .freelancer input')
    // }

    await page.click(".visible .buttonConfirm");

    // 이건 너무 많아서 스킵
    // console.log("직무 선택");
    // await page.click(`${parentPath} .input-career-duty .buttonChoose`);
    // await fill(page)('.Career_JobSearchText')

    console.log("담당업무 입력");
    await page.type(
      `${parentPath} textarea[id^=Career_Prfm_Prt]`,
      career.jobContents
    );
  }
};

export default fillCareer;
