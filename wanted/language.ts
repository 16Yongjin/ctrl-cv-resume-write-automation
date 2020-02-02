import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickText, clickHasText, clickXPath, click$x } from "../utils";
import { languageList } from "./languageHelpers";

const fillLanguage = (page: Page) => async ({ languages }: IResumeData) => {
  const filteredLanguages = languages.filter(l =>
    languageList.includes(l.language)
  );

  for (let index = 0; index < filteredLanguages.length; index++) {
    const language = languages[index];

    const parentPath = `.language_certs .list-group-item:nth-of-type(1)`;
    const parentXPath = `//div[contains(@class, "language_certs")]//li[contains(@class, "list-group-item")][1]`;

    console.log("어학 추가", index + 1);

    await page.waitForXPath(
      '//*[contains(@class, "language_certs")]//button[text()="+ 추가"][not(@disabled)]'
    );
    await clickText(page)(".language_certs", "button")("+ 추가");
    await page.waitFor(
      `.language_certs .list-group-item:nth-of-type(${index + 1})`
    );

    console.log("언어 선택");

    await clickText(page)(parentXPath, "span")("언어");
    await page.waitFor(".dropdown-menu");
    await clickHasText(page)(".dropdown-menu", "li")(language.language);

    // console.log("언어 수준 선택");
    // await clickText(page)(parentXPath, "span")("수준");
    // await page.waitFor(".dropdown-menu");
    // await clickHasText(page)(".dropdown-menu", "li")("유창함");

    await clickText(page)(parentXPath, "button")("+ 어학시험 추가");
    await page.waitFor(`${parentPath} .list-group-item`);
    await page.type(`${parentPath} .title`, language.languageExamName);
    await page.type(
      `${parentPath} .level`,
      language.languageExamScore || language.languageExamLevel
    );
    await page.type(
      `${parentPath} .issued_time`,
      language.languageExamObtainDate
    );
  }
};

export default fillLanguage;
