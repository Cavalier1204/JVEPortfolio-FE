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
      <div className="md:container mx-auto flex justify-between items-center h-16 gap-4">
        <div className="flex items-center gap-4">
          <DropdownMenu schoolYears={schoolYears} />
          <Link to="/" className="text-offwhite drop-shadow-md shadow-red-400">
            <h2 className="font-light">Ontwikkelingsportfolio</h2>
            <h3 className="font-light">JVE</h3>
          </Link>
        </div>
        {authState.isAuthenticated && authState.claims && (
          <Link
            to="/upload"
            className="h-16 w-16 bg-[#a1a6a2] hover:bg-[#8f9490] rounded flex justify-center items-center"
          >
            <PlusIcon className="h-12 w-12 text-white" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
