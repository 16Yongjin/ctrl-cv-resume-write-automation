import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import {
  clickHasText,
  clickText,
  existSelector,
  existXPath,
  findInList,
  click$x
} from "../utils";
import { languageSelects } from "./languageHelpers";

const fillLanguage = (page: Page) => async ({ languages }: IResumeData) => {
  const filteredLanguages = languages.filter(l =>
    languageSelects.includes(l.language)
  );
  // 어학 입력 페이지로 이동
  await page.goto(
    "https://www.saramin.co.kr/zf_user/member/profile/language-exam-write"
  );

  // 어학 개수만큼 입력칸 추가
  for (let index = 0; index < filteredLanguages.length - 1; index++) {
    await page.click(".btn_resume_add");
  }

  for (let index = 0; index < filteredLanguages.length; index++) {
    const language = filteredLanguages[index];

    const parentPath = `.tpl_row:nth-of-type(${index + 1})`;
    const parentXPath = `div[contains(@class, "tpl_row")][${index + 1}]`;
    const inputPath = id => `${parentPath} input[id^=${id}]`;

    console.log("언어 종류 선택");

    // await clickText(page)(parentXPath, "button")("언어 선택");
    await click$x(page)(`//${parentXPath}//button[text()="언어 선택"]`);

    await clickText(page)(".open", "a")(language.language);

    console.log("시험종류 입력");
    // await page.click('input[id^=lang_exam_nm]')
    await page.type(inputPath("lang_exam_nm"), "");
    await page.waitForSelector(".area_auto_search");
    await clickText(page)(".auto_job_name")(language.languageExamName);

    // 점수 입력
    const hasExamScore = await existSelector(page)(
      `${parentPath} input:not(.disabled)[id^=lang_exam_score]`
    );

    if (hasExamScore) {
      await page.type(inputPath("lang_exam_score"), language.languageExamScore);
    }

    // 급수 입력
    const hasExamLevel = await existXPath(page)(
      `//${parentXPath}//button[not(@disabled) and contains(text(), "급수")]`
    );

    if (hasExamLevel) {
      await clickHasText(page)(parentXPath, "button")("급수");
      await clickText(page)(".open", "a")(language.languageExamLevel);
    }

    // 취득여부 선택
    await clickText(page)(parentXPath, "button")("취득여부");
    await clickText(page)(".open", "a")("취득 (PASS)");

    // 취득일자 입력
    await page.type(
      inputPath("lang_exam_obtain_dt"),
      language.languageExamObtainDate
    );
  }
};

export default fillLanguage;
