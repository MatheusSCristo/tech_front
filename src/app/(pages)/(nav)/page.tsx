import Dashboard from "./components/Dashboard"
import TeacherDashboard from "./components/TeacherDashboard"

const Home = () => {
  return (
    <section className="w-full h-screen bg-blueGradiant p-10">
      <div className="w-[30%] flex flex-col justify-evenly h-full">
        <Dashboard/>
        <TeacherDashboard/>
      </div>
    </section>
  )
}

export default Home
