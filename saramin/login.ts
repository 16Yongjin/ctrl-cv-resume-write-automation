import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { IResumeData } from "../IResume";

const login = async ({ id, pw }: IResumeData): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.saramin.co.kr/zf_user/auth?ut=p");

  // 로그인
  await page.type("#id", id);
  await page.type("#password", pw);
  await page.click(".btn-login");

  return page;
};

export default login;
