import { Page } from "puppeteer";

import { IResumeData } from "../IResume";

import { clickText, clickHasText, clickXPath } from "../utils";

const fillCareer = (page: Page) => async ({ careers }: IResumeData) => {
  await page.goto(
    "https://www.saramin.co.kr/zf_user/member/profile/career-write"
  );

  for (let index = 0; index < careers.length - 1; index++) {
    await page.click(".area_resume_btn button");
  }

  for (let index = 0; index < careers.length; index++) {
    const career = careers[index];

    const parentPath = `.tpl_row:nth-of-type(${index + 1})`;
    const parentXPath = `div[contains(@class, "tpl_row")][${index + 1}]`;
    const inputPath = id => `${parentPath} input[id^=${id}]`;

    // 회사이름 입력 후 직접입력 선택
    console.log("회사명 입력");
    await page.type(inputPath("career_company_nm"), career.companyName);
    await page.waitForSelector(".link_directly");
    await page.click(".link_directly");

    // 입사 & 퇴사
    console.log("입사, 퇴사 일자");
    await page.type(inputPath("career_start_dt"), career.careerStart);
    await page.type(inputPath("career_end_dt"), career.careerEnd);

    // 퇴사 / 재직중 설정
    if (career.retired) {
      // 퇴사사유 선택: ["업직종 전환", "근무조건", "경영악화", "계약만료", "출산/육아", "학업", "유학", "개인사정", "직접입력"]
      await clickText(page)(parentXPath, "button")("퇴사사유 선택");
      await clickText(page)(parentXPath, ".open", "a")(career.retireReason);
    } else {
      // 재직중
      await clickText(page)(parentXPath, "button")("퇴사");
      await clickText(page)(parentXPath, "a")("재직중");
    }

    // 직무/직책 선택
    await clickText(page)(parentXPath, "a")("선택하기");
    // 직무선택
    //  ["인턴/수습", "사원", "주임", "계장", "대리", "과장", "차장", "부장", "감사", "이사",  "상무", "전무", "부사장", "사장", "임원", "연구원", "주임연구원", "선임연구원", "책임연구원", "수석연구원" , "연구소장"]
    await clickXPath(page)(
      `//span[text()="${career.jobGrade}"]/preceding-sibling::input`
    );

    // 직책선택
    // [ "팀원", "팀장", "실장", "총무", "지점장", "지사장", "파트장", "그룹장", "센터장", "매니저", "본부장", "사업부장", "원장", "국장" ]
    await clickXPath(page)(
      `//span[text()="${career.jobDuty}"]/preceding-sibling::input`
    );

    // if ("임시직/프리랜서".includes(career.jobGrade)) {
    //   clickXPath(page)(
    //     `//span[text()="임시직/프리랜서"]/preceding-sibling::input`
    //   );
    // }

    await clickText(page)("button")("완료");

    // 직종 선택
    await page.click(inputPath("career_job_category_text"));
    await page.type(inputPath("category_ipt_keyword"), career.jobCategory);
    await page.waitForSelector(".list_check .link_check");
    await page.click(".list_check .link_check");

    // 지역 선택
    console.log("지역 선택");
    await clickHasText(page)(parentXPath, "button")("근무지역");
    await clickText(page)(parentXPath, "a")(career.companyLocation);

    // 담당 부서 입력
    await page.type(inputPath("career_dept_nm"), career.jobDepartment);

    // 담당 업무 입력
    await page.type(
      `${parentPath} textarea[id^=career_contents]`,
      career.jobContents
    );
  }
};

export default fillCareer;
