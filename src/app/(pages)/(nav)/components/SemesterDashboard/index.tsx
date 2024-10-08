"use client";
import { SemesterContext } from "@/app/context/SemesterContext";
import { useContext } from "react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { UserContext } from "@/app/context/UserContext";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const SemesterDashboard = () => {
  const { semesters } = useContext(SemesterContext);
  const { user } = useContext(UserContext);

  return (
    <div className="bg-[#ffffffd6] m-10 flex flex-col items-center justify-center p-5 rounded-xl gap-10 xl:w-[800px] 2xl:w-[1200px] h-fit gap-5 ">
      <h1 className="text-[1.5em]">Semestres</h1>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={1}
        className="w-full "
        navigation
      >
        {semesters?.map((semester) => (
          <SwiperSlide
            className="!flex !flex-col items-center"
            key={semester.id}
          >
            <h2 className="text-[1.5em]">{semester.semester}°</h2>
            <div className="flex-wrap flex flex-row justify-center items-center w-full ">
              {semester.subjects.length == 0 && (
                <div className="h-full w-full flex items-center justify-center">
                  <h1>Não há matérias cadastradas nesse semestre</h1>
                </div>
              )}
              {semester.subjects.map((subject) => {
                const isMandatory = user?.structure.mandatory_subjects.some(
                  (item) => item.id === subject.subject.id
                );
                return (
                  <div
                    key={subject.id}
                    className={`${
                      subject.finished ? "opacity-[50%]" : "opacity-1"
                    }  overflow-hidden ${
                      isMandatory ? "bg-mandatoryBlue" : "bg-optionalGray"
                    } w-[20%] border border-black h-[200px] flex items-center justify-center rounded p-3 shadow-xl m-5 hover:scale-[1.05] duration-300
                  `}
                  >
                    <span className="text-center text-wrap truncate uppercase">
                      {subject.subject.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SemesterDashboard;
