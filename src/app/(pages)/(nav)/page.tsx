import { Suspense } from "react";
import Dashboard from "./components/Dashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import Loading from "./components/TeacherDashboard/loading";

const Home = () => {
  return (
    <section className="w-full h-full bg-blueGradiant ">
      <div className="w-[30%] flex flex-col justify-evenly h-full p-5">
        <Dashboard />
        <Suspense fallback={<Loading/>}>
          <TeacherDashboard />
        </Suspense>
      </div>
    </section>
  );
};

export default Home;
