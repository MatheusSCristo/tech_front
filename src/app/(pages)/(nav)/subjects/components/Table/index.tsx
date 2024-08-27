import { SubjectType } from "@/types/subject";
import { UserType } from "@/types/user";
import { useState } from "react";
import { SubjectModal } from "../Modal/SubjectModal";

const Table = ({
  subjects,
  user,
}: {
  subjects: SubjectType[];
  user: UserType | null;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [subject, setSubject] = useState<SubjectType | null>(null);


  const handleOpenModal = (subject: SubjectType) => {
    setSubject(subject);
    setOpenModal(true);
  }

  const mandatorySubjects = user?.structure.mandatory_subjects.map(
    (subject) => subject.id
  );

  return (
    <>
    {openModal && subject && <SubjectModal subject={subject} handleClose={()=>setOpenModal(false)}/>}
      <table className="w-full">
        <thead className="my-5">
          <tr className="py-2 overflow-hidden">
            <th className="text-nowrap">Código</th>
            <th className="text-nowrap w-1/5">Componente</th>
            <th className="text-nowrap">Natureza</th>
            <th className="text-nowrap">Carga Horária</th>
            <th className="text-nowrap w-2/5">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr
              key={subject.id}
              className="border-b-[1px] border-black h-[50px] my-2 w-full cursor-pointer"
              onClick={() => handleOpenModal(subject)}
            >
              <td className="text-[#575757] truncate max-w-[100px] text-center">
                {subject.id}
              </td>
              <td className="text-[#575757] truncate max-w-[100px] overflow-hidden text-ellipsis">
                {subject.name}
              </td>
              <td className="text-[#575757] text-center">
                {mandatorySubjects?.includes(subject.id)
                  ? "Obrigátoria"
                  : "Optativa"}
              </td>
              <td className="text-center text-[#575757]">{subject.ch}h</td>
              <td className="text-[#575757] truncate max-w-[100px] overflow-hidden text-ellipsis">
                {subject.description || "Descrição não cadastrada."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
