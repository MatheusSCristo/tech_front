import { SubjectType } from "./subject"
import { TeacherType } from "./teacher"

export type SemesterSubjectType={
    id:string,
    subject:SubjectType,
    finished:boolean,
    teacher:TeacherType,
}