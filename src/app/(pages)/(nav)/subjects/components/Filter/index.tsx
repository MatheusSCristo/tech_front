"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";

const FilterOptions: { [key: number]: String } = {
  0: "Todos",
  1: "Obrigatórias",
  2: "Optativas",
  3: "30h",
  4: "60h",
  5: "90h",
};

const Filter = ({
  filter,
  setFilter,
}: {
  filter: Number;
  setFilter: Dispatch<SetStateAction<Number>>;
}) => {
  const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="relative w-fit bg-white w-[100px]  flex items-center">
      <div
        className="gap-1 flex items-center hover:scale-[1.1] duration-300 cursor-pointer relative w-full"
      >
        <FaFilter />
        <span>Filtros</span>
        <BiChevronDown
              size={20}
              className="absolute right-0 cursor-pointer"
              onClick={() => setShowFilter(true)}
            />
      </div>
      {showFilter && (
        <div className="flex flex-col gap-1 absolute top-0 text-sm bg-white w-[100px] items-start border border-[#d6d6d6] rounded ">
          <div className="flex w-full relative px-2 items-center">
            <span className="text-lg">Filtros</span>
            <BiChevronUp
              size={20}
              className="absolute right-0 cursor-pointer"
              onClick={() => setShowFilter(false)}
            />
          </div>

          {Object.keys(FilterOptions).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(Number(key))}
              className={`hover:bg-[#d7d7d7] w-full ${
                filter === Number(key) && "bg-[#d7d7d7]"
              }`}
            >
              {FilterOptions[parseInt(key)]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
