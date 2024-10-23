import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/20/solid";

const DropdownMenu = ({ schoolYears }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openYear, setOpenYear] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setOpenYear(null);
  };

  const handleYearHover = (yearNumber) => {
    setOpenYear(yearNumber);
  };

  return (
    <div className="relative">
      <div className="h-16 w-16 bg-[#a1a6a2] hover:bg-[#8f9490] rounded flex justify-center items-center">
        <Bars3Icon
          onClick={toggleDropdown}
          className="h-12 w-12 text-white"
          aria-hidden="true"
        />
      </div>

      {isOpen && (
        <div className="absolute top-[72px] mt-2 z-10 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {schoolYears.map((year, index) => (
              // Year rows
              <div key={index}>
                <div
                  onMouseEnter={() => handleYearHover(index + 1)}
                  className={`${
                    openYear === index + 1
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  } block px-4 py-2 text-sm`}
                >
                  {year}
                </div>

                {openYear === index + 1 && (
                  <div
                    className="absolute left-full ml-1 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1"
                    style={{ top: `${index * 36}px` }}
                  >
                    {[1, 2, 3, 4].map((module) => (
                      // Module rows
                      <Link
                        key={module}
                        to={`/module/${index + 1}/${module}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => toggleDropdown()}
                      >
                        Module {module}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/portfolio"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onMouseEnter={() => handleYearHover(null)}
            >
              Officieel portfolio
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
