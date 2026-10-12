import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { SchoolYears } from "../types";

interface DropdownMenuProps {
  schoolYears: SchoolYears;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ schoolYears }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setOpenYear(null);
  };

  const handleYearHover = (yearNumber: string | null) => {
    setOpenYear(yearNumber);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenYear(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="h-16 w-16 bg-[#a1a6a2] hover:bg-[#8f9490] rounded flex justify-center items-center">
        <Bars3Icon
          onClick={toggleDropdown}
          className="h-12 w-12 text-white cursor-pointer"
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
                  } block px-4 py-2 text-sm cursor-default`}
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
              onClick={() => toggleDropdown()}
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
