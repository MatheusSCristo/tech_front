import { SubjectType } from "./subject";

export type StructureType = {
  ch_subtotal: number;
  id: number;
  mandatory_subjects: SubjectType[];
  name: string;
  optional_ch_min: number;
  optional_subjects: SubjectType[];
};
