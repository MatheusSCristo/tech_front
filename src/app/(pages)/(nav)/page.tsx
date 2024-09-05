import { Suspense } from "react";
import Dashboard from "./components/Dashboard";
import SemesterDashboard from "./components/SemesterDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import Loading from "./components/TeacherDashboard/loading";

const Home = () => {
  return (
    <section className="w-full h-screen flex gap-5 p-10">
      <div className="w-[30%] flex flex-col justify-evenly h-full p-5">
        <Dashboard />
        <Suspense fallback={<Loading />}>
          <TeacherDashboard />
        </Suspense>
      </div>
      <SemesterDashboard />
    </section>
  );
};

export default Home;
