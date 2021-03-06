import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { IResumeData } from "../IResume";

const login = async ({ id, pw }: IResumeData): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.jobkorea.co.kr/Login/Login_Tot.asp");

  // 로그인
  await page.type("#M_ID", id);
  await page.type("#M_PWD", pw);
  await page.click(".btLoin");

  return page;
};

export default login;
