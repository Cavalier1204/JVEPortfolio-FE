import { Link } from "react-router-dom";
import MenuComp from "./MenuComp";

const schoolYears = ["Leerjaar 1", "Leerjaar 2", "Leerjaar 3", "Leerjaar 4"];

const Navbar = () => {
  return (
    <div className="w-full bg-[#b5bab6] flex p-2 shadow-md">
      <MenuComp schoolYears={schoolYears} />
      <Link className="flex-1 w-fit ps-4" to="/">
        <h2 className="w-fit text-offwhite drop-shadow-md font-light">
          Ontwikkelingsportfolio
        </h2>
        <h3 className="w-fit text-offwhite drop-shadow-md font-light">JVE</h3>
      </Link>
    </div>
  );
};

export default Navbar;
