import { findInList, clickHasInnerText } from "./../utils";
import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickText, existSelector } from "../utils";

const fillLicense = (page: Page) => async ({ licenses }: IResumeData) => {
  // 자격증 입력 페이지로 이동
  await page.goto(
    "https://www.saramin.co.kr/zf_user/member/profile/license-write"
  );

  for (let index = 0; index < licenses.length - 1; index++) {
    await page.click(".btn_resume_add");
  }

  for (let index = 0; index < licenses.length; index++) {
    const license = licenses[index];

    const parentPath = `.tpl_row:nth-of-type(${index + 1})`;
    const parentXPath = `div[contains(@class, "tpl_row")][${index + 1}]`;
    const inputPath = id => `${parentPath} input[id^=${id}]`;

    // 자격증명 입력
    console.log("자격증명 입력");
    await page.type(inputPath("license_nm"), license.licenseName);
    await page.waitForSelector(".area_auto_search");

    const licenseName = await findInList(page)(
      ".auto_license_name",
      license.licenseName
    );
    console.log("licenseName", licenseName);

    if (licenseName) {
      await clickHasInnerText(page)(".auto_license_name")(licenseName);
    } else {
      await page.click(".link_directly");
      // 정보가 없는 자격증이면 직접 발행기관 입력
      await page.type(
        inputPath("license_public_org"),
        license.licensePublicOrg
      );
    }

    // 합격구분 선택, 최종합격
    console.log("합격구분 선택");
    await clickText(page)(parentXPath, "button")("합격구분 선택");
    await clickText(page)(".open", "a")("최종합격");

    // 취득일 입력
    console.log("취득일 입력");
    await page.type(
      inputPath("license_obtain_dt_15"),
      license.licenseObtainDate
    );
  }
};

export default fillLicense;
