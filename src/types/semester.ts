import { SemesterSubjectType } from "./semesterSubject"

export type SemesterUserType={
    id:string,
    semester:number,
    subjects:SemesterSubjectType[]
}