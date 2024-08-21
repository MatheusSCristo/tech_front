"use client"

import { useState } from "react";
import { FaFilter } from "react-icons/fa";

const Filter = ({}) => {
    const [showFilter, setShowFilter] = useState(false);
    return (
      <div className="gap-1 flex items-center ">
        <FaFilter />
        <span>Filtros</span>
      </div>
    );
  };

export default Filter;