import { SubjectType } from "@/types/subject";

export const SubjectModal = ({
  subject,
  handleClose,
}: {
  subject: SubjectType;
  handleClose: () => void;
}) => {
  return (
    <div className="top-0 left-0 w-screen h-screen fixed bg-[#c5c5c5d1] flex items-center justify-center ">
      <div className="bg-white w-[40%] max-h-fit flex flex-col items-center rounded-xl border border-black py-5 px-5 relative">
        <button
          className="absolute right-3 top-3 text-xl"
          onClick={handleClose}
        >
          X
        </button>
        <h1 className="text-[1.5em]">Detalhes</h1>
        <div className="flex flex-col w-full border-b-[1px] border-black pb-3">
          <div className="flex gap-2 items-baseline">
            <h2 className="font-bold text-lg">Componente:</h2>
            <span className="text-md text-[#4e4e4ed2]">{subject.name}</span>
          </div>
          <div className="flex gap-2 items-baseline">
            <h2 className="font-bold text-lg">Carga Horária:</h2>
            <span className="text-md text-[#4e4e4ed2]">{subject.ch}</span>
          </div>
          <div className="flex gap-2 items-baseline overflow-y-scroll h-[200px]">
            <h2 className="font-bold text-lg">Descrição:</h2>
            <p className="text-md text-[#4e4e4ed2]">{subject.description}</p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-5">
          <div>
            <h2 className="font-bold text-lg">Pré requisitos:</h2>
            <div className="flex flex-col">
              {subject.pre_requisites.map((preRequisite) => (
                <span className="text-md text-[#4e4e4ed2]" key={preRequisite.id}>
                  {preRequisite.id + " - " + preRequisite.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg">Co requisitos:</h2>
            <div className="flex flex-col">
              {subject.co_requisites.map((coRequisites) => (
                <span className="text-md text-[#4e4e4ed2]" key={coRequisites.id}>
                  {coRequisites.id + " - " + coRequisites.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
