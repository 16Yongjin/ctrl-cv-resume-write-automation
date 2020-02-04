import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { IResumeData } from "../IResume";

const login = async ({ id, pw }: IResumeData): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.jobplanet.co.kr/users/sign_in");

  // 로그인
  await page.type("#user_email", id);
  await page.type("#user_password", pw);
  await page.click(".btn_sign_up");
  await page.waitForNavigation();

  return page;
};

export default login;
