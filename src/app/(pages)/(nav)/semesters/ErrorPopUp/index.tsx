import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";
const ErrorPopUp = ({
  error,
  handleClosePopUp,
  option,
  responseFunction,
}: {
  error: string;
  handleClosePopUp: () => void;
  option?: boolean;
  responseFunction?: () => void;
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if(option) return;
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.100);
    }, 100);
    return () => clearInterval(interval);
  }, [,option]);

  useEffect(() => {
    if (time >= 3.5 && !option) {
      handleClosePopUp();
    }
  }, [time]);


  const progress=(time/3)*100;

  return (
    <div className="gap-3 flex flex-col items-center p-3 z-10 fixed bottom-5 right-5 min-w-[20%] max-w-[30%] bg-white rounded-md border border-black shadow-xl ">
      <div className="flex flex-col">
      <MdError className="text-[#f00]" size={30} />
      <h1 className="font-bold text-lg">Erro</h1>
      </div>
      <p className="text-wrap text-center">{error}</p>
      {option && responseFunction && (
        <div className="flex flex-col items-center">
          <h2>Deseja mover os co-requisitos também?</h2>
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-2 py-1 rounded-sm"
              onClick={() => {
                responseFunction();
              }}
            >
              Sim
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-sm"
              onClick={() => {
                setTimeout(() => {
                  handleClosePopUp();
                }, 200);
              }}
            >
              Não
            </button>
          </div>
        </div>
      )}
      {!option && <LinearProgress value={progress} variant="determinate" className="w-full" />}
    </div>
  );
};

export default ErrorPopUp;
