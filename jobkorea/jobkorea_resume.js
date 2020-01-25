const puppeteer = require("puppeteer");

const {
  clickHasText,
  clickHasInnerText,
  clickXPath,
  clickText,
  existSelector,
  existXPath,
  clickAll,
  fill
} = require("../utils");

const userData = {
  id: "autoresume", // 아이디
  pw: "autoresume1", // 비밀번호
  // educationLevel: "대학교(4년)", // 학력
  educationLevel: "대학원",
  edcationDegree: "석사",
  schoolName: "한국외국어대학교 (서울)", // 학교 이름
  educationState: "재학중",
  majorCategory: "어문학", // 주전공 계열
  majorName: "포르투갈어과", // 주전공 이름
  hasMinor: true, // 부/이중/복수 전공 여부
  minorType: "이중전공", // 부전공 종류
  minorCategory: "컴퓨터", // 부전공 계열
  minorName: "융합소프트웨어전공", // 부전공 이름
  schoolEntrance: "201603", // 입학일자(YYYYMM)
  schoolGraduation: "202001", // 졸업일자(YYYYMM)
  dayOrNight: "주간", // 주간/야간 선택
  gpa: "3.5", // 학점
  gpaScale: "4.5", // 기준학점

  careers: [
    {
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
    },
    {
      companyName: "네이버비즈니스플랫폼", // 회사 이름
      careerStart: "201203", // 입사일자(YYYYMM)
      careerEnd: "201603", // 퇴사일자(YYYYMM)
      companyLocation: "서울", // 회사 위치
      retired: true, // 퇴사 or 재직중
      retireReason: "근무조건", // 퇴사이유
      jobGrade: "대리", // 직급
      jobDuty: "팀장", // 직책
      jobCategory: "웹개발", // 직종
      jobDepartment: "프런트엔드 시스템", // 담당 부서
      jobContents: "담당업무" // 담당 업무
    }
  ]
};

const login = async ({ id, pw }) => {
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

const fillEducation = page => async userData => {
  const educatoinExisted = await existSelector(page)(
    'button.button-field-remove[data-linked_form_id="formEducation"]'
  );
  if (educatoinExisted) {
    console.log("학력 초기화");
    await clickAll(page)("#formEducation .buttonDeleteField");
    await page.click("#school_addbutton");
  } else {
    await page.click('button[data-linked_form_id="formEducation"]');
  }

  console.log("학력 선택");
  await page.click(".dropdown-education-category .buttonChoose");
  console.log("학교구분 누름");
  await page.waitForSelector(".visible");

  await clickText(page)("span")(userData.educationLevel); // '고등학교', '대학교(2,3년)', '대학교(4년)', '대학원'

  console.log("학교 이름 입력");
  await fill(page)(`input[id^="UnivSchool_Schl_Name"]`, userData.schoolName);
  await page.waitForSelector(".autocomplete:not(.hidden)");
  const hasSchool = await existSelector(page)(
    ".autocomplete:not(.hidden) li:nth-child(1) button"
  );
  if (hasSchool) {
    await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
  } else {
    console.log("학교 이름 직접 입력");
    await page.click("div[id^=UnivSchoolautoComplete] .buttonDirect");
  }

  if (userData.educationLevel === "대학원") {
    console.log("학위 입력");
    await page.click(".dropdown-edcation-degree .buttonChoose");
    await page.waitForSelector(".visible");
    await clickText(page)("span")(userData.edcationDegree); // 석사, 박사, 석박사
  }

  console.log("입학/졸업 년월 입력");
  await page.type("input[id^=UnivSchool_Entc_YM]", userData.schoolEntrance);
  await page.type("input[id^=UnivSchool_Grad_YM]", userData.schoolGraduation);

  await page.click(".dropdown-edcation-state .buttonChoose");
  console.log("졸업상태 선택"); //  [ "졸업", "졸업예정", "재학중", "중퇴", "수료", "휴학" ]
  await clickText(page)("span")(userData.educationState);

  console.log("전공명 입력");
  await fill(page)("input[id^=univmajor_0_0]", userData.majorName);
  await page.waitForSelector(".autocomplete:not(.hidden)");
  const hasMajor = !(await existSelector(".autocomplete .notFound"));
  if (hasMajor) {
    await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
  } else {
    console.log("전공명 직접 입력");
    await page.click("#UnivMajorAutoComplete_1_0 .buttonDirect");
  }

  console.log("학점 입력");
  await page.type("input[id^=UnivSchool_Grade]", userData.gpa);

  await page.click(".dropdown-education-total .buttonChoose");
  await clickText(page)(".visible", "span")(userData.gpaScale);

  if (userData.hasMinor) {
    await page.click(".buttonEducationMajor");
    await page.click(".dropdown-education-major button");
    await clickText(page)("span")(userData.minorType);
    await fill(page)("#univmajor_1_1", userData.minorName);
    await page.waitForSelector(".autocomplete:not(.hidden)");
    const hasMinor = !(await existSelector(".autocomplete .notFound"));
    if (hasMinor) {
      await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
    } else {
      console.log("전공명 직접 입력");
      await page.click("#UnivMajorAutoComplete_2_1 .buttonDirect");
    }
  }

  return null;
};

const main = async () => {
  const page = await login(userData);
  // 이름, 생년월일, 성별이 이미 입력되어 있어야 합니다.
  await page.goto("https://www.jobkorea.co.kr/User/Resume/Write");
  // await page.waitForNavigation({ waitUntil: "networkidle0" });

  await fillEducation(page)(userData);

  const careerExisted = await existSelector(page)(
    'button.button-field-remove[data-linked_form_id="formCareer"]'
  );
  if (!careerExisted) {
    await page.click('button[data-linked_form_id="formCareer"]');
  }

  console.log("경력 초기화");
  await clickAll(page)("#formCareer .buttonDeleteField");
  for (let index = 0; index < userData.careers.length; index++) {
    await page.click(".formCareer .buttonAddField");
  }

  for (let index = 0; index < userData.careers.length; index++) {
    const career = userData.careers[index];

    const parentPath = `#career_containers .container${index + 1}`;
    const inputPath = startId => `${parentPath} input[id^="${startId}"]`;

    console.log("경력 추가", index + 1);

    await page.waitForSelector(parentPath);

    console.log("회사 이름 입력");
    await fill(page)(
      `${parentPath} input[id^=Career_C_Name]`,
      career.companyName
    );
    await page.waitForSelector(".autocomplete:not(.hidden)");
    const hasCompany = await existSelector(page)(
      ".autocomplete:not(.hidden) li:nth-child(1) button"
    );
    if (hasCompany) {
      await page.click(".autocomplete:not(.hidden) li:nth-child(1) button");
    } else {
      console.log("회사 이름 직접 입력");
      await page.click(".autocomplete:not(.hidden) .buttonDirect");
    }

    console.log("부서명 입력");
    await page.type(inputPath("Career_C_Part"), career.jobDepartment);

    console.log("입사, 퇴사일 입력");
    await page.type(inputPath("Career_CSYM"), career.careerStart);
    await page.type(inputPath("Career_CEYM"), career.careerEnd);

    if (!career.retired) {
      await page.click(inputPath("Career_RetireSt"));
    }

    // ['사원','주임/계장','대리','과장','차장','부장','임원','연구원','주임연구원','선임연구원','책임연구원','수석연구원','연구소장','사원','주임/계장','대리','과장','차장','부장','임원','연구원','주임연구원','선임연구원','책임연구원','수석연구원','연구소장']
    console.log("직급/직책 선택");
    await page.click(`${parentPath} .dropdown-career-position .buttonChoose`);
    await page.waitForSelector(".visible");
    await clickText(page)(".visible", "label")(career.jobGrade);
    await clickText(page)(".visible", "label")(career.jobDuty);

    // if (career.jobGrade === '프리랜서') {
    //   await page.click('.visible .freelancer input')
    // }

    await page.click(".visible .buttonConfirm");

    // 이건 너무 많아서 스킵
    // console.log("직무 선택");
    // await page.click(`${parentPath} .input-career-duty .buttonChoose`);
    // await fill(page)('.Career_JobSearchText')

    console.log("담당업무 입력");
    await page.type(
      `${parentPath} textarea[id^=Career_Prfm_Prt]`,
      career.jobContents
    );
  }

  // await page.click(".buttonComplete");
  // await page.waitForNavigation();
  // await clickText(page)("a")("작성한 이력서 보기");
};

main();
