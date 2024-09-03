import { SemesterSubjectType } from "@/types/semesterSubject";

const DeleteModal = ({
  handleDelete,
  subject,
  handleClose,
}: {
  handleClose: () => void;
  handleDelete: () => void;
  subject: SemesterSubjectType;
}) => {
  return (
    <div className="z-20 top-0 left-0 w-screen h-screen fixed bg-[#c5c5c5d1] flex items-center justify-center ">
      <div className="border border-black shadow-xl bg-white w-fit  p-5 flex flex-col rounded items-center gap-5">
        <h1 className="text-xl text-nowrap">Deseja realmente remover <strong>{subject.subject.name}</strong>?</h1>
        <div className="flex gap-3">
            <button onClick={handleDelete} className="px-3 bg-[#98fa17] rounded-sm hover:scale-[1.05] duration-300">Sim</button>
            <button onClick={handleClose} className="px-3  bg-red-500 rounded-sm hover:scale-[1.05] duration-300">Não</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
