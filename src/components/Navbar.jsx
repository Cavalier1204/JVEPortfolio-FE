import MenuComp from "./MenuComp";

let Leerjaren = ["Leerjaar 1", "Leerjaar 2", "Leerjaar 3", "Leerjaar 4"];

const Navbar = () => {
  return (
    <div className="w-full bg-teal-400 flex">
      <MenuComp leerjaren={Leerjaren} />
      <div className="flex-1 w-fit">
        <h1 className="w-fit">Ontwikkel portfolio</h1>
        <h2 className="w-fit">Jana van Eijk</h2>
      </div>
    </div>
  );
};

export default Navbar;
