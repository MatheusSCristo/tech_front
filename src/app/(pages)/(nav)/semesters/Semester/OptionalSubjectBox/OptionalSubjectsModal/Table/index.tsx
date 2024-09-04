import { SubjectType } from "@/types/subject";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const Table = ({
  subjects,
  setSelectedSubjects,
  selectedSubjects,
}: {
  subjects: SubjectType[];
  setSelectedSubjects: Dispatch<SetStateAction<SubjectType[]>>;
  selectedSubjects: SubjectType[];
}) => {
  return (
    <table className="w-full">
      <thead className="my-5">
        <tr className="py-2 overflow-hidden">
          <th className="text-nowrap"></th>
          <th className="text-nowrap">Código</th>
          <th className="text-nowrap w-1/5">Componente</th>
          <th className="text-nowrap">Carga Horária</th>
          <th className="text-nowrap w-2/5">Descrição</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => (
          <TableRows
            key={subject.id}
            subject={subject}
            setSelectedSubjects={setSelectedSubjects}
            selectedSubjects={selectedSubjects}
          />
        ))}
      </tbody>
    </table>
  );
};

const TableRows = ({
  subject,
  setSelectedSubjects,
  selectedSubjects,
}: {
  subject: SubjectType;
  setSelectedSubjects: Dispatch<SetStateAction<SubjectType[]>>;
  selectedSubjects: SubjectType[];
}) => {
  const [checked, setChecked] = useState(false);

  const handleSelect = () => {
    setChecked(!checked);
    setSelectedSubjects((prevState) =>
      prevState.includes(subject)
        ? prevState.filter((item) => item !== subject)
        : [...prevState, subject]
    );
  };

  useEffect(() => {
    if (selectedSubjects.includes(subject)) setChecked(true);
    else setChecked(false);
  }, [selectedSubjects]);

  return (
    <tr
      key={subject.id}
      className="border-b-[1px] border-black h-[50px] my-2 w-full "
      onClick={handleSelect}
    >
      <td>
        <input type="checkbox" checked={checked} readOnly />
      </td>
      <td className="text-[#575757] truncate max-w-[100px] text-center">
        {subject.id}
      </td>
      <td
        className="text-[#575757] truncate max-w-[100px] overflow-hidden text-ellipsis"
        title={subject.name}
      >
        {subject.name}
      </td>

      <td className="text-center text-[#575757]">{subject.ch}h</td>
      <td
        className="text-[#575757] truncate max-w-[100px] overflow-hidden text-ellipsis"
        title={subject.description}
      >
        {subject.description || "Descrição não cadastrada."}
      </td>
    </tr>
  );
};

export default Table;
