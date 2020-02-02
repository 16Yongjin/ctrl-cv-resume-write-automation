import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";
import { IResumeData } from "../IResume";

const login = async ({ id, pw }: IResumeData): Promise<Page> => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.wanted.co.kr/cv/intro");

  // 로그인
  await page.click(".signUpButton");

  await page.type("input[type=email]", id);
  await page.keyboard.press("Enter");

  await page.waitFor("input[type=password]");
  await page.type("input[type=password]", pw);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  return page;
};

export default login;
