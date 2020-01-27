import { Page } from "puppeteer";

import { IResumeData } from "../IResume";
import {
  clickAll,
  clickEval,
  fill,
  existSelector,
  clickText,
  findInList,
  fillIfEmpty,
  isVisible
} from "../utils";
import { resetForm } from "./jobkoreaUtils";

const fillLanguage = (page: Page) => async ({ languages }: IResumeData) => {
  await resetForm(page)("formLanguage", languages.length);

  for (let index = 0; index < languages.length; index++) {
    const language = languages[index];

    const parentPath = `#language_containers .container${index + 1}`;
    const inputPath = startId => `${parentPath} input[id^="${startId}"]`;
    const selectPath = cls => `${parentPath} .${cls} .buttonChoose`;

    console.log("==== 어학 추가 ====", index + 1);

    console.log("공인시험 선택");
    await clickEval(page)(selectPath("dropdown-category"));

    await page.waitForSelector(".visible");
    await clickText(page)(".visible", "span")("공인시험");

    console.log("언어 선택");
    await clickEval(page)(selectPath("dropdown-language-name"));
    await page.waitForSelector(".visible");
    const languageName = await findInList(page)(
      ".visible span",
      language.language
    );
    await clickText(page)(".visible", "span")(languageName || "직접입력");

    if (!languageName) {
      console.log("언어 이름 직접입력");

      await page.type(inputPath("Language_Lang_Etc"), language.language);
    }

    console.log("시험 선택");

    const hasExamSelect = await isVisible(page)(
      `${parentPath} .dropdown-language-category`
    );

    if (hasExamSelect) {
      console.log("시험 선택 있음");

      await page.click(selectPath("dropdown-language-category"));

      const examName = await findInList(page)(
        ".visible span",
        language.languageExamName
      );

      console.log("examName", examName);

      await clickText(page)(".visible", "span")(examName || "직접입력");

      if (!examName) {
        console.log("시험 이름 직접입력");
        await page.type(
          inputPath("Language_Test_Etc"),
          language.languageExamName
        );
      }
    } else {
      // 알려진 시험이 없는 언어임
      await page.type(
        inputPath("Language_Test_Etc"),
        language.languageExamName
      );
    }

    /*
      시험 점수 등록 방식은 3가지
      점수만 -> '.dropdown-grade-category' 안 보임
      급수만 -> '.dropdown-language-grade' 만 보임
      듣보라서 점수/급수 선택 -> '.dropdown-grade-category' 보임
    */

    const hasGradeCategory = await isVisible(page)(
      `${parentPath} .dropdown-grade-category`
    );
    const hasLangGrade = await isVisible(page)(
      `${parentPath} .dropdown-language-grade`
    );

    if (hasGradeCategory) {
      // 듣보 시험
      await page.click(selectPath("dropdown-grade-category"));

      await clickText(page)(".visible", "span")(
        language.languageExamScore ? "점" : "급"
      );
      await page.type(
        inputPath("Language_Test1_Point_I"),
        language.languageExamScore || language.languageExamLevel
      );
    } else if (hasLangGrade) {
      // 급수제
      await clickEval(page)(selectPath("dropdown-language-grade"));
      await clickText(page)(".visible", "span")(language.languageExamLevel);
    } else {
      // 점수제
      await page.type(
        inputPath("Language_Test1_Point_I"),
        language.languageExamScore
      );
    }

    await isVisible(page)(`${parentPath} .dropdown-language-grade`);

    await page.type(
      inputPath("Language_Test_YYMM"),
      language.languageExamObtainDate
    );
  }

  return null;
};

export default fillLanguage;
