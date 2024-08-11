import { SemesterUserType } from "./semester";
import { StructureType } from "./structure";

export type UserType={
    id:string,
    email:string,
    image_url:string,
    name:string,
    semesters:SemesterUserType[],
    start:string,
    structure:StructureType,
}