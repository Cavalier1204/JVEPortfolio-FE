import React from "react";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../modules/useAuth";
import schoolYears from "../data/year-structure.json";
import { SchoolYears } from "../types";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full bg-[#b5bab6] p-2 shadow-md">
      <div className="md:container mx-auto flex justify-between items-center h-16 gap-4">
        <div className="flex items-center gap-4">
          <DropdownMenu schoolYears={schoolYears as SchoolYears} />
          <Link to="/" className="text-offwhite drop-shadow-md shadow-red-400">
            <h2 className="font-light">Ontwikkelingsportfolio</h2>
            <h3 className="font-light">JVE</h3>
          </Link>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              aria-label="Portfolio item toevoegen"
              className="h-16 w-16 bg-[#a1a6a2] hover:bg-[#8f9490] rounded flex justify-center items-center transition-colors"
            >
              <PlusIcon className="h-12 w-12 text-white" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              aria-label="Uitloggen"
              title="Uitloggen"
              className="h-16 w-16 bg-[#a1a6a2] hover:bg-[#8f9490] rounded flex justify-center items-center transition-colors"
            >
              <ArrowRightOnRectangleIcon
                className="h-10 w-10 text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
