import MenuComp from "./MenuComp";

const schoolYears = ["Leerjaar 1", "Leerjaar 2", "Leerjaar 3", "Leerjaar 4"];

const Navbar = () => {
  return (
    <div className="w-full bg-[#b5bab6] flex p-2 shadow-md">
      <MenuComp schoolYears={schoolYears} />
      <a className="flex-1 w-fit ps-4" href="/">
        <h2 className="w-fit text-offwhite drop-shadow-md font-light">
          Ontwikkelingsportfolio
        </h2>
        <h3 className="w-fit text-offwhite drop-shadow-md font-light">JVE</h3>
      </a>
    </div>
  );
};

export default Navbar;
