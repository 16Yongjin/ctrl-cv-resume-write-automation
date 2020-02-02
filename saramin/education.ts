import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickHasText, clickText } from "../utils";
import { majorCategories } from "./educationHelpers";

const fillEducation = (page: Page) => async ({ educations }: IResumeData) => {
  // 학력사항 입력 페이지로 이동
  await page.goto(
    "https://www.saramin.co.kr/zf_user/member/profile/school-write"
  );

  // [ "학력 선택", "초등학교 졸업", "중학교 졸업", "고등학교 졸업", "대학(2,3년)", "대학교(4년)", "대학원(석사)", "대학원(박사)", "직업전문학원/학교 및 기타학력" ]

  for (let index = 0; index < educations.length - 1; index++) {
    await page.click(".area_resume_btn button");
  }

  for (let index = 0; index < educations.length; index++) {
    const education = educations[index];

    const parentPath = `.tpl_row:nth-of-type(${index + 1})`;
    const parentXPath = `div[contains(@class, "tpl_row")][${index + 1}]`;
    const inputPath = id => `${parentPath} input[id^=${id}]`;

    // 대학교(4년제) 선택
    await clickHasText(page)(parentXPath, "button")("학력");
    await clickHasText(page)(parentXPath, ".open", "a")(
      education.educationLevel
    );

    // 학교이름 입력 후 자동입력 항목 선택
    await page.type(inputPath("school_nm"), education.schoolName);
    await page.waitForSelector(".link_directly");
    await page.click(".link_directly");

    // 서울 선택
    // ["서울", "경기", "광주", "대구", "대전", "부산", "울산", "인천", "강원", "경남", "경북", "전남", "전북", "충북", "충남", "제주", "전국", "세종", "아시아·중동", "북·중미", "남미", "유럽", "오세아니아", "아프리카", "남극대륙", "기타해외"]
    console.log("지역 선택");
    await clickHasText(page)(parentXPath, "button")("지역 선택");
    await page.waitFor(".open");
    await clickHasText(page)(".open", "a")(education.schoolLocation);

    // 어문학 선택

    console.log("전공 선택");
    await clickHasText(page)(parentXPath, ".area_school_major", "button")(
      "전공계열 선택"
    );
    await page.waitFor(".open");

    const hasMajorCategory = majorCategories.includes(education.majorCategory);

    await clickHasText(page)(parentXPath, ".area_school_major", "a")(
      hasMajorCategory ? education.majorCategory : "직접입력"
    );

    await page.type(inputPath("school_major_15"), education.majorName);

    if (!hasMajorCategory) {
      console.log("전공계열 직접입력");

      await page.type(
        inputPath("school_major_department_text"),
        education.majorCategory
      );
    }

    if (education.hasMinor) {
      // 이중 전공 선택하기
      await clickHasText(page)(parentXPath, "button")("전공 추가하기");
      await page.waitForSelector(`${parentPath} .resume_row.area_school_minor`);

      await clickHasText(page)(parentXPath, "button")("전공구분선택");
      await page.waitFor(".open");
      await clickHasText(page)(".open", "a")(education.minorType);

      // 컴퓨터 관련 이중전공 선택
      await clickHasText(page)(parentXPath, ".area_school_minor", "button")(
        "전공계열 선택"
      );
      await page.waitFor(".open");

      const hasMinorCategory = majorCategories.includes(
        education.minorCategory
      );

      await clickHasText(page)(parentXPath, ".area_school_minor", "a")(
        hasMinorCategory ? education.minorCategory : "직접입력"
      );

      if (!hasMinorCategory) {
        console.log("부전공 계열 직접입력");
        await page.type(
          inputPath("school_minor_department_text"),
          education.minorCategory
        );
      }

      // 이중전공 입력
      await page.type(inputPath("school_minor_15"), education.minorName);
    }

    // 입학
    console.log("입학 일자");
    await page.type(inputPath("school_entrance_dt"), education.schoolEntrance);
    // 졸업
    console.log("졸업 일자");
    await page.type(
      inputPath("school_graduation_dt"),
      education.schoolGraduation
    );

    await clickText(page)(parentXPath, "button")("졸업");
    await page.waitFor(".open");
    await clickText(page)(".open", "a")(education.educationState);

    console.log("학점 입력");
    await page.type(inputPath("school_major_avg"), education.gpa);

    await clickHasText(page)(parentXPath, "button")("기준학점선택");
    await page.waitFor(".open");
    await clickHasText(page)(".open", "a")(education.gpaScale);
  }

  // 작성완료 버튼
  // await clickHasText(page)("button", "작성완료");
};

export default fillEducation;
