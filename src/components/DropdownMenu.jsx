import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/20/solid";

const DropdownMenu = ({ schoolYears }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openYear, setOpenYear] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setOpenYear(null);
  };

  const handleYearHover = (yearNumber) => {
    setOpenYear(yearNumber);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenYear(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
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
            {Object.entries(schoolYears).map(([year, modules]) => (
              <div key={year}>
                <div
                  onMouseEnter={() => handleYearHover(year)}
                  className={`${
                    openYear === year
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700"
                  } block px-4 py-2 text-sm`}
                >
                  Leerjaar {year}
                </div>

                {openYear === year && (
                  <div
                    className="absolute left-full ml-1 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1"
                    style={{ top: `${(parseInt(year) - 1) * 36}px` }}
                  >
                    {modules.map((module) => (
                      <Link
                        key={module}
                        to={`/module/${year}/${module}`}
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
