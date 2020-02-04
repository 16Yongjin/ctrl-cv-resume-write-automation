import { clickAll, fill } from "./../utils";
import { jobCategory } from "./privacyHelpers";
import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import {
  clickText,
  clickHasText,
  clickXPath,
  click$x,
  clickEval
} from "../utils";

const select = (page: Page) => async (selector: string, value: string) => {
  await page.waitForSelector(selector);
  await page.click(selector);
  await page.select(selector, value);
};

const fillPrivacy = (page: Page) => async ({ privacy }: IResumeData) => {
  try {
    await page.waitFor("button.jply_modal_btn", { timeout: 2000 });
    await clickEval(page)("button.jply_modal_btn");
    console.log("모달창 끔");
  } catch {}

  console.log("이름 입력");
  await fill(page)(".input_resume_name_kr", privacy.name);
  console.log("이메일 입력");
  await fill(page)(".input_resume_email", privacy.email);
  console.log("전화번호 입력");
  await fill(page)(".input_resume_phone", privacy.phone);

  console.log("직종 선택");
  await page.select(".rsm_body > .rsm_half_cell:nth-child(1) select", "11600");

  console.log("세부직종 선택");
  await page.select(".rsm_body > .rsm_half_cell:nth-child(2) select", "11605");

  console.log("경력 선택");
  await page.select(".rsm_cont_bd > .rsm_section:nth-child(4) select", "1");

  console.log("스킬 초기화");
  await clickAll(page)(".tagging_wrap .ico_delete");

  console.log("스킬 등록");
  // const skills = ["test1", "test2", "test3"];
  // for (const skill of skills) {
  //   await page.type("#rtage", skill);
  //   await page.waitFor(".value_none", { visible: true });
  //   await page.click(".value_none");
  // }
};

export default fillPrivacy;
