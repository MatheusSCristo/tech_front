import { Dispatch, SetStateAction } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  searched,
  setSearched,
  size,
}: {
  searched: string;
  setSearched: Dispatch<SetStateAction<string>>;
  size:string
}) => {
  return (
    <div className={`bg-[#f5f5f5] flex items-center gap-2 ${size} px-2 py-1 rounded-md border border-gray-300`}>
      <input
        onChange={(e) => setSearched(e.target.value)}
        value={searched}
        type="text"
        className="bg-[#f5f5f5] focus:outline-none flex-1"
        placeholder="Pesquisar..."
      />
      <FaSearch className="text-[#5c5c5c]" />
    </div>
  );
};

export default SearchBar;
