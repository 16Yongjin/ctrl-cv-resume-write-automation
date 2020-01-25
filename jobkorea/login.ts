import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { IResumeData } from "../IResume";

const login = async ({ id, pw }: IResumeData): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.jobkorea.co.kr/");

  // 로그인
  await page.click("button[title='개인회원 로그인']");
  await page.type("#lb_id", id);
  await page.type("#lb_pw", pw);
  await page.click("#divLoginForm .btnLogin");

  return page;
};

export default login;
