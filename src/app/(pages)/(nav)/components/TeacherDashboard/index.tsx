import { TeacherType } from "@/types/teacher";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Rating } from "@mui/material";
import { cookies } from "next/headers";

const getTeachers = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (accessToken) {
    const response = await fetchWithAuth(
      "http://localhost:8080/teacher",
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
    const data: TeacherType[] = await response.json();
    return data.sort((a, b) => b.rating - a.rating);
  }
};

const TeacherDashboard = async () => {
  const teachers: TeacherType[] | undefined = await getTeachers();

  return (
    <div className="bg-[#ffffffd6] flex flex-col rounded-xl items-center px-10 pt-2 pb-4 h-[40%] gap-2">
      <h1 className="text-[2em]">TOP DOCENTES</h1>
      <div className="overflow-y-scroll w-full">
        {teachers?.map((teacher) => (
          <Teacher teacher={teacher} key={teacher.id} />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;

const Teacher = ({ teacher }: { teacher: TeacherType }) => {
  return (
    <div className="flex gap-2 h-[20%] xl:h-[15%]">
      <span className="md:text-sm 2xl:text-[1.5em] truncate w-1/2">
        {teacher.name}
      </span>
      <Rating
        name="rating"
        value={teacher.rating}
        readOnly
        precision={0.5}
        size="medium"
      />
    </div>
  );
};
