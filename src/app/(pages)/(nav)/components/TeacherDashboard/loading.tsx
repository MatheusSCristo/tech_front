import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="bg-[#ffffffd6] flex flex-col rounded-xl items-center px-10 pt-2 pb-4 h-[40%] gap-2">
      <h1 className="text-[2em]">TOP DOCENTES</h1>
      <div className="w-full flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    </div>
  );
};

export default Loading;
