import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { IResumeData } from "../IResume";

const login = async ({ id, pw }: IResumeData): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.saramin.co.kr");

  // 로그인
  await page.type("#login_person_id", id);
  await page.type("#login_person_pwd", pw);
  await page.click(".btn_login");
  await page.waitForNavigation();

  return page;
};

export default login;
