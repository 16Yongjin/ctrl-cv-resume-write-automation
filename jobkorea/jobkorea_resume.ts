import * as puppeteer from "puppeteer";
import { Page } from "puppeteer";

import fillCareer from "./career";
import fillEducation from "./education";
import { IResumeData } from "../IResume";
import login from "./login";
import fillLicense from "./license";
import fillLanguage from "./lauguage";

const userData: IResumeData = {
  id: "autoresume", // 아이디
  pw: "autoresume1", // 비밀번호
  educations: [
    {
      educationLevel: "대학교(4년)",
      edcationDegree: "",
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
      gpaScale: "4.5" // 기준학점
    },
    {
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
      gpaScale: "4.5" // 기준학점
    }
  ],

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
  ],
  languages: [
    {
      language: "영어", // 언어
      languageExamName: "toeic", //시험종류
      languageExamScore: "990", // 점수
      languageExamLevel: "", // 급수, 리스트에 없는 값이면 중단 에러
      languageExamObtainDate: "201906" // 취득일자
    },
    {
      language: "일본어", // 언어
      languageExamName: "JLPT", //시험종류
      languageExamScore: "", // 점수
      languageExamLevel: "1", // 급수, 리스트에 없는 값이면 중단 에러
      languageExamObtainDate: "201906" // 취득일자
    },
    {
      language: "중국어", // 언어
      languageExamName: "hsk", //시험종류
      languageExamScore: "", // 점수
      languageExamLevel: "5", // 급수, 리스트에 없는 값이면 중단 에러
      languageExamObtainDate: "201906" // 취득일자
    },
    {
      language: "독일어", // 언어
      languageExamName: "DSH", //시험종류
      languageExamScore: "", // 점수
      languageExamLevel: "5", // 급수, 리스트에 없는 값이면 중단 에러
      languageExamObtainDate: "201906" // 취득일자
    },
    {
      language: "아랍어", // 언어
      languageExamName: "아랍어시험", //시험종류
      languageExamScore: "100", // 점수
      languageExamLevel: "", // 급수, 리스트에 없는 값이면 중단 에러
      languageExamObtainDate: "201906" // 취득일자
    }
  ],
  licenses: [
    {
      licenseName: "정보처리산업기사", // 자격증명,
      licensePublicOrg: "한국산업인력공단", // 발행기관
      licenseObtainDate: "201906" // 획득일자
    },
    {
      licenseName: "정보처리기능사", // 자격증명,
      licensePublicOrg: "한국산업인력공단", // 발행기관
      licenseObtainDate: "201906" // 획득일자
    }
  ]
};

const main = async () => {
  const page = await login(userData);

  // 이름, 생년월일, 성별이 이미 입력되어 있어야 합니다.
  await page.goto("https://www.jobkorea.co.kr/User/Resume/Write");

  await fillEducation(page)(userData);

  await fillCareer(page)(userData);

  await fillLicense(page)(userData);

  await fillLanguage(page)(userData);

  // await page.click(".buttonComplete");
  // await page.waitForNavigation();
  // await clickText(page)("a")("작성한 이력서 보기");
};

main();
