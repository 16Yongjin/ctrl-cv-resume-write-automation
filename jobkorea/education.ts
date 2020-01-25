import { Page } from "puppeteer";

import { IResumeData } from "../IResume";
import { clickAll, fill, existSelector, clickText } from "../utils";

const fillEducation = (page: Page) => async ({ educations }: IResumeData) => {
  const educatoinExisted = await existSelector(page)(
    'button.button-field-remove[data-linked_form_id="formEducation"]'
  );

  if (!educatoinExisted) {
    await page.click('button[data-linked_form_id="formCareer"]');
  }

  console.log("학력 초기화");
  await clickAll(page)("#formEducation .buttonDeleteField");

  for (let index = 0; index < educations.length; index++) {
    await page.click("#school_addbutton");
  }

  for (let index = 0; index < educations.length; index++) {
    const education = educations[index];

    const parentPath = `#school_containers .container${index + 1}`;
    const inputPath = startId => `${parentPath} input[id^="${startId}"]`;

    console.log("==== 학력 추가 ====", index + 1);

    console.log("학력 선택");
    await page.click(
      `${parentPath} .dropdown-education-category .buttonChoose`
    );
    console.log("학교구분 누름");
    await page.waitForSelector(".visible");

    await clickText(page)(".visible", "span")(education.educationLevel); // '고등학교', '대학교(2,3년)', '대학교(4년)', '대학원'

    console.log("학교 이름 입력");
    await fill(page)(inputPath("UnivSchool_Schl_Name"), education.schoolName);
    await page.waitForSelector(".autocomplete:not(.hidden)");
    const hasSchool = await existSelector(page)(
      ".autocomplete:not(.hidden) li:nth-child(1) button"
    );
    if (hasSchool) {
      await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
    } else {
      console.log("학교 이름 직접 입력");
      await page.click(
        `${parentPath} div[id^=UnivSchoolautoComplete] .buttonDirect`
      );
    }

    if (education.educationLevel === "대학원") {
      console.log("학위 입력");
      await page.click(`${parentPath} .dropdown-edcation-degree .buttonChoose`);
      await page.waitForSelector(".visible");
      await clickText(page)(".visible", "span")(education.edcationDegree); // 석사, 박사, 석박사
    }

    console.log("입학/졸업 년월 입력");
    await page.type(inputPath("UnivSchool_Entc_YM"), education.schoolEntrance);
    await page.type(
      inputPath("UnivSchool_Grad_YM"),
      education.schoolGraduation
    );

    await page.click(`${parentPath} .dropdown-edcation-state .buttonChoose`);
    console.log("졸업상태 선택"); //  [ "졸업", "졸업예정", "재학중", "중퇴", "수료", "휴학" ]
    await clickText(page)(".visible", "span")(education.educationState);

    console.log("전공명 입력");
    await fill(page)(
      `${parentPath} input[id^=univmajor_0_0]`,
      education.majorName
    );
    await page.waitForSelector(".autocomplete:not(.hidden)");
    const hasMajor = !(await existSelector(page)(".autocomplete .notFound"));
    if (hasMajor) {
      await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
    } else {
      console.log("전공명 직접 입력");
      await page.click(
        `${parentPath} *[id^=UnivMajorAutoComplete] .buttonDirect`
      );
    }

    console.log("학점 입력");
    await page.type(inputPath("UnivSchool_Grade"), education.gpa);

    await page.click(`${parentPath} .dropdown-education-total .buttonChoose`);
    await clickText(page)(".visible", "span")(education.gpaScale);

    if (education.hasMinor) {
      await page.click(`${parentPath} .buttonEducationMajor`);
      await page.click(`${parentPath} .dropdown-education-major button`);
      await clickText(page)(".visible", "span")(education.minorType);

      await fill(page)(
        `${parentPath} .devOtherUnivMajorRow input[id^=univmajor]`,
        education.minorName
      );

      await page.waitForSelector(".autocomplete:not(.hidden)");

      const hasMinor = !(await existSelector(page)(".autocomplete .notFound"));

      if (hasMinor) {
        await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
      } else {
        console.log("부전공명 직접 입력");
        await page.click(".autocomplete:not(.hidden) .buttonDirect");
      }
    }
  }

  return null;
};

export default fillEducation;
