import { SubjectType } from "@/types/subject";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { FaSearch } from "react-icons/fa";
import Filter from "./components/Filter";

const getSubjects = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (accessToken) {
    const response = await fetchWithAuth(
      "http://localhost:8080/subject",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      accessToken
    );
    if (!response.ok) {
      return;
    }
    const data: SubjectType[] = await response.json();
    return data;
  }
};

const Subjects = async () => {
  const subjects: SubjectType[] | undefined = await getSubjects();

  return (
    <section className="w-full h-screen bg-blueGradiant p-10">
      <div className="bg-[#ffffffae] w-full h-full rounded-xl flex flex-col items-center px-5 py-2 gap-5">
        <h1 className="text-[3em] leading-none">Matérias</h1>
        <div className="bg-white w-full p-2 rounded-md flex justify-between">
          <SearchBar />
          <Filter />
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-scroll  ">
          <Table subjects={subjects} />
        </div>
      </div>
    </section>
  );
};

export default Subjects;

const SearchBar = ({}) => {
  return (
    <div className="bg-[#f5f5f5] flex items-center gap-2 w-1/2 px-2 py-1 rounded-md border border-gray-300">
      <input
        type="text"
        className="bg-[#f5f5f5] focus:outline-none flex-1"
        placeholder="Pesquisar..."
      />
      <FaSearch className="text-[#5c5c5c]" />
    </div>
  );
};

const Table = ({ subjects }: { subjects: SubjectType[] | undefined }) => {
  return (
    <table className="w-full">
      <thead className="my-5">
        <tr className="py-2 overflow-hidden">
          <th className="text-nowrap">Componente</th>
          {/* <th className="text-nowrap">Natureza</th> */}
          <th className="text-nowrap">Carga Horária</th>
          <th className="text-nowrap w-1/2">Descrição</th>
        </tr>
      </thead>
      <tbody>
        {subjects?.map((subject) => (
          <tr key={subject.id} className="border-b-[1px] border-black h-[50px] my-2 w-full">
            <td className="text-[#575757]">{subject.name}</td>
            <td className="text-center text-[#575757]">{subject.ch}</td>
            <td className="text-[#575757] truncate max-w-[300px] overflow-hidden text-ellipsis">
              {subject.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};