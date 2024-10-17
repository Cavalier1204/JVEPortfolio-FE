import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import TokenManager from "../services/TokenManager";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../modules/AuthContext";

const schoolYears = ["Leerjaar 1", "Leerjaar 2", "Leerjaar 3", "Leerjaar 4"];

const Navbar = () => {
  const { authState } = useAuth();

  return (
    <div className="w-full bg-[#b5bab6] p-2 shadow-md">
      <div className="md:container flex justify-between">
        <div className="flex">
          <DropdownMenu schoolYears={schoolYears} />
          <Link className="w-fit ms-4" to="/">
            <h2 className="w-fit text-offwhite drop-shadow-md font-light">
              Ontwikkelingsportfolio
            </h2>
            <h3 className="w-fit text-offwhite drop-shadow-md font-light">
              JVE
            </h3>
          </Link>
        </div>
        {authState.isAuthenticated && authState.claims && (
          <Link className="w-20" to="/upload">
            <div className="inline-flex h-full aspect-square justify-center gap-x-1.5 bg-[#a1a6a2] text-sm font-semibold text-gray-900 shadow-sm  hover:bg-[#8f9490] rounded">
              <PlusIcon
                className="-mx-1 h-12 w-12 text-white my-auto"
                aria-hidden="true"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
