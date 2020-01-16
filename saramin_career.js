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

const userData = {
  id: "autoresume", // 아이디
  pw: "autoresume1", // 비밀번호
  companyName: "네이버랩스", // 회사 이름
  careerStart: "201603", // 입사일자(YYYYMM)
  careerEnd: "202003", // 퇴사일자(YYYYMM)
  companyLocation: "서울", // 회사 위치
  retired: true, // 퇴사 or 재직중
  retireReason: "근무조건", // 퇴사이유
  jobGrade: "대리", // 직급
  jobDuty: "팀장", // 직책
  jobCategory: "웹개발", // 직종
  jobDepartment: "프런트엔드 시스템", // 담당 부서
  jobContents: "담당업무" // 담당 업무
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
    "https://www.saramin.co.kr/zf_user/member/profile/career-write"
  );

  // 회사이름 입력 후 자동입력 항목 선택
  console.log("회사명 입력");
  await page.type("input[id^=career_company_nm]", userData.companyName);
  await page.waitForSelector(".auto_company_name");
  await page.click(".link_directly");

  // 입사 & 퇴사
  console.log("입사, 퇴사 일자");
  await page.type("input[id^=career_start_dt]", userData.careerStart);
  await page.type("input[id^=career_end_dt]", userData.careerEnd);

  // 퇴사 / 재직중 설정
  if (!userData.retired) {
    await clickText(page)("button", "퇴사");
    await clickText(page)("a", "재직중");
  }

  // 퇴사사유 선택: ["업직종 전환", "근무조건", "경영악화", "계약만료", "출산/육아", "학업", "유학", "개인사정", "직접입력"]
  if (userData.retired) {
    await clickText(page)("button", "퇴사사유 선택");
    await clickText(page)(
      `//div[contains(@class, "open")]//a`,
      userData.retireReason
    );
  }

  // 직무/직책 선택
  await clickText(page)("a", "선택하기");
  // 직무선택
  //  ["인턴/수습", "사원", "주임", "계장", "대리", "과장", "차장", "부장", "감사", "이사",  "상무", "전무", "부사장", "사장", "임원", "연구원", "주임연구원", "선임연구원", "책임연구원", "수석연구원" , "연구소장"]
  await clickXPath(page)(
    `//span[text()="${userData.jobGrade}"]/preceding-sibling::input`
  );

  // 직책선택
  // [ "팀원", "팀장", "실장", "총무", "지점장", "지사장", "파트장", "그룹장", "센터장", "매니저", "본부장", "사업부장", "원장", "국장" ]
  await clickXPath(page)(
    `//span[text()="${userData.jobDuty}"]/preceding-sibling::input`
  );

  // if ("임시직/프리랜서".includes(userData.jobGrade)) {
  //   clickXPath(page)(
  //     `//span[text()="임시직/프리랜서"]/preceding-sibling::input`
  //   );
  // }

  await clickText(page)("button", "완료");

  // 직종 선택
  await page.click("input[id^=career_job_category_text]");
  await page.type("input[id^=category_ipt_keyword]", userData.jobCategory);
  await page.waitForSelector(".list_check .link_check");
  await page.click(".list_check .link_check");

  // 지역 선택
  console.log("지역 선택");
  await clickContainsText(page)("button", "근무지역");
  await clickText(page)("a", userData.companyLocation);

  // 담당 부서 입력
  await page.type("input[id^=career_dept_nm]", userData.jobDepartment);

  // 담당 업무 입력
  await page.type("textarea[id^=career_contents]", userData.jobContents);
};

main();
