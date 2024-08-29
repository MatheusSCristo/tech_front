import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";
const ErrorPopUp = ({ error,handleClosePopUp }: { error: string,handleClosePopUp:()=>void }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  },[]);

  useEffect(()=>{
    if(time>=3){
        handleClosePopUp();
    }
  },[time])

  return (
    <div className="flex flex-col items-center p-3 z-10 fixed bottom-5 right-5 min-w-[20%]  bg-white rounded-md border border-black shadow-xl ">
      <MdError className="text-[#f00]" size={30} />
      <h1 className="font-bold text-lg">Error</h1>
      <p>{error}</p>
      <LinearProgress value={time / 3} variant="determinate" />
    </div>
  );
};

export default ErrorPopUp;
