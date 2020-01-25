export interface IEducation {
  educationLevel: string;
  edcationDegree: string;
  schoolName: string;
  educationState: string;
  majorCategory: string;
  majorName: string;
  hasMinor: boolean;
  minorName: string;
  minorType: string;
  minorCategory: string;
  schoolEntrance: string;
  schoolGraduation: string;
  dayOrNight: string;
  gpa: string;
  gpaScale: string;
}

export interface ICareer {
  companyName: string;
  careerStart: string;
  careerEnd: string;
  companyLocation: string;
  retired: boolean;
  retireReason: string;
  jobGrade: string;
  jobDuty: string;
  jobCategory: string;
  jobDepartment: string;
  jobContents: string;
}

export interface ILicense {
  licenseName: string;
  licensePublicOrg: string;
  licenseObtainDate: string;
}

export interface ILanguage {
  language: string;
  languageExamName: string;
  languageExamScore: string;
  languageExamLevel: string;
  languageExamObtainDate: string;
}

export interface IResumeData {
  id: string;
  pw: string;
  educations: IEducation[];
  careers: ICareer[];
  licenses: ILicense[];
  languages: ILanguage[];
}
