export type SubjectType={
    id:string,
    name:string,
    ch:number,
    description:string,
    pre_requisites:SubjectType[],
    co_requisites:SubjectType[],      
}