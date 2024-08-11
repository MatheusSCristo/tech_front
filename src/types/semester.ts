import { SemesterSubjectType } from "./semesterSubject"

export type SemesterUserType={
    id:string,
    semester:number,
    semester_subjects:SemesterSubjectType[]
}