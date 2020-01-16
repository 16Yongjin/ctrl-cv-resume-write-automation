const puppeteer = require("puppeteer");

const clickXPath = page => async selector => {
  await page.waitForXPath(selector);
  const [element] = await page.$x(selector);

  if (element) {
    console.log(selector, "클릭");
    await element.click();
  }

  return null;
};

const clickContainsText = page => async (selector, text) => {
  selector = selector.startsWith("//") ? selector : `//${selector}`;

  return clickXPath(page)(`${selector}[contains(text(), '${text}')]`);
};

const clickText = page => async (selector, text) => {
  selector = selector.startsWith("//") ? selector : `//${selector}`;

  return clickXPath(page)(`${selector}[text()='${text}']`);
};

const clickText2 = page => (...selectors) => text => {
  selectors = selectors
    .map(s => (s.startsWith(".") ? `\*[contains(@class, "${s.slice(1)}")]` : s))
    .join("//");

  return clickXPath(page)(`//${selectors}[text()="${text}"]`);
};

const existSelector = page => async selector =>
  (await page.$(selector)) !== null;

const userData = {
  id: "autoresume", // 아이디
  pw: "autoresume1", // 비밀번호
  licenseName: "정보처리산업기사", // 자격증명,
  licensePublicOrg: "발행기관", // 발행기관
  licenseObtainDate: "201906" // 획득일자
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1368, height: 802 });
  await page.goto("https://www.saramin.co.kr");

  // 로그인
  await page.type("#login_person_id", userData.id);
  await page.type("#login_person_pwd", userData.pw);
  await page.click(".btn_login");
  await page.waitForNavigation();

  // 학력사항 입력 페이지로 이동
  await page.goto(
    "https://www.saramin.co.kr/zf_user/member/profile/license-write"
  );

  // 자격증명 입력
  console.log("자격증명 입력");

  await page.type("input[id^=license_nm]", userData.licenseName);
  await page.waitForSelector(".area_auto_search");

  const licenseExist = await existSelector(page)(".list_auto_search");
  if (licenseExist) {
    await page.click(".auto_license_name");
  } else {
    await page.click(".link_directly");
    // 정보가 없는 자격증이면 직접 발행기관 입력
    await page.type("input[id^=license_public_org]", userData.licensePublicOrg);
  }

  // 합격구분 선택, 최종합격
  console.log("합격구분 선택");
  await clickText2(page)("button")("합격구분 선택");
  await clickText2(page)(".open", "a")("최종합격");

  // 취득일 입력
  console.log("취득일 입력");
  await page.type(
    "input[id^=license_obtain_dt_15]",
    userData.licenseObtainDate
  );
};

main();
