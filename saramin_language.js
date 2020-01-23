const puppeteer = require("puppeteer");

const {
  clickHasText,
  clickText,
  existSelector,
  existXPath
} = require("./utils");

const userData = {
  id: "autoresume", // 아이디
  pw: "autoresume1", // 비밀번호
  language: "일본어", // 언어
  languageExamName: "JLPT", //시험종류
  languageExamScore: "", // 점수
  languageExamLevel: "1", // 급수, 리스트에 없는 값이면 중단 에러
  languageExamObtainDate: "201906" // 취득일자
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
    "https://www.saramin.co.kr/zf_user/member/profile/language-exam-write"
  );

  console.log("언어 종류 선택");
  await clickText(page)("button")("언어 선택");
  await clickText(page)("a")(userData.language);

  console.log("시험종류 입력");
  // await page.click('input[id^=lang_exam_nm]')
  await page.type("input[id^=lang_exam_nm]", "");
  await page.waitForSelector(".area_auto_search");
  await clickText(page)(".auto_job_name")(userData.languageExamName);

  // 점수 입력
  const hasExamScore = await existSelector(page)(
    "input:not(.disabled)[id^=lang_exam_score]"
  );

  if (hasExamScore) {
    await page.type("input[id^=lang_exam_score]", userData.languageExamScore);
  }

  // 급수 입력
  const hasExamLevel = await existXPath(page)(
    '//button[not(@disabled) and contains(text(), "급수")]'
  );

  if (hasExamLevel) {
    await clickHasText(page)("button")("급수");
    await clickText(page)(".open", "a")(userData.languageExamLevel);
  }

  // 취득여부 선택
  await clickText(page)("button")("취득여부");
  await clickText(page)(".open", "a")("취득 (PASS)");

  // 취득일자 입력
  await page.type(
    "input[id^=lang_exam_obtain_dt]",
    userData.languageExamObtainDate
  );
};

main();
